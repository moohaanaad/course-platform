import { messages } from "../../../../common/messages/message.js"
import { Faculty } from "../../../../db/model/faculty.js"
import { Specialization } from "../../../../db/model/Specialization.js"
import { University } from "../../../../db/model/university.js"
import { errorResponse, successResponse } from "../../../../utils/res/index.js"


//create specialization 
export const createSpecialization = async (req, res, next) =>{
    const { user } = req
    const { universityId, facultyId } = req.params
    const { name } = req.body

    //check existence
    const universityExist = await University.findById(universityId)
    if(!universityExist) errorResponse({res,message: messages.university.notFound, statusCode: 404})

    const facultyExist = await Faculty.findById(facultyId)
    if(!facultyExist) errorResponse({res,message: messages.university.faculty.notFound, statusCode: 404})

    const specializationExist = await Specialization.findOne({ "name.ar": name.ar, "name.en": name.en, universityId, facultyId })
    if(specializationExist) errorResponse({ res, message: messages.university.faculty.specialization.alreadyExist, statusCode: 400})

    //created specialization 
    const createdSpecialization = await Specialization.create({
        name,
        universityId,
        facultyId,
        createdBy: user._id
    })

    return successResponse({
        res, 
        message: messages.university.faculty.specialization.createdSuccessfully,
        data: createdSpecialization,
        statusCode: 201,
        success: true
    })
}

//get all specialization 
export const getAllSpecializations = async (req, res, next) =>{
    const { universityId, facultyId } = req.params

    const specializationExist = await Specialization.find({ universityId, facultyId })

    return successResponse({
        res, 
        message: messages.university.faculty.specialization.getAll,
        data: specializationExist,
        statusCode: 200,
        success: true
    })
}

//get specific specialization 
export const getSpecificSpecialization = async (req, res, next) =>{
    const { specializationId } = req.params

    const specializationExist = await Specialization.findById(specializationId).populate('universityId facultyId')
    if(!specializationExist) errorResponse({ res, message: messages.university.faculty.specialization.notFound, statusCode:404 })

    return successResponse({
        res, 
        message: messages.university.faculty.specialization.getSpecific,
        data: specializationExist,
        statusCode: 200,
        success: true
    })
}

//update specialization 
export const updateSpecialization = async (req, res, next) => {
    const { specializationId } = req.params
    const { name } = req.body

    const specializationExist = await Specialization.findById(specializationId)
    if (!specializationExist) errorResponse({ res, message: messages.university.faculty.specialization.notFound, statusCode: 404 })
    
    specializationExist.name = name
    await specializationExist.save()

    return successResponse({
        res, 
        message: messages.university.faculty.specialization.updatedSuccessfully,
        data:specializationExist,
        statusCode: 200,
        success: true
    })

}

//delete specialization 
export const deleteSpecialization = async (req, res, next) => {
    const { specializationId } = req.params

    const specializationExist = await Specialization.findByIdAndDelete(specializationId)
    if(!specializationExist) errorResponse({ res, message: messages.university.faculty.specialization.notFound, statusCode: 404 })
    
        return successResponse({
        res, 
        message: messages.university.faculty.specialization.deletedSuccessfully,
        statusCode: 200,
        success: true
    })
}