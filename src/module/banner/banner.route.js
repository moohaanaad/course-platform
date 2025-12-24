import { Router } from "express";
import { asyncHandler, isAuthenticate, isAuthorized, isValid } from "../../middleware/index.js";
import * as bannerController from "./banner.controller.js";
import { idVal } from "../../common/common.validation.js";
import { fileuploadPublic } from "../../utils/multer/fileuploadCloud.js";
import { roleTypes } from "../../common/constant/user.js";


const bannerRouter = Router()

//all routes were authenticated
bannerRouter.use(isAuthenticate())

//create banner
bannerRouter.post('/',
    isAuthorized([roleTypes.ADMIN]),
    fileuploadPublic({ mainFolder: 'image', partFolder: 'banner' }).single('banner'),
    asyncHandler(bannerController.createBanner)
)

//get all banner
bannerRouter.get('/',
    asyncHandler(bannerController.allBanner)
)

//get specific banner 
bannerRouter.get('/:id',
    isValid(idVal('id')),
    asyncHandler(bannerController.specificBanner)
)

//update banner 
bannerRouter.put('/:id',
    isAuthorized([roleTypes.ADMIN]),
    fileuploadPublic({ mainFolder: 'image', partFolder: 'banner' }).single('banner'),
    isValid(idVal('id')),
    asyncHandler(bannerController.updateBanner)
)

//delete banner 
bannerRouter.delete('/:id',
    isAuthorized([roleTypes.ADMIN]),
    isValid(idVal('id')),
    asyncHandler(bannerController.deleteBanner)
)

export default bannerRouter