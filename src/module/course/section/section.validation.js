import joi from 'joi'

export const updateSectionVal = joi.object({
    id: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    sections: joi.array().items(
        joi.object({
            name: {
                ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
                    "string.pattern.base": "Arabic section name must contain only Arabic letters"
                }).optional(),
                en: joi.string().min(3).max(30).optional(),
            },
            price: joi.number().optional(),
            videos: joi.array().items(
                joi.object({
                    name: {
                        ar: joi.string().min(3).pattern(/^[\u0600-\u06FF\s]+$/).max(30).messages({
                            "string.pattern.base": "Arabic video name must contain only Arabic letters"
                        }).optional(),
                        en: joi.string().min(3).max(30).optional(),
                    }
                })
            )
        })
    ).min(1)
})