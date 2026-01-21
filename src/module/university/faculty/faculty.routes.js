import { Router } from "express";
import { asyncHandler, isAuthenticate, isAuthorized, isValid } from "../../../middleware/index.js";
import * as facultyController from "./faculty.controller.js";
import * as Val from "./faculty.validation.js";
import specializationRouter from "./specialization/specialization.routes.js";
import { roleTypes } from "../../../common/constant/user.js";


const facultyRouter = Router({ mergeParams: true })
facultyRouter.use('/:facultyId/specialization', specializationRouter)
facultyRouter.use(isAuthenticate())

//get all faculty 
facultyRouter.get('/',
    asyncHandler(facultyController.getAllFaculties)
)

//get specific faculty 
facultyRouter.get('/:facultyId',
    asyncHandler(facultyController.getSpecificFaculty)
)

facultyRouter.use(isAuthorized([roleTypes.ADMIN]))

//create faculty 
facultyRouter.post('/',
    isValid(Val.createFacultyVal),
    asyncHandler(facultyController.createFaculty)
)

//update faculty 
facultyRouter.put('/:facultyId',
    isValid(Val.updateFacultyVal),
    asyncHandler(facultyController.updateFaculty)
)

//delete faculty 
facultyRouter.delete('/:facultyId',
    asyncHandler(facultyController.deleteFaculty)
)

export default facultyRouter