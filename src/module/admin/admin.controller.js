import { messages } from "../../common/messages/message.js"
import { User } from "../../db/model/user.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"



export const createUser = async (req, res, next) => {
    const { email, phone } = req.body

    //check eixstence 
    const emailExsit = await User.findOne({ email })
    if (emailExsit) errorResponse({ res, message: messages.user.email, statusCode: 400 })

    const phoneExsit = await User.findOne({ phone })
    if (phoneExsit) errorResponse({ res, message: messages.user.phone, statusCode: 400 })
    const createdUser = await User.create(req.body)
    return successResponse({
        res,
        message: messages.user.createdSuccessfully,
        statusCode: 201,
        data: createdUser
    })
}