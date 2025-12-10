import { messages } from "../../../common/messages/message.js";
import { Course } from "../../../db/model/course.js";
import { Sertificate } from "../../../db/model/sertificate.js";
import { errorResponse, successResponse } from "../../../utils/res/index.js";



//create sertificate
export const createSertificate = async (req, res) => {
    const { file } = req;
    const { courseId } = req.params;

    //check eixstence 
    const courseExist = await Course.findById(courseId);
    if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 });
    if(!file.path) errorResponse({ res, message: messages.course.sertificate.fileRequired, statusCode: 400 });

    //prepare data
    const sertificateData = {
        courseId: courseExist._id,
        instractorId: courseExist.instracter,
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