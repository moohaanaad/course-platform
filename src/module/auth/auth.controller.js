import { genderTypes } from "../../common/constant/index.js"
import { messages } from "../../common/messages/message.js"
import { Otp } from "../../db/model/otp.js"
import { User } from "../../db/model/user.js"
import { sendEmail } from "../../utils/sendEmail.js"
import randomstring from 'randomstring'

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

    const { email, phone, } = req.body
    
    //check exictence
    const userExict = await User.findOne({ $or: [{ email }, { phone }] })
    if (userExict) {
        console.log(userExict);
        throw new Error(messages.user.alreadyExist, { cause: 400 })
    }

    //prepare data  
    if (req.body.gender == genderTypes.MALE) {
        req.body.profilePic = "uploads/User/default-male.jpg"
    } else {
        req.body.profilePic = "uploads/User/default-female.png"
    }

    // prepare data 
    const code = randomstring.generate(7)
    console.log(code);

    req.body.code = code
    req.body.civilIdPic = req.file.path

    //save acc
    const createdUser = await User.create(req.body)

    //send email
    await sendOtpToEmail(email)

    return res.status(200).json({ message: messages.user.signupSuccess, data: createdUser })
}