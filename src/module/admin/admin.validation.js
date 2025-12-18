import joi from 'joi'


export const updateInstructorSalaryVal = joi.object({
    instructorId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
        'string.pattern.base': 'Invalid ID format'
    }),
    amount: joi.number().min(0).required().messages({
        'number.min': 'amount can not be negative'
    })
})