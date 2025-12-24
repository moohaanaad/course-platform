import { Router } from "express";
import { idVal } from "../../common/common.validation.js";
import { asyncHandler, isAuthenticate, isAuthorized, isValid } from "../../middleware/index.js";
import * as adminController from "./admin.controller.js";
import { createUserVal, updateInstructorSalaryVal } from "./admin.validation.js";
import { roleTypes } from "../../common/constant/user.js";



const adminRouter = Router()

adminRouter.use(isAuthenticate(), isAuthorized([roleTypes.ADMIN]))

adminRouter.post('/',
    isValid(createUserVal),
    asyncHandler(adminController.createUser)
)

adminRouter.put('/:userId',
    isValid(idVal('userId')),
    asyncHandler(adminController.DeleteDeviceId)
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