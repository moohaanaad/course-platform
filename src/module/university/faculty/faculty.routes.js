import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../../middleware/index.js";
import * as facultyController from "./faculty.controller.js";
import * as Val from "./faculty.validation.js";
import specializationRouter from "./specialization/specialization.routes.js";


const facultyRouter = Router({ mergeParams: true })
facultyRouter.use('/:facultyId/specialization', specializationRouter)
facultyRouter.use(isAuthenticate())

//create faculty 
facultyRouter.post('/',
    isValid(Val.createFacultyVal),
    asyncHandler(facultyController.createFaculty)
)

//get all faculty 
facultyRouter.get('/',
    asyncHandler(facultyController.getAllFaculties)
)

//get specific faculty 
facultyRouter.get('/:facultyId',
    asyncHandler(facultyController.getSpecificFaculty)
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