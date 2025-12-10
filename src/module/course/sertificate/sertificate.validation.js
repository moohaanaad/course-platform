import joi from 'joi' 


export const createSertificateVal = joi.object({
    courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
})