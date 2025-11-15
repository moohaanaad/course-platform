import { messages } from "../common/messages/message.js"
import { User } from "../db/model/user.js"
import { verifyToken } from "../utils/token/index.js"


export const isAuthenticate = () => {
    return async (req, res, next) => {
        const { token } = req.headers
        
        //check token start with lol
        if (!token && !token.startsWith("bearer"))
            return next(new Error(messages.token.invalid, { cause: 401 }))
        
        const payload = token.split(" ")[1]
        
        //verify token
        const result  = verifyToken({token:payload})
        if (result?.error)
            return next(result.error)

        //check user existence
        
        const userExist = await User.findOne({ _id: result._id, isActive: true })
        if (!userExist)
            return next(new Error(messages.token.unauthenticate, { cause: 401 }))

        //prepare data
        req.user = userExist
        next()
    }
} 