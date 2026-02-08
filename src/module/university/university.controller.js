import { messages } from "../../common/messages/message.js";
import { Faculty } from "../../db/model/faculty.js";
import { Specialization } from "../../db/model/specialization.js"; 
import { University } from "../../db/model/university.js";
import { errorResponse, successResponse } from "../../utils/res/index.js";

//create university
export const createUniversity = async (req, res, next) => {
    const { user } = req
    const { name } = req.body

    const universityExist = await University.findOne({ "name.ar": name.ar }, { "name.en": name.en })
    if (universityExist) errorResponse({ res, message: messages.university.alreadyExist, statusCode: 404 })

    const university = await University.create({
        name,
        createdBy: user._id
    })

    return successResponse({
        res,
        message: messages.university.createdSuccessfully,
        data: university,
        statusCode: 201,
        success: true
    })
}

//get all universities
export const getAllUniversities = async (req, res, next) => {

    const universities = await University.find()

    return successResponse({
        res,
        message: messages.university.getAll,
        data: universities,
        statusCode: 200,
        success: true
    })
}

//get specific university
export const getUniversityById = async (req, res, next) => {
    const { universityId } = req.params
    const university = await University.findById(universityId)
    if (!university) errorResponse({ res, message: messages.university.notFound, statusCode: 404 })

    return successResponse({
        res,
        message: messages.university.getSpecific,
        data: university,
        statusCode: 200,
        success: true
    })
}

//update university
export const updateUniversity = async (req, res, next) => {
    const { universityId } = req.params
    const { name } = req.body

    const university = await University.findById(universityId)
    if (!university) errorResponse({ res, message: messages.university.notFound, statusCode: 404 })

    university.name = name || university.name
    await university.save()

    return successResponse({
        res,
        message: messages.university.updatedSuccessfully,
        data: university,
        statusCode: 200,
        success: true
    })
}

//delete university 
export const deleteUniversity = async (req, res, next) => {
    const { universityId } = req.params

    const universityExist = await University.findByIdAndDelete(universityId)
    if (!universityExist) errorResponse({ res, message: messages.university.notFound, statusCode: 404 })

    await Faculty.deleteMany({ universityId })
    await Specialization.deleteMany({ universityId })
    return successResponse({
        res,
        message: messages.university.deletedSuccessfully,
        statusCode: 200,
        success: true
    })
}