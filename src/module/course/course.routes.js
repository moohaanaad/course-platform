import { Router } from "express";
import { fileupload, fileValidationType } from "../../utils/multer/fileuploads.js";
import { asyncHandler } from "../../middleware/async-handler.js";
import { createCourse } from "./course.controller.js";
import { parseJsonFields } from "../../middleware/parseJsonFields.js";
import { isAuthenticate } from "../../middleware/authentication.js";
import { isValid } from "../../middleware/validation.js";
import { createCourseVal } from "./course.validation.js";


const courseRouter = Router()
 courseRouter.use(isAuthenticate())
courseRouter.post('/',
    fileupload({mainFolder:'course', partFolder: 'video', allowTypes: fileValidationType.course}).any(),
    parseJsonFields,
    isValid(createCourseVal),
    asyncHandler(createCourse)
)

export default courseRouter