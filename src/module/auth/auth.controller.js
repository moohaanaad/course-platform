import { genderTypes, roleTypes } from "../../common/constant/index.js"
import { messages } from "../../common/messages/message.js"
import { Otp } from "../../db/model/otp.js"
import { User } from "../../db/model/user.js"
import { sendEmail } from "../../utils/sendEmail.js"
import { generateToken } from "../../utils/token/generate.js"
import { comparePassword, hashPassword } from "../../utils/bcrypt/index.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"
import { verifyToken } from "../../utils/token/verify.js"
import randomstring from 'randomstring'
export const sendOtpToEmail = async (email, res) => {
    //check Existence 
    const userOTP = await Otp.findOne({ email })
    if (userOTP) errorResponse({ res, message: messages.OTP.haveOTP, statusCode: 400 })

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

    const { email, phone, deviceId } = req.body

    //check exictence
    const userExict = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExict?.email == req.body.email) errorResponse({ res, message: messages.user.email, statusCode: 400 })
    if (userExict?.phone == req.body.phone) errorResponse({ res, message: messages.user.phone, statusCode: 400 })

    //prepare data  
    if (req.body.gender == genderTypes.MALE) {
        req.body.profilePic = {
            url: "uploads/User/default-male.jpg",
            key: "www"
        }
    } else {
        req.body.profilePic = {
            url: "uploads/User/default-female.jpg",
            key: "www"
        }
    }

    // prepare data 
    req.body.civilIdPic = req?.file?.key
    req.body.deviceId = hashPassword(deviceId)
    //save acc
    const createdUser = await User.create(req.body)

    //send email
    await sendOtpToEmail(email, res)

    return successResponse({
        res,
        message: messages.user.signupSuccess,
        statusCode: 200,
        data: createdUser
    })
}

//resend OTP message
export const resendOTP = async (req, res, next) => {

    const { email } = req.body

    await sendOtpToEmail(email, res)

    return successResponse({
        res,
        message: messages.OTP.OTPSent,
        statusCode: 200
    })
}

//verify
export const verify = async (req, res, next) => {
    const { email, otp } = req.body

    // check otp existence
    const otpExist = await Otp.findOne({ email })
    if (!otpExist) {
        errorResponse({ res, message: messages.OTP.expiredOTP, statusCode: 400 })
    }
    if (otp !== otpExist.otp) errorResponse({ res, message: messages.OTP.invalidOTP, statusCode: 401 })

    //check user existence
    const updatedUser = await User.findOne({ email })
    if (!updatedUser) errorResponse({ res, message: messages.user.notFound, statusCode: 404 })
    if (updatedUser.isConfirmed) errorResponse({ res, message: messages.user.alreadyVerified, statusCode: 400 })

    //preapre data
    updatedUser.isConfirmed = true
    otpExist.distroyedAt = new Date();
    await otpExist.save();
    //update user
    await updatedUser.save()
    return successResponse({
        res,
        message: messages.user.verfiedSuccessfully,
        statusCode: 200
    })

}

//login
export const login = async (req, res, next) => {
    let { email, password, deviceId } = req.body

    const userExist = await User.findOne({ email })
    if (!userExist) errorResponse({ res, message: messages.user.invaledLogin, statusCode: 404 })
    if (userExist?.isConfirmed == false) errorResponse({ res, message: messages.user.notConfirmed, statusCode: 403 })

    const comparedPassword = await comparePassword(password, userExist.password)
    if (!comparedPassword) errorResponse({ res, message: messages.user.invaledLogin, statusCode: 404 })

    if (userExist.role == roleTypes.STUDENT) {
        if (userExist.deviceId) {
            const comparedDeviceId = await comparePassword(deviceId, userExist.deviceId)
            if (!comparedDeviceId) errorResponse({ res, message: messages.user.invaledDeviceId, statusCode: 404 })
        } else {
            deviceId = hashPassword(deviceId)
            await User.updateOne({ email }, { deviceId: deviceId })
        }
    }

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

    return successResponse({
        res,
        message: messages.user.login,
        data: {
            access_token,
            refresh_token
        },
        statusCode: 200,
        success: true
    })
}

//refresh token
export const refreshToken = async (req, res, next) => {


    const { refresh_token, deviceId } = req.body

    //verify token 
    const result = verifyToken({ token: refresh_token })
    if (result?.error) return next(result.error)

    const userExist = await User.findById(result._id).lean()
    if (userExist.role == roleTypes.STUDENT) {
        const comparedDeviceId = await comparePassword(deviceId, userExist.deviceId)
        if (!comparedDeviceId) errorResponse({ res, message: messages.user.invaledDeviceId, statusCode: 404 })
    }
    //generate token 
    const accessToken = generateToken({
        payload: { _id: result._id },
        opption: { expiresIn: '1h' }
    })

    return successResponse({
        res,
        message: messages.token.refreshToken,
        data: {
            access_token: accessToken
        },
        statusCode: 200,
        success: true
    })
}

// forget password
export const forgetPassword = async (req, res, next) => {
    const { email } = req.body

    //check existence
    const userExist = await User.findOne({ email })
    if (!userExist) errorResponse({ res, message: messages.user.notFound, statusCode: 404 })
    if (userExist.isConfirmed == false) errorResponse({ res, message: messages.user.notConfirmed, statusCode: 403 })

    //send otp email
    await sendOtpToEmail(email, res)
    userExist.isActive = false
    userExist.isConfirmed = false
    await userExist.save()
    return successResponse({
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
    if (!otpExist) errorResponse({ res, message: messages.OTP.invalidOTP, statusCode: 409 })

    const userExist = await User.findOne({ email })
    if (!userExist) errorResponse({ res, message: messages.user.notFound, statusCode: 404 })


    //prepare data
    userExist.password = password
    userExist.isActive = false

    //save data 
    await userExist.save()

    await Otp.deleteOne({ email, otp })

    return successResponse({
        res,
        message: messages.user.changedPasswordSuccessfully,
        statusCode: 200,
        success: true
    })

}