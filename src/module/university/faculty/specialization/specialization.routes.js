import { Router } from "express";
import { asyncHandler, isAuthenticate, isAuthorized, isValid } from "../../../../middleware/index.js";
import * as Val from "./specialization.validation.js";
import * as specializationController from "./specialization.controller.js";
import { roleTypes } from "../../../../common/constant/user.js";


const specializationRouter = Router({ mergeParams: true })
specializationRouter.use(isAuthenticate())

//get all specialization 
specializationRouter.get('/',
    asyncHandler(specializationController.getAllSpecializations)
)

//get specific specialization 
specializationRouter.get('/:specializationId',
    asyncHandler(specializationController.getSpecificSpecialization)
)

specializationRouter.use(isAuthorized([roleTypes.ADMIN]))


//create specialization 
specializationRouter.post('/',
    isValid(Val.createSpecializationVal),
    asyncHandler(specializationController.createSpecialization)
)

//update specialization 
specializationRouter.put('/:specializationId',
    isValid(Val.updateSpecializationVal),
    asyncHandler(specializationController.updateSpecialization)
)

//delete specialization 
specializationRouter.delete('/:specializationId',
    asyncHandler(specializationController.deleteSpecialization)
)


export default specializationRouter