import { Router } from "express";
import { asyncHandler, isAuthenticate } from "../../middleware/index.js";
import { fileupload } from "../../utils/multer/fileuploads.js";
import * as bannerController from "./banner.controller.js";


const bannerRouter = Router()

//all routes were authenticated
bannerRouter.use(isAuthenticate())

//create banner
bannerRouter.post('/',
    fileupload({ mainFolder: 'image',partFolder: 'banner' }).single('banner'),
    asyncHandler(bannerController.createBanner)
)

//get all banner
bannerRouter.get('/',
    asyncHandler(bannerController.allBanner)
)

//get specific banner 
bannerRouter.get('/:id',
    asyncHandler(bannerController.specificBanner)
)

//update banner 
bannerRouter.put('/:id',
    fileupload({ mainFolder: 'image',partFolder: 'banner' }).single('banner'),
    asyncHandler(bannerController.updateBanner)
)

//delete banner 
bannerRouter.delete('/:id',
    asyncHandler(bannerController.deleteBanner)
)

export default bannerRouter