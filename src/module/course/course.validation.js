import joi from 'joi'


export const createCourseVal = joi.object({
    name: joi.string().min(2).max(30).required(),
    description: joi.string().min(2).max(150).required(),
    price: joi.number().required(),
    sections: joi.array().items(
        joi.object({
            name: joi.string().trim().required(),
            price: joi.number().required(),
            videos: joi.array().items(
                joi.object({ name: joi.string().trim().required() })
            ).min(1),
        })
    ).min(1),
    startAt: joi.date().greater('now').required(),
    endAt: joi.date().greater(joi.ref('startAt')).required(),
    instracter: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()

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

export const updateSectionVal = joi.object({
    sectionId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    sections: joi.array().items(
        joi.object({
            name: joi.string().trim().optional(),
            price: joi.number().optional(),
            videos: joi.array().items(
                joi.object({ name: joi.string().trim().optional() })
            )
        })
    ).min(1)
})