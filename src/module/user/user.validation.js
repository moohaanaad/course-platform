import joi from "joi"

export const updateUserVal = joi.object({
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
    phone: joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
    university: joi.string().min(3).max(30),
    faculty: joi.string().min(3).max(30),
    Specializations: joi.array().items(
        joi.string().trim().min(1)
    ),
})
