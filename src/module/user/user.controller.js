import { messages } from "../../common/messages/message.js"
import { User } from "../../db/model/user.js"
import { deleteFile } from "../../utils/multer/deletefille.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"


//get user profile
export const userProfile = async (req, res, next) => {
    const { user } = req

    return successResponse({
        res,
        statusCode: 200,
        data: user
    })
}

//update user 
export const updateUser = async (req, res, next) => {
    const { user } = req
    const { phone, firstname, lastname, university, faculty, Specializations } = req.body

    //check existence
    if (phone && phone !== user.phone) {
        const userExist = await User.findOne({ phone })
        if (userExist) errorResponse({ message: messages.user.phone, statusCode: 400 })
    }
    //prepare data
    const updateableFields = {
        phone,
        firstname,
        lastname,
        university,
        faculty,
        Specializations
    };

    //change data
    for (const [key, value] of Object.entries(updateableFields)) {
        if (value !== undefined && value !== "" && value.length !== 0) {
            user[key] = value;
        }
    }

    //save
    await user.save()

    successResponse({
        res,
        message: messages.user.updatedSuccessfully,
        statusCode: 200,
        data: user
    })
}

//change profile pic
export const changeProfilePic = async (req, res, next) => {
    const { user, file } = req

    if (!file.path) errorResponse({ message: messages.image.invalidImage, statusCode: 409 })

    //prepare data
    deleteFile(user.profilePic)
    user.profilePic = file.path

    //save 
    await user.save()

    successResponse({
        res,
        message: messages.image.uploaded,
        statusCode: 200,
        data: user
    })
}

//cahnge user civil id pic
export const changecivilIdPic = async (req, res, next) => {
    const { user, file } = req

    if (!file.path) errorResponse({ message: messages.image.invalidImage, statusCode: 409 })

    //prepare data
    if (user.civilIdPic) deleteFile(user.civilIdPic)

    user.civilIdPic = file.path

    //save 
    await user.save()

    successResponse({
        res,
        message: messages.image.uploaded,
        statusCode: 200,
        data: user
    })
}