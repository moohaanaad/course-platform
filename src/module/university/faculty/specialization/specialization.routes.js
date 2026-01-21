import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../../../middleware/index.js";
import * as Val from "./specialization.validation.js";
import * as specializationController from "./specialization.controller.js";


const specializationRouter = Router({ mergeParams: true })
specializationRouter.use(isAuthenticate())
//create specialization 
specializationRouter.post('/',
    isValid(Val.createSpecializationVal),
    asyncHandler(specializationController.createSpecialization)
)

//get all specialization 
specializationRouter.get('/',
    asyncHandler(specializationController.getAllSpecializations)
)

//get specific specialization 
specializationRouter.get('/:specializationId',
    asyncHandler(specializationController.getSpecificSpecialization)
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