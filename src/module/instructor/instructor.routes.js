import { Router } from "express";
import { asyncHandler, isAuthenticate } from "../../middleware/index.js";
import * as instructorController from "./instructor.controller.js";



const instructorRoutour = Router()

//all routes are protect 
instructorRoutour.use(isAuthenticate())

instructorRoutour.get('/',
    asyncHandler(instructorController.AllCourseOFInstructor)
)

export default instructorRoutour

