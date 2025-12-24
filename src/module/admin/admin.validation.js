import joi from 'joi'
import { genderTypes, roleTypes } from '../../common/constant/index.js'

export const createUserVal = joi.object({
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
    password: joi.string().min(8).max(32).required(),
    gender: joi.string().valid(...Object.values(genderTypes)).required(),
    role: joi.string().valid(roleTypes.ADMIN, roleTypes.INSTRUCTOR).required()
})


export const updateInstructorSalaryVal = joi.object({
    instructorId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid ID format'
    }),
    amount: joi.number().min(0).required().messages({
        'number.min': 'amount can not be negative'
    })
})