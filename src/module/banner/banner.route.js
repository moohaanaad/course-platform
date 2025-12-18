import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../middleware/index.js";
import { fileupload } from "../../utils/multer/fileuploads.js";
import * as bannerController from "./banner.controller.js";
import { idVal } from "../../common/common.validation.js";


const bannerRouter = Router()

//all routes were authenticated
bannerRouter.use(isAuthenticate())

//create banner
bannerRouter.post('/',
    fileupload({ mainFolder: 'image', partFolder: 'banner' }).single('banner'),
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
    fileupload({ mainFolder: 'image', partFolder: 'banner' }).single('banner'),
    isValid(idVal('id')),
    asyncHandler(bannerController.updateBanner)
)

//delete banner 
bannerRouter.delete('/:id',
    isValid(idVal('id')),
    asyncHandler(bannerController.deleteBanner)
)

export default bannerRouter