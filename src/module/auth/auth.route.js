import { Router } from "express"
import { asyncHandler, isValid, parseJsonFields } from "../../middleware/index.js"
import { fileupload } from "../../utils/multer/fileuploads.js"
import * as authController from "./auth.controller.js"
import * as val from "./auth.validation.js"
import { fileuploadPrivate } from "../../utils/multer/fileuploadCloud.js"

const authRouter = Router()

//create account
authRouter.post('/signup',
    fileuploadPrivate({ mainFolder: 'user', partFolder: 'civilIdPic' }).single('civilIdPic'),
    parseJsonFields,
    isValid(val.signupVal),
    asyncHandler(authController.signup)
)

//signin
authRouter.put('/login',
    isValid(val.signinVal),
    asyncHandler(authController.login)
)

//verify
authRouter.patch('/verify-account',
    asyncHandler(authController.verify)
)

//resend OTP
authRouter.patch('/resend',
    asyncHandler(authController.resendOTP)
)

// refresh token
authRouter.patch('/refresh-token',
    isValid(val.refreshToken),
    asyncHandler(authController.refreshToken)
)

//forget password
authRouter.patch('/forget-password',
    isValid(val.forgetPassword),
    asyncHandler(authController.forgetPassword)
)

//change password
authRouter.put('/change-password',
    isValid(val.changePassword),
    asyncHandler(authController.changePassword)
)
 

export default authRouter