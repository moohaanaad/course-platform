import { messages } from "../../common/messages/message.js"
import { Banner } from "../../db/model/banner.js"
import { deleteFile } from "../../utils/multer/deletefille.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"

//create banner
export const createBanner = async (req, res, next) => {

    if (!req.file) errorResponse({ res, message: messages.banner.requiredBanner, statusCode: 422 })

    //prepare data
    const preparedData = {
        image: req.file.path,
        createdBy: req.user._id,
        updatedBy: req.user._id,
    }

    //save data
    const createdBanner = await Banner.create(preparedData)

    //response 
    successResponse({
        res,
        statusCode: 201,
        message: messages.banner.createdSuccessfully,
        data: createdBanner
    })
}

//get all banner
export const allBanner = async (req, res, next) => {

    const banners = await Banner.find()
    if (!banners.length) errorResponse({ message: messages.banner.notFound, statusCode: 404 })

    return successResponse({
        res,
        statusCode: 200,
        message: messages.banner.getAll,
        data: banners
    })
}

//specific banner
export const specificBanner = async (req, res, next) => {
    const { id } = req.params

    //check existnece 
    const bannerExist = await Banner.findById(id)
    if (!bannerExist) errorResponse({ message: messages.banner.notFound, statusCode: 404 })

    //res
    successResponse({ res, message: messages.banner.getSpecific, data: bannerExistz })
}

//update banner
export const updateBanner = async (req, res, next) => {
    const { id } = req.params

    //check existnece 
    const bannerExist = await Banner.findById(id)
    if (!bannerExist) errorResponse({ message: messages.banner.notFound, statusCode: 404 })

    if (!req.file) errorResponse({ message: messages.banner.requiredBanner, statusCode: 422 })

    //prepare data
    deleteFile(bannerExist.image)
    bannerExist.image = req.file.path
    bannerExist.updatedBy = req.user._id

    //save data
    bannerExist.save()

    //response 
    successResponse({
        res,
        message: messages.banner.updatedSuccessfully,
        data: bannerExist,
        statusCode: 200
    })

}

//delete banner 
export const deleteBanner = async (req, res, next) => {
    const { id } = req.params

    //check existnece 
    const deletedBanner = await Banner.findByIdAndDelete(id)
    if (!deletedBanner) errorResponse({ message: messages.banner.notFound, statusCode: 404 })

    //response
    successResponse({
        res,
        message: messages.banner.deletedSuccessfully,
        statusCode: 200
    })
}