import { Router } from "express";
import { asyncHandler } from "../../middleware/index.js";
import { createUser } from "./admin.controller.js";



const adminRouter = Router()

adminRouter.post('/',
    asyncHandler(createUser)
)

export default adminRouter