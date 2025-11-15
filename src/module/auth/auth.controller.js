import { genderTypes } from "../../common/constant/index.js"
import { messages } from "../../common/messages/message.js"
import { Otp } from "../../db/model/otp.js"
import { User } from "../../db/model/user.js"
import { sendEmail } from "../../utils/sendEmail.js"
import randomstring from 'randomstring'
import { generateToken } from "../../utils/token/generate.js"
import { comparePassword } from "../../utils/bcrypt/index.js"

export const sendOtpToEmail = async (email) => {
    //check Existence 
    const userOTP = await Otp.findOne({ email })
    if (userOTP) throw new Error(messages.OTP.haveOTP, { cause: 400 })

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
    if (userExict) throw new Error(messages.user.alreadyExist, { cause: 400 })   

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

    return res.status(200).json({ message: messages.user.signupSuccess, data: createdUser })
}

//resend OTP message
export const resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body

        await sendOtpToEmail(email)

        return res.status(200).json({ success: true, message: messages.OTP.OTPSent })

    } catch (error) {
        next(error)
    }

}

//verify
export const verify = async (req, res, next) => {
    const { email, otp } = req.body

    // check otp existence
    const user = await Otp.findOne({ email })
    if (!user) {
        if (!user?.otp) throw new Error(messages.OTP.expiredOTP)
        throw new Error(messages.user.notFound, { cause: 404 })
    }
    if (otp !== user.otp) throw new Error(messages.OTP.invalidOTP, { cause: 401 })

    //check user existence
    const updatedUser = await User.findOne({ email })
    if (!updatedUser) throw new Error(messages.user.notFound, { cause: 500 })
    if (updatedUser.isConfirmed) throw new Error(messages.user.alreadyVerified, { cause: 400 })

    //preapre data
    updatedUser.isConfirmed = true

    //update user
    await updatedUser.save()
    return res.status(200).json({ message: messages.user.verfiedSuccessfully ,data: updatedUser})

}

//login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const userExist = await User.findOne({ email })
        if (!userExist) return next(new Error(messages.user.notFound, { cause: 404 }))
        if (userExist?.isConfirmed == false) return next(new Error(messages.user.notConfirmed))

        const comparedPassword = await comparePassword(password, userExist.password)
        if (!comparedPassword) {
            console.log(comparedPassword);
            
            return next(new Error(messages.user.notFound, { cause: 404 }))
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

        return res.status(200).json({
            message: 'login successfully',
            access_token,
            refresh_token
        })
    } catch (error) {
        next(error)
    }
}

//refresh token
export const refreshToken = async (req, res, next) => {
    try {

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

    } catch (error) {
        next(error)
    }
}

// forget password
export const forgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body

        //check existence
        const userExist = await User.findOne({ email })
        if (!userExist) return next(new Error(messages.user.notFound, { cause: 404 }))
        if (userExist.isConfirmed == false) return next(new Error(messages.user.notConfirmed))

        //send otp email
        await sendOtpToEmail(email)

        return res.status(200).json({ success: true, message: messages.OTP.OTPSent })

    } catch (error) {
        next(error)
    }
}

//change password
export const changePassword = async (req, res, next) => {
    const { email, otp, password } = req.body

    //check existence
    const otpExist = await Otp.findOne({ email, otp })
    if (!otpExist) next(new Error(messages.OTP.invalidOTP, { cause: 409 }))

    const updatedUser = await User.findOneAndUpdate({ email }, { password })

    return res.status(200).json({
        success: true,
        message: messages.user.updatedSuccessfully,
        data: updatedUser
    })

}