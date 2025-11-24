import joi from 'joi'




// const sections = [{
//     name: joi.string().min(2).max(30).required(),

//     price: joi.number().required(),
// }]

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
        })).min(1),
})