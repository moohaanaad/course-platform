import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../../middleware/index.js";
import { fileupload, fileValidationType } from "../../../utils/multer/fileuploads.js";
import * as certificateController from "./certificate.controller.js";
import { createCertificateVal } from "./certificate.validation.js";



const certificateRouter = Router()

//all routes are protect 
certificateRouter.use(isAuthenticate())

//create certificate
certificateRouter.post('/:courseId',
    fileupload(
        { mainFolder: 'course', partFolder: 'certificate', allowTypes: fileValidationType.file }
    ).single('certificate'),
    isValid(createCertificateVal),
    asyncHandler(certificateController.createcertificate)
)

//get all certificates 
certificateRouter.get('/',
    asyncHandler(certificateController.getAllcertificates)
) 

//get certificate of specific course 
certificateRouter.get('/:courseId',
    asyncHandler(certificateController.getcertificateOfCourse)
) 

//get specific certificate 
certificateRouter.get('/specific/:id',
    asyncHandler(certificateController.getSpecificcertificate)
) 

//take certificate
certificateRouter.put('/:courseId',
    asyncHandler(certificateController.takecertificate)
)

//update serificate 
certificateRouter.patch('/:id',
    fileupload(
        { mainFolder: 'course', partFolder: 'certificate', allowTypes: fileValidationType.file }
    ).single('certificate'),
    asyncHandler(certificateController.updatecertificate)
)


export default certificateRouter;