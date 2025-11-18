import { Router } from "express";
import { asyncHandler, isAuthenticate } from "../../middleware/index.js";
import * as userController from "./user.controller.js";
import { fileupload } from "../../utils/multer/fileuploads.js";


const userRouter = Router()

userRouter.use(isAuthenticate())

//get user profile data
userRouter.get('/profile',
    asyncHandler(userController.userProfile)
)

//update user data
userRouter.put('/profile',
    asyncHandler(userController.updateUser)
)

//cahnge user profile pic
userRouter.put('/profile-pic',
    fileupload({mainFolder:'user', partFolder: 'profilePic'}).single('profilePic'),
    asyncHandler(userController.changeProfilePic)
)

//cahnge user civil id pic
userRouter.put('/civilid-pic',
    fileupload({mainFolder:'user', partFolder: 'civilIdPic'}).single('civilIdPic'),
    asyncHandler(userController.changecivilIdPic)
)




export default userRouter