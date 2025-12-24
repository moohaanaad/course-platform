import { Router } from "express";
import { idVal } from "../../common/common.validation.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { parseJsonFields } from "../../middleware/parseJsonFields.js";
import { isValid } from "../../middleware/validation.js";
import { fileuploadPrivate, fileValidationTypes } from "../../utils/multer/fileuploadCloud.js";
import certificateRouter from "./certificate/certificate.routes.js";
import * as courseConttroller from "./course.controller.js";
import * as val from "./course.validation.js";
import sectionRouter from "./section/section.routes.js";
import { isAuthorized } from "../../middleware/authorization.js";
import { roleTypes } from "../../common/constant/user.js";


const courseRouter = Router()

courseRouter.use('/section', sectionRouter)
courseRouter.use('/certificate', certificateRouter)

//all routes are protect 
courseRouter.use(isAuthenticate())

//create course
courseRouter.post('/',
    isAuthorized([roleTypes.ADMIN]),
    fileuploadPrivate(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationTypes.course }
    ).any(),
    parseJsonFields,
    isValid(val.createCourseVal),
    asyncHandler(courseConttroller.createCourse)
)

//get all course 
courseRouter.get('/',
    asyncHandler(courseConttroller.allCourses)
)

//get specific course 
courseRouter.get('/:id',
    isValid(idVal('id')),
    asyncHandler(courseConttroller.specificCourse)
)

//update course 
courseRouter.put('/:id',
    isAuthorized([roleTypes.ADMIN]),
    fileuploadPrivate(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationTypes.course }
    ).any(),
    parseJsonFields,
    isValid(val.updatedCourseVal),
    asyncHandler(courseConttroller.updateCourse)
)

//get all payed courses or sections 
courseRouter.get('/payed/all',
    asyncHandler(courseConttroller.allPayedCourses)
)

//get specific payed course or sections  
courseRouter.get('/:id/payed',
        isValid(idVal('id')),
    asyncHandler(courseConttroller.payedCourse)
)

//join course 
courseRouter.put('/:id/join',
        isValid(idVal('id')),
    asyncHandler(courseConttroller.joinCourse)
)

//get video materials 
courseRouter.get('/:id/video/:sectionId/:videoId/material',
    isValid(val.streamVideoVal),
    asyncHandler(courseConttroller.getMaterials)
)

//stream video
courseRouter.get('/:id/video/:sectionId/:videoId',
    isValid(val.streamVideoVal),
  asyncHandler(courseConttroller.streamVideo)
);

//stream free video
courseRouter.get('/:id/free-video', 
    asyncHandler(courseConttroller.streamFreeVideo)
);

//delete course
courseRouter.delete('/:id',
    isAuthorized([roleTypes.ADMIN]),
    asyncHandler(courseConttroller.deleteCourse)
)

export default courseRouter