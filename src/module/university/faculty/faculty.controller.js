import { messages } from "../../../common/messages/message.js"
import { Faculty } from "../../../db/model/faculty.js"
import { Specialization } from "../../../db/model/specialization.js"
import { University } from "../../../db/model/university.js"
import { errorResponse, successResponse } from "../../../utils/res/index.js"

//create faculty
export const createFaculty = async (req, res, next) => {
    const { user } = req
    const { universityId } = req.params
    const { name } = req.body

    const universityExist = await University.findById(universityId)
    if (!universityExist) errorResponse({ res, message: messages.university.notFound, statusCode: 404 })
    const facultyExist = await Faculty.findOne({ "name.ar": name.ar, "name.en": name.en, universityId })
    if (facultyExist) return errorResponse({ res, message: messages.university.faculty.alreadyExist, statusCode: 400 })

    const faculty = await Faculty.create({
        name,
        universityId,
        createdBy: user._id
    })

    return successResponse({
        res,
        message: messages.university.faculty.createdSuccessfully,
        data: faculty,
        statusCode: 201,
        success: true
    })
}

//get all faculties 
export const getAllFaculties = async (req, res, next) => {
    const { universityId } = req.params

    const facultiesExist = await Faculty.find({ universityId })

    return successResponse({
        res,
        message: messages.university.faculty.getAll,
        data: facultiesExist,
        statusCode: 200,
        success: true
    })
}

//get specific faculty 
export const getSpecificFaculty = async (req, res, next) => {
    const { facultyId } = req.params

    const facultyExist = await Faculty.findById(facultyId).populate("universityId")
    if (!facultyExist) errorResponse({ res, message: messages.university.faculty.notFound, statusCode: 404 })

    return successResponse({
        res,
        message: messages.university.faculty.getSpecific,
        data: facultyExist,
        statusCode: 200,
        success: true
    })
}

//update faculty 
export const updateFaculty = async (req, res, next) => {
    const { facultyId } = req.params
    const { name } = req.body

    const facultyExist = await Faculty.findById(facultyId)
    if (!facultyExist) errorResponse({ res, message: messages.university.faculty.notFound, statusCode: 404 })

    facultyExist.name = name
    await facultyExist.save()

    return successResponse({
        res,
        message: messages.university.faculty.updatedSuccessfully,
        data: facultyExist,
        statusCode: 200,
        success: true
    })
}

//delete faculty 
export const deleteFaculty = async (req, res, next) => {
    const { facultyId } = req.params

    const facultyExist = await Faculty.findByIdAndDelete(facultyId)
    if (!facultyExist) errorResponse({ res, message: messages.university.faculty.notFound, statusCode: 404 })

    await Specialization.deleteMany({ facultyId })
    return successResponse({
        res,
        message: messages.university.faculty.deletedSuccessfully,
        statusCode: 200,
        success: true
    })
}