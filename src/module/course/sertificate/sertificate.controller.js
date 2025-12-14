import { messages } from "../../../common/messages/message.js";
import { Course } from "../../../db/model/course.js";
import { Sertificate } from "../../../db/model/sertificate.js";
import { errorResponse, successResponse } from "../../../utils/res/index.js";



//create sertificate
export const createSertificate = async (req, res, next) => {
    const { file } = req;
    const { courseId } = req.params;

    //check eixstence 
    const courseExist = await Course.findById(courseId);
    if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 });
    if (!file.path) errorResponse({ res, message: messages.course.sertificate.fileRequired, statusCode: 400 });

    //prepare data
    const sertificateData = {
        courseId: courseExist._id,
        instructorId: courseExist.instructor,
        courseName: courseExist.name,
        courseDescription: courseExist.description,
        sertificate: file.path
    };
    //create sertificate
    const createdSertificate = await Sertificate.create(sertificateData);

    return successResponse({
        res,
        message: messages.course.sertificate.createdSuccessfully,
        statusCode: 201,
        data: createdSertificate
    });
}

//get all sertificates
export const getAllSertificates = async (req, res, next) => {
    const sertificates = await Sertificate.find().populate("instructorId", "firstName lastName email code");
    return successResponse({
        res,
        message: messages.course.sertificate.getAll,
        statusCode: 200,
        data: sertificates
    });
}

//get specific sertificate
export const getSpecificSertificate = async (req, res, next) => {
    const { id } = req.params;
    const sertificate = await Sertificate.findById(id).populate("instructorId", "firstName lastName email code");
    if (!sertificate) errorResponse({ res, message: messages.course.sertificate.notFound, statusCode: 404 });
    return successResponse({
        res,
        message: messages.course.sertificate.getSpecific,
        statusCode: 200,
        data: sertificate
    })
}

//get sertificate of specific course 
export const getSertificateOfCourse = async (req, res, next) => {
    const { courseId } = req.params;

    //check eixstence 
    const courseExist = await Course.findById(courseId);
    if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 });

    const sertificate = await Sertificate.findOne({ courseId: courseExist._id });
    if (!sertificate) errorResponse({ res, message: messages.course.sertificate.notFound, statusCode: 404 });

    return successResponse({
        res,
        message: messages.course.sertificate.getSpecific,
        statusCode: 200,
        data: sertificate
    });
}

//take sertificate
export const takeSertificate = async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    //check eixstence
    console.log(userId);
    const courseExist = await Course.findOne({ _id: courseId, students: userId })
    console.log(courseExist);

    if (!courseExist) errorResponse({ res, message: messages.course.notPaied, statusCode: 403 });

    const sertificate = await Sertificate.findOne({ courseId: courseExist._id });
    if (!sertificate) errorResponse({ res, message: messages.course.sertificate.notFound, statusCode: 404 });

    //check if user watched all videos
    courseExist.sections.forEach(section => {
        section.videos.forEach(video => {
            if (video.isWatched !== true) errorResponse({ res, message: messages.course.notWatchedAllVideos, statusCode: 403 });
        })
    })
    sertificate.students.push(userId);
    await sertificate.save()

    return successResponse({
        res,
        message: messages.course.sertificate.getSpecific,
        statusCode: 200,
        data: sertificate
    });


}