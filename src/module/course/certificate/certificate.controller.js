import { messages } from "../../../common/messages/message.js";
import { Certificate } from "../../../db/model/certificate.js";
import { Course } from "../../../db/model/course.js";
import { errorResponse, successResponse } from "../../../utils/res/index.js";


//create certificate
export const createcertificate = async (req, res, next) => {
    const { file } = req;
    const { courseId } = req.params;

    //check eixstence 
    const courseExist = await Course.findById(courseId);
    if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 });
    if (!file.path) errorResponse({ res, message: messages.course.certificate.fileRequired, statusCode: 400 });

    //prepare data
    const certificateData = {
        courseId: courseExist._id,
        instructorId: courseExist.instructor,
        courseName: courseExist.name,
        courseDescription: courseExist.description,
        certificate: file.path
    };
    //create certificate
    const createdcertificate = await Certificate.create(certificateData);

    return successResponse({
        res,
        message: messages.course.certificate.createdSuccessfully,
        statusCode: 201,
        data: createdcertificate
    });
}

//get all certificates
export const getAllcertificates = async (req, res, next) => {
    const certificates = await Certificate.find().populate("instructorId", "firstName lastName email code");
    return successResponse({
        res,
        message: messages.course.certificate.getAll,
        statusCode: 200,
        data: certificates
    });
}

//get specific certificate
export const getSpecificcertificate = async (req, res, next) => {
    const { id } = req.params;
    const certificate = await Certificate.findById(id).populate("instructorId", "firstName lastName email code");
    if (!certificate) errorResponse({ res, message: messages.course.certificate.notFound, statusCode: 404 });
    return successResponse({
        res,
        message: messages.course.certificate.getSpecific,
        statusCode: 200,
        data: certificate
    })
}

//get certificate of specific course 
export const getcertificateOfCourse = async (req, res, next) => {
    const { courseId } = req.params;

    //check eixstence 
    const courseExist = await Course.findById(courseId);
    if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 });

    const certificate = await Certificate.findOne({ courseId: courseExist._id });
    if (!certificate) errorResponse({ res, message: messages.course.certificate.notFound, statusCode: 404 });

    return successResponse({
        res,
        message: messages.course.certificate.getSpecific,
        statusCode: 200,
        data: certificate
    });
}

//take certificate
export const takecertificate = async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.user._id;

    //check eixstence
    console.log(userId);
    const courseExist = await Course.findOne({ _id: courseId, students: userId })
    console.log(courseExist);

    if (!courseExist) errorResponse({ res, message: messages.course.notPaied, statusCode: 403 });

    const certificate = await Certificate.findOne({ courseId: courseExist._id });
    if (!certificate) errorResponse({ res, message: messages.course.certificate.notFound, statusCode: 404 });

    //check if user watched all videos
    courseExist.sections.forEach(section => {
        section.videos.forEach(video => {
            if (video.isWatched !== true) errorResponse({ res, message: messages.course.notWatchedAllVideos, statusCode: 403 });
        })
    })
    certificate.students.push(userId);
    await certificate.save()

    return successResponse({
        res,
        message: messages.course.certificate.getSpecific,
        statusCode: 200,
        data: certificate
    });


}

//update certificate
export const updatecertificate = async (req, res, next) => {
    const { file } = req;
    const { id } = req.params;

    //check existence
    if(!file.path) errorResponse({ res, message: messages.course.certificate.fileRequired, statusCode: 400 });
    const certificateExist = await Certificate.findById(id);
    if (!certificateExist) errorResponse({ res, message: messages.course.certificate.notFound, statusCode: 404 });
    if(certificateExist.students.length > 0) errorResponse({ res, message: messages.course.certificate.cannotUpdateAfterStudentsJoined, statusCode: 403 });
    
    //prepare data and save
    certificateExist.certificate = file.path;
    await certificateExist.save();

    //response 
    return successResponse({ 
        res,
        message: messages.course.certificate.updatedSuccessfully,
        statusCode: 200,
        data: certificateExist
    })
}