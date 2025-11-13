import joi from "joi";
import { genderTypes } from "../../common/constant/index.js";


export const signupVal = joi.object({
    firstname: joi.string().min(3).max(30).required(),
    lastname: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    phone: joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: joi.string().min(8).max(32).pattern(
        new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=[\\]{};:"\\\\|,.<>/?]).+$')
    ).required(),
    gender: joi.string().valid(...Object.values(genderTypes)),
    university: joi.string().min(3).max(30).required(),
    faculty: joi.string().min(3).max(30).required(),
    Specializations: joi.array()
    .items(
      joi.string().trim().min(1).required()
    ).min(1).required(),
    civilIdPic: joi.string().optional(),
})