import { genderTypes } from "../../common/constant/index.js"
import { messages } from "../../common/messages/message.js"
import { Otp } from "../../db/model/otp.js"
import { User } from "../../db/model/user.js"
import { sendEmail } from "../../utils/sendEmail.js"
import randomstring from 'randomstring'
import { generateToken } from "../../utils/token/generate.js"
import { comparePassword } from "../../utils/bcrypt/index.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"

export const sendOtpToEmail = async (email) => {
    //check Existence 
    const userOTP = await Otp.findOne({ email })
    if (userOTP) errorResponse({ message: messages.OTP.haveOTP, statusCode: 400 })

    //send email
    const otp = randomstring.generate({ length: 5, charset: "numeric" })
    await Otp.create({ email, otp })
    await sendEmail({
        to: email,
        subject: "verify your account before 15 minutes",
        otp
    })
}

//signup
export const signup = async (req, res, next) => {

    const { email, phone } = req.body

    //check exictence
    const userExict = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExict) errorResponse({ message: messages.user.alreadyExist, statusCode: 400 })

    //prepare data  
    if (req.body.gender == genderTypes.MALE) {
        req.body.profilePic = "uploads/User/default-male.jpg"
    } else {
        req.body.profilePic = "uploads/User/default-female.png"
    }

    // prepare data 
    const code = randomstring.generate(7)

    req.body.code = code
    req.body.civilIdPic = req.file.path

    //save acc
    const createdUser = await User.create(req.body)

    //send email
    await sendOtpToEmail(email)

    successResponse({
        res,
        message: messages.user.signupSuccess,
        statusCode: 200,
        data: createdUser
    })
}

//resend OTP message
export const resendOTP = async (req, res, next) => {

    const { email } = req.body

    await sendOtpToEmail(email)

    successResponse({
        res,
        message: messages.OTP.OTPSent,
        statusCode: 200
    })
}

//verify
export const verify = async (req, res, next) => {
    const { email, otp } = req.body

    // check otp existence
    const user = await Otp.findOne({ email })
    if (!user) {
        errorResponse({ message: messages.OTP.expiredOTP, statusCode: 400 })
    }
    if (otp !== user.otp) errorResponse({ message: messages.OTP.invalidOTP, statusCode: 401 })

    //check user existence
    const updatedUser = await User.findOne({ email })
    if (!updatedUser) errorResponse({ message: messages.user.notFound, statusCode: 404 })
    if (updatedUser.isConfirmed) errorResponse({ message: messages.user.alreadyVerified, statusCode: 400 })

    //preapre data
    updatedUser.isConfirmed = true

    //update user
    await updatedUser.save()
    successResponse({
        res,
        message: messages.user.verfiedSuccessfully,
        statusCode: 200,
        data: updatedUser
    })

}

//login
export const login = async (req, res, next) => {
    const { email, password } = req.body

    const userExist = await User.findOne({ email })
    if (!userExist) errorResponse({ message: messages.user.notFound, statusCode: 404 })
    if (userExist?.isConfirmed == false) errorResponse({ message: messages.user.notConfirmed, statusCode: 403 })

    const comparedPassword = await comparePassword(password, userExist.password)
    if (!comparedPassword) errorResponse({ message: messages.user.notFound, statusCode: 404 })


    //prepare data 
    const access_token = generateToken({
        payload: { _id: userExist._id },
        opption: { expiresIn: "1h" }

    })
    const refresh_token = generateToken({
        payload: { _id: userExist._id },
        opption: { expiresIn: "7d" }
    })
    userExist.isActive = true
    await userExist.save()

    return res.status(200).json({
        message: 'login successfully',
        access_token,
        refresh_token
    })

}

//refresh token
export const refreshToken = async (req, res, next) => {


    const { refresh_token } = req.body

    //verify token 
    const result = verifyToken({ token: refresh_token })
    if (result?.error) return next(result.error)

    //generate token 

    const accessToken = generateToken({
        payload: { _id: result._id },
        opption: { expiresIn: '1h' }
    })

    return res.json({ success: true, access_token: accessToken })
}

// forget password
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body

    //check existence
    const userExist = await User.findOne({ email })
    if (!userExist) errorResponse({ message: messages.user.notFound, statusCode: 404 })
    if (userExist.isConfirmed == false) errorResponse({ message: messages.user.notConfirmed, statusCode: 403 })

    //send otp email
    await sendOtpToEmail(email)

    successResponse({
        res,
        statusCode: 200,
        message: messages.OTP.OTPSent
    })

}

//change password
export const changePassword = async (req, res, next) => {
    const { email, otp, password } = req.body

    //check existence
    const otpExist = await Otp.findOne({ email, otp })
    if (!otpExist) errorResponse({ message: messages.OTP.invalidOTP, statusCode: 409 })

    const userExist = await User.findOne({ email })
    if (!userExist) errorResponse({ message: messages.user.notFound, statusCode: 404 })


    //prepare data
    userExist.password = password
    userExist.isActive = false

    //save data 
    await userExist.save()

    console.log(userExist.password);
    await Otp.deleteOne({ email, otp })

    return res.status(200).json({
        success: true,
        message: messages.user.updatedSuccessfully,
        data: userExist
    })

}