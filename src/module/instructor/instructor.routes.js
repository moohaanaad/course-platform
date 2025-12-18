import { Router } from "express";
import { asyncHandler, isAuthenticate, isValid } from "../../middleware/index.js";
import * as instructorController from "./instructor.controller.js";
import { idVal } from "../../common/common.validation.js";



const instructorRoutour = Router()

//all routes are protect 
instructorRoutour.use(isAuthenticate())

//get all courses of logged in instructor
instructorRoutour.get('/',
    asyncHandler(instructorController.AllCourseOFInstructor)
)

//get all certificates of logged in instructor
instructorRoutour.get('/certificates',
    asyncHandler(instructorController.AllCertificatesOfInstructor)
)

//get specific certificate of logged in instructor
instructorRoutour.get('/certificates/:certificateId',
    isValid(idVal('certificateId')),
    asyncHandler(instructorController.SpecificCertificateOfInstructor)
)

//get salary of logged in instructor
instructorRoutour.get('/salary',
    asyncHandler(instructorController.InstructorSalary)
)

export default instructorRoutour

