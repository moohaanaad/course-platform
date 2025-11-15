import { messages } from "../../common/messages/message.js"
import { Banner } from "../../db/model/banner.js"
import { successResponse } from "../../utils/res/index.js"

//create banner
export const createBanner = async (req, res, next) => {

    if (!req.file) throw new Error(messages.banner.requiredBanner)

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
    if (!banners.length) throw new Error(messages.banner.notFound, { cause: 404 })

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
    if (!bannerExist) throw new Error(messages.banner.notFound, { cause: 404 })

    //res
    successResponse({ res, message: messages.banner.getSpecific, data: bannerExistz })
}