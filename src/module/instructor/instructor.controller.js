import path from "path";
import { messages } from "../../common/messages/message.js";
import { Certificate } from "../../db/model/certificate.js";
import { Course } from "../../db/model/course.js";
import { errorResponse } from "../../utils/res/res.error.js";
import { successResponse } from "../../utils/res/res.success.js";
import { instructorSalary } from "../../db/model/instructor.salary.js";

//get all courses of instructor
export const AllCourseOFInstructor = async (req, res, next) => {
    const { user } = req;
    console.log(user);

    //get all courses of instructor
    const courses = await Course.find(
        { instructor: user._id }
    ).populate('students', 'username code').populate('sections.students', 'username code');

    if (courses.length == 0) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })

    //response
    successResponse({
        res,
        message: messages.course.getAll,
        statusCode: 200,
        data: courses
    })
}

//get all certificates of logged in instructor
export const AllCertificatesOfInstructor = async (req, res, next) => {
    const { user } = req;

    //get all certificates of instructor
    const certificates = await Certificate.find({ instructorId: user._id });
    if (certificates.length === 0) errorResponse({ res, message: messages.course.certificate.notFound, statusCode: 404 });

    //response
    return successResponse({
        res,
        message: messages.course.certificate.getAll,
        statusCode: 200,
        data: certificates
    });
}

//get specific certificate of logged in instructor
export const SpecificCertificateOfInstructor = async (req, res, next) => {
    const { certificateId } = req.params;
    const instructorId = req.user._id;

    //get specific certificate of instructor
    const certificate = await Certificate.findOne({ _id: certificateId, instructorId });
    if (!certificate) errorResponse({ res, message: messages.course.certificate.notFound, statusCode: 404 });

    const filePath = path.resolve(certificate.certificate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.sendFile(filePath)
}

//get salary of logged in instructor
export const InstructorSalary = async (req, res, next) => {
    const instructorId = req.user._id;

    //check existence 
    const salaryExist = await instructorSalary.findOne({ instructorId });
    if (!salaryExist) errorResponse({ res, message: messages.instructor.haveNotSalaryAccount, statusCode: 404 });

    //response
    return successResponse({
        res,
        message: messages.instructor.getSalary,
        statusCode: 200,
        data: salaryExist
    });
}