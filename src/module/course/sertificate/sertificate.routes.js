import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../../middleware/index.js";
import { fileupload, fileValidationType } from "../../../utils/multer/fileuploads.js";
import * as sertificateController from "./sertificate.controller.js";
import { createSertificateVal } from "./sertificate.validation.js";



const sertificateRouter = Router()

//all routes are protect 
sertificateRouter.use(isAuthenticate())

//create sertificate
sertificateRouter.post('/:courseId',
    fileupload(
        { mainFolder: 'course', partFolder: 'sertificate', allowTypes: fileValidationType.file }
    ).single('sertificate'),
    isValid(createSertificateVal),
    asyncHandler(sertificateController.createSertificate)
)

//get all sertificates 
sertificateRouter.get('/',
    asyncHandler(sertificateController.getAllSertificates)
) 

//get sertificate of specific course 
sertificateRouter.get('/:courseId',
    asyncHandler(sertificateController.getSertificateOfCourse)
) 

//get specific sertificate 
sertificateRouter.get('/specific/:id',
    asyncHandler(sertificateController.getSpecificSertificate)
) 

//take sertificate
sertificateRouter.put('/:courseId',
    asyncHandler(sertificateController.takeSertificate)
)

//update serificate 

//delete sertificate

export default sertificateRouter;