import joi from "joi";
import { genderTypes } from "../../common/constant/index.js";


export const signupVal = joi.object({
    firstname: joi.object({
        ar: joi.string().min(3).max(30).pattern(/^[\u0600-\u06FF\s]+$/).messages({
            "string.pattern.base": "Arabic firstname must contain only Arabic letters"
        }).required(),
        en: joi.string().min(3).max(30).required(),
    }),
    lastname: joi.object({
        ar: joi.string().min(3).max(30).pattern(/^[\u0600-\u06FF\s]+$/).messages({
            "string.pattern.base": "Arabic lastname must contain only Arabic letters"
        }).required(),
        en: joi.string().min(3).max(30).required(),
    }),
    email: joi.string().email().required(),
    phone: joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: joi.string().min(8).max(32).pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:"\\\\|,.<>/?]).+$')
    ).required(),
    gender: joi.string().valid(...Object.values(genderTypes)),
    university: joi.string().min(3).max(30).required(),
    faculty: joi.string().min(3).max(30).required(),
    Specializations: joi.array().items(
        joi.string().trim().min(1).required()
    ),
    civilIdPic: joi.string().optional(),
})

//login
export const signinVal = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
})

// refresh token
export const refreshToken = joi.object({
    refresh_token: joi.string().required()
})

export const vrefiy = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required()
})

export const forgetPassword = joi.object({
    email: joi.string().email().required()
})


export const changePassword = joi.object({
    email: joi.string().email().required(),
    otp: joi.string().required(),
    password: joi.string().required(),
    repassword: joi.string().valid(joi.ref('password')),
})

