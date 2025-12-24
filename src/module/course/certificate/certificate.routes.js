import { Router } from "express";
import { asyncHandler, isAuthenticate, isAuthorized, isValid } from "../../../middleware/index.js";
import * as certificateController from "./certificate.controller.js";
import { createCertificateVal } from "./certificate.validation.js";
import { idVal } from "../../../common/common.validation.js";
import { fileuploadPrivate, fileValidationTypes } from "../../../utils/multer/fileuploadCloud.js";
import { roleTypes } from "../../../common/constant/user.js";



const certificateRouter = Router()

//all routes are protect 
certificateRouter.use(isAuthenticate())

//create certificate
certificateRouter.post('/:courseId',
    isAuthorized([roleTypes.ADMIN]),
    fileuploadPrivate( 
        { mainFolder: 'course', partFolder: 'certificate', allowTypes: fileValidationTypes.file }
    ).single('certificate'),
    isValid(createCertificateVal),
    asyncHandler(certificateController.createcertificate)
)

//get all certificates 
certificateRouter.get('/',
    isAuthorized([roleTypes.ADMIN]),
    asyncHandler(certificateController.getAllcertificates)
)

//get certificate of specific course 
certificateRouter.get('/:courseId',
    isAuthorized([roleTypes.ADMIN]),
    isValid(idVal('courseId')),
    asyncHandler(certificateController.getcertificateOfCourse)
)

//get specific certificate 
certificateRouter.get('/specific/:id',
    isAuthorized([roleTypes.ADMIN]),
    isValid(idVal('id')),
    asyncHandler(certificateController.getSpecificCertificate)
)

//take certificate
certificateRouter.put('/:courseId',
    isValid(idVal('courseId')),
    asyncHandler(certificateController.takecertificate)
)

//update serificate 
certificateRouter.patch('/:id',
    isAuthorized([roleTypes.ADMIN]),
    fileuploadPrivate({ mainFolder: 'course', partFolder: 'certificate', allowTypes: fileValidationTypes.file }).single('certificate'),
    isValid(idVal('id')),
    asyncHandler(certificateController.updatecertificate)
)


export default certificateRouter;