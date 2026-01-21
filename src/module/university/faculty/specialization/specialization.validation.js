import joi from 'joi'

export const createSpecializationVal = joi.object({
    universityId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    facultyId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    name: joi.object({
        ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
            "string.pattern.base": "Arabic name must contain only Arabic letters"
        }).required(),
        en: joi.string().min(3).max(30).required(),
    }),
})

export const updateSpecializationVal = joi.object({
    universityId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    facultyId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    specializationId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    name: joi.object({
        ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
            "string.pattern.base": "Arabic name must contain only Arabic letters"
        }).required(),
        en: joi.string().min(3).max(30).required(),
    }),
})