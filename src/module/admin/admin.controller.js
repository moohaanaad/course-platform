import { roleTypes } from "../../common/constant/user.js"
import { messages } from "../../common/messages/message.js"
import { instructorSalary } from "../../db/model/instructor.salary.js"
import { User } from "../../db/model/user.js"
import { errorResponse, successResponse } from "../../utils/res/index.js"



export const createUser = async (req, res, next) => {
    const { email, phone } = req.body

    //check eixstence 
    const emailExsit = await User.findOne({ email })
    if (emailExsit) errorResponse({ res, message: messages.user.email, statusCode: 400 })

    const phoneExsit = await User.findOne({ phone })
    if (phoneExsit) errorResponse({ res, message: messages.user.phone, statusCode: 400 })
    const createdUser = await User.create(req.body)
    return successResponse({
        res,
        message: messages.user.createdSuccessfully,
        statusCode: 201,
        data: createdUser
    })
}

export const DeleteDeviceId = async (req, res, next) => {
    const { userId } = req.params

    const userExist = await User.findByIdAndUpdate(userId, { $unset: { deviceId: "" } }, { new: true })
    if (!userExist) errorResponse({ res, message: messages.user.notFound, statusCode: 404 })

    return successResponse({
        res,
        message: messages.user.updatedSuccessfully,
        data: userExist,
        statusCode: 200,
        success: true
    })
}

export const getInstructors = async (req, res, next) => {

    const instructors = await User.find({ role: roleTypes.INSTRUCTOR })

    return successResponse({
        res,
        message: messages.instructor.getAllInstructors,
        statusCode: 200,
        data: instructors
    })
}

export const getInstructorSalary = async (req, res, next) => {
    const { instructorId } = req.params

    const instructorSalaryExist = await instructorSalary.findOne({ instructor: instructorId })
    if (!instructorSalaryExist) errorResponse({ res, message: messages.instructor.haveNotSalaryAccount, statusCode: 404 })

    return successResponse({
        res,
        message: messages.instructor.getSalary,
        statusCode: 200,
        data: instructorSalaryExist
    })


}

export const updateInstructorSalary = async (req, res, next) => {
    const { instructorId } = req.params
    const { amount } = req.body

    //check existence
    const instructorSalaryExist = await instructorSalary.findOne({ instructor: instructorId })
    if (!instructorSalaryExist) errorResponse({ res, message: messages.instructor.haveNotSalaryAccount, statusCode: 404 })

    //prepare data
    instructorSalaryExist.amount -= amount
    if (instructorSalaryExist.amount < 0) errorResponse({ res, message: messages.instructor.salaryCannotBeNegative, statusCode: 400 })

    //save
    await instructorSalaryExist.save()

    //response
    return successResponse({
        res,
        message: messages.instructor.getSalary,
        statusCode: 200,
        data: instructorSalaryExist
    })


}