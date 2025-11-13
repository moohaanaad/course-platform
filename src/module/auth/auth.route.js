import { Router } from "express"
import { asyncHandler } from "../../middleware/async-handler.js"
import { signup } from "./auth.controller.js"
import { isValid } from "../../middleware/validation.js"
import * as Val from "./auth.validation.js"
import { parseJsonFields } from "../../middleware/parseJsonFields.js"
import { fileupload } from "../../utils/multer/fileuploads.js"


const authRouter = Router()

//create account
authRouter.post('/signup',
    fileupload({mainFolder:'user', partFolder: 'civilIdPic'}).single('civilIdPic'),
    parseJsonFields,
    isValid(Val.signupVal),
    asyncHandler(signup)
)
 

export default authRouter