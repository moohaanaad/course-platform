import joi from 'joi'

export const idVal = (fieldName) => {
    return joi.object({
        [fieldName]: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
            'string.pattern.base': 'Invalid ID format'
        }),
    })
}