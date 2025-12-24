import { Router } from "express"
import { idVal } from "../../../common/common.validation.js"
import { asyncHandler, isAuthenticate, isValid } from "../../../middleware/index.js"
import { parseJsonFields } from "../../../middleware/parseJsonFields.js"
import { fileuploadPrivate, fileValidationTypes } from "../../../utils/multer/fileuploadCloud.js"
import * as sectionController from "./section.controller.js"
import * as val from "./section.validation.js"



const sectionRouter = Router()

sectionRouter.use(isAuthenticate())

//add videos in section and update section 
sectionRouter.put('/:id',
    fileuploadPrivate(
        { mainFolder: 'course', partFolder: 'video', allowTypes: fileValidationTypes.course }
    ).any(),
    parseJsonFields,
    isValid(val.updateSectionVal),
    asyncHandler(sectionController.updateSection)
)

//get specific section
sectionRouter.get('/:id',
    isValid(idVal('id')),
    asyncHandler(sectionController.specifiSection)
)

//join section 
sectionRouter.put('/:id/join',
    isValid(idVal('id')),
    asyncHandler(sectionController.joinSection)
)

//add question to section
sectionRouter.put('/:id/question',
    isValid(val.addQuestionVal),
    asyncHandler(sectionController.addQuestion)
)

export default sectionRouter