import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../middleware/index.js";
import * as bannerController from "./banner.controller.js";
import { idVal } from "../../common/common.validation.js";
import { fileuploadPublic } from "../../utils/multer/fileuploadCloud.js";


const bannerRouter = Router()

//all routes were authenticated
bannerRouter.use(isAuthenticate())

//create banner
bannerRouter.post('/',
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
    fileuploadPublic({ mainFolder: 'image', partFolder: 'banner' }).single('banner'),
    isValid(idVal('id')),
    asyncHandler(bannerController.updateBanner)
)

//delete banner 
bannerRouter.delete('/:id',
    isValid(idVal('id')),
    asyncHandler(bannerController.deleteBanner)
)

export default bannerRouter