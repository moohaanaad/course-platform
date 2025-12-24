import { Router } from "express";
import { idVal } from "../../common/common.validation.js";
import { asyncHandler, isValid } from "../../middleware/index.js";
import * as adminController from "./admin.controller.js";
import { createUserVal, updateInstructorSalaryVal } from "./admin.validation.js";



const adminRouter = Router()

adminRouter.post('/',
    isValid(createUserVal),
    asyncHandler(adminController.createUser)
)

adminRouter.get('/instructors',
    asyncHandler(adminController.getInstructors)
)

adminRouter.get('/instructors/:instructorId/salary',
    isValid(idVal('instructorId')),
    asyncHandler(adminController.getInstructorSalary)
)

adminRouter.put('/instructors/:instructorId/salary',
    isValid(updateInstructorSalaryVal),
    asyncHandler(adminController.updateInstructorSalary)
)

export default adminRouter