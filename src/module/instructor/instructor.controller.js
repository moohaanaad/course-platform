import { messages } from "../../common/messages/message.js";
import { Course } from "../../db/model/course.js";
import { errorResponse } from "../../utils/res/res.error.js";
import { successResponse } from "../../utils/res/res.success.js";

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