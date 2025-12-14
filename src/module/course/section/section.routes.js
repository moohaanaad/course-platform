import { Router } from "express"
import { fileupload, fileValidationType } from "../../../utils/multer/fileuploads.js"
import { parseJsonFields } from "../../../middleware/parseJsonFields.js"
import { asyncHandler, isAuthenticate, isValid } from "../../../middleware/index.js"
import * as sectionController from "./section.controller.js"
import * as val from "./section.validation.js"



const sectionRouter = Router()

sectionRouter.use(isAuthenticate())

//add videos in section and update section 
sectionRouter.put('/:id',
    fileupload(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationType.course }
    ).any(),
    parseJsonFields,
    isValid(val.updateSectionVal),
    asyncHandler(sectionController.updateSection)
)

//get specific section
sectionRouter.get('/:id',
    asyncHandler(sectionController.specifiSection)
)

//join section 
sectionRouter.put('/:id/join',
    asyncHandler(sectionController.joinSection)
)

//add question to section
sectionRouter.put('/:id/question',
    isValid(val.addQuestionVal),
    asyncHandler(sectionController.addQuestion)
)

export default sectionRouter