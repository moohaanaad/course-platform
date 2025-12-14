import joi from 'joi'


export const createCourseVal = joi.object({
    name: joi.object({
        ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
            "string.pattern.base": "Arabic name must contain only Arabic letters"
        }).required(),
        en: joi.string().min(3).max(30).required(),
    }),
    description: joi.object({
        ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(150).messages({
            "string.pattern.base": "Arabic description must contain only Arabic letters"
        }).required(),
        en: joi.string().min(3).max(150).required(),
    }),
    price: joi.number().required(),
    sections: joi.array().items(
        joi.object({
            name: joi.object({
                ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
                    "string.pattern.base": "Arabic section name must contain only Arabic letters"
                }).required(),
                en: joi.string().min(3).max(30).required(),
            }),
            price: joi.number().required(),
            videos: joi.array().items(
                joi.object({
                    name: joi.object({
                        ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
                            "string.pattern.base": "Arabic video name must contain only Arabic letters"
                        }).required(),
                        en: joi.string().min(3).max(30).required(),
                    })
                })
            ).min(1),
        })
    ).min(1),
    startAt: joi.date().greater('now').required(),
    endAt: joi.date().greater(joi.ref('startAt')).required(),
    instructor: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()

})

export const updatedCourseVal = joi.object({
    id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    name: joi.string().min(2).max(30).optional(),
    description: joi.string().min(2).max(150).optional(),
    price: joi.number().optional(),
    sections: joi.array().items(
        joi.object({
            name: joi.string().trim().optional(),
            price: joi.number().optional(),
            videos: joi.array().items(
                joi.object({ name: joi.string().trim().optional() })
            ).min(1),
        }).optional()
    ).optional(),
    startAt: joi.date().greater('now').optional(),
    endAt: joi.date().greater(joi.ref('startAt')).optional(),

})
