import joi from 'joi' 


export const createCertificateVal = joi.object({
    courseId: joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
})