import { Router } from "express";
import { fileupload, fileValidationType } from "../../utils/multer/fileuploads.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as courseConttroller from "./course.controller.js";
import { parseJsonFields } from "../../middleware/parseJsonFields.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import * as val from "./course.validation.js";
import sectionRouter from "./section/section.routes.js";


const courseRouter = Router()

courseRouter.use('/section', sectionRouter)

//all routes are protect 
courseRouter.use(isAuthenticate())

//create course
courseRouter.post('/',
    fileupload(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationType.course }
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
    asyncHandler(courseConttroller.specificCourse)
)

//update course 
courseRouter.put('/:id',
    fileupload(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationType.course }
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
    asyncHandler(courseConttroller.payedCourse)
)

//join course 
courseRouter.put('/:id/join',
    asyncHandler(courseConttroller.joinCourse)
)

courseRouter.get('/:id/video/:sectionId/:videoId',
  asyncHandler(courseConttroller.streamVideo)
);

courseRouter.get('/:id/free-video', 
    asyncHandler(courseConttroller.streamFreeVideo));
export default courseRouter