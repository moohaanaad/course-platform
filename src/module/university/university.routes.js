import { Router } from "express";
import { asyncHandler, isAuthenticate, isAuthorized, isValid } from "../../middleware/index.js";
import * as universityController from "./university.controller.js";
import facultyRouter from "./faculty/faculty.routes.js";
import * as Val from "./university.validation.js";
import { idVal } from "../../common/common.validation.js";
import { roleTypes } from "../../common/constant/user.js";


const universityRouter = Router()
universityRouter.use('/:universityId/faculty', facultyRouter)

//get all university
universityRouter.get('/',
    asyncHandler(universityController.getAllUniversities)
)

//get specific university
universityRouter.get('/:universityId',
    isValid(idVal("universityId")),
    asyncHandler(universityController.getUniversityById)
)

universityRouter.use(isAuthenticate(), isAuthorized([roleTypes.ADMIN]))

//create university
universityRouter.post('/',
    isValid(Val.createUniversityVal),
    asyncHandler(universityController.createUniversity)
)

//update university
universityRouter.put('/:universityId',
    isValid(Val.updateUniversityVal),
    asyncHandler(universityController.updateUniversity)
)

//delete university
universityRouter.delete('/:universityId',
    isValid(idVal("universityId")),
    asyncHandler(universityController.deleteUniversity)
)

export default universityRouter