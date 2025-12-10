import { Router } from "express";
import { asyncHandler, isValid } from "../../../middleware/index.js";
import { fileupload, fileValidationType } from "../../../utils/multer/fileuploads.js";
import * as sertificateController from "./sertificate.controller.js";
import { createSertificateVal } from "./sertificate.validation.js";



const sertificateRouter = Router()

//create sertificate
sertificateRouter.post('/:courseId',
    fileupload(
        { mainFolder: 'course', partFolder: 'sertificate', allowTypes: fileValidationType.file }
    ).single('sertificate'),
    isValid(createSertificateVal),
    asyncHandler(sertificateController.createSertificate)
)

export default sertificateRouter;