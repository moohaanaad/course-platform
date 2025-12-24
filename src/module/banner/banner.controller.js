import { messages } from "../../common/messages/message.js"
import { Banner } from "../../db/model/banner.js"
import { deleteFile } from "../../utils/multer/deletefille.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"

//create banner
export const createBanner = async (req, res, next) => {

    if (!req.file) errorResponse({ res, message: messages.banner.requiredBanner, statusCode: 422 })

    //prepare data
    const preparedData = {
        image: {
            key: req.file.key,
            url: req.file.location
        },
        createdBy: req.user._id,
        updatedBy: req.user._id,
    }

    //save data
    const createdBanner = await Banner.create(preparedData)

    //response 
    return successResponse({
        res,
        statusCode: 201,
        message: messages.banner.createdSuccessfully,
        data: createdBanner
    })
}

//get all banner
export const allBanner = async (req, res, next) => {

    const banners = await Banner.find()
    if (!banners.length) errorResponse({ res, message: messages.banner.notFound, statusCode: 404 })

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
    if (!bannerExist) errorResponse({ res, message: messages.banner.notFound, statusCode: 404 })

    //res
    return successResponse({ res, message: messages.banner.getSpecific, data: bannerExist, statusCode: 200 })
}

//update banner
export const updateBanner = async (req, res, next) => {
    const { id } = req.params

    //check existnece 
    const bannerExist = await Banner.findById(id)
    if (!bannerExist) errorResponse({ res, message: messages.banner.notFound, statusCode: 404 })

    if (!req.file) errorResponse({ res, message: messages.banner.requiredBanner, statusCode: 422 })

    //prepare data
    await deleteFile(bannerExist.image.key)
    bannerExist.image = {
        key: req.file.key,
        url: req.file.location
    }
    bannerExist.updatedBy = req.user._id

    //save data
    bannerExist.save()

    //response 
    return successResponse({
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
    if (!deletedBanner) errorResponse({ res, message: messages.banner.notFound, statusCode: 404 })

    //delete file from spaces
    await deleteFile(deletedBanner.image.key)

    //response
    return successResponse({
        res,
        message: messages.banner.deletedSuccessfully,
        statusCode: 200
    })
}