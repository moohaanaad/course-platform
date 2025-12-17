import { Router } from "express";
import { asyncHandler, isAuthenticate } from "../../middleware/index.js";
import * as instructorController from "./instructor.controller.js";



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

export default instructorRoutour

