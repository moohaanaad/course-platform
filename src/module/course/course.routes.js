import { Router } from "express";
import { fileupload, fileValidationType } from "../../utils/multer/fileuploads.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import * as courseConttroller from "./course.controller.js";
import { parseJsonFields } from "../../middleware/parseJsonFields.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { createCourseVal } from "./course.validation.js";


const courseRouter = Router()

//all routes are protect 
courseRouter.use(isAuthenticate())

//create course
courseRouter.post('/',
    fileupload(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationType.course }
    ).any(),
    parseJsonFields,
    isValid(createCourseVal),
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

//get all payed courses or sections 
courseRouter.get('/payed/all',
    asyncHandler(courseConttroller.allPayedCourses)
)

//get specific payed course or sections  
courseRouter.get('/payed/:id',
    asyncHandler(courseConttroller.payedCourse)
)

export default courseRouter