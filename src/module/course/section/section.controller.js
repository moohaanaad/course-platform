import { messages } from "../../../common/messages/message.js"
import { Course } from "../../../db/model/course.js"
import { instructorSalary } from "../../../db/model/instructor.salary.js"
import { attachFiles } from "../../../utils/multer/attachFiles.js"
import { errorResponse, successResponse } from "../../../utils/res/index.js"



//update section & add videos 
export const updateSection = async (req, res, next) => {
    const { id } = req.params

    //check existence
    const sectionExist = await Course.findOne({ "sections._id": id })
    if (!sectionExist) errorResponse({ res, message: 'section notfound', statusCode: 404 })

    //prepare data
    attachFiles(req)
    if (req.body.sections[0]?.videos?.length) {
        for (let i = 0; i < req.body.sections[0].videos.length; i++) {
            console.log(sectionExist.sections[0].videos);

            sectionExist.sections[0].videos.push(req.body.sections[0].videos[i])
        }
    }
    if (req.body.sections[0]?.name) sectionExist.sections[0].name = req.body.sections[0]?.name
    if (req.body.sections[0]?.price) sectionExist.sections[0].price = req.body.sections[0]?.price

    //save data
    const updatedCourse = await sectionExist.save()

    //response
    return successResponse({
        res,
        message: 'updated',
        statusCode: 200,
        data: updatedCourse
    })
}

//get specific section
export const specifiSection = async (req, res, nxt) => {
    const { id } = req.params

    //check existence 
    const courseExist = await Course.findOne(
        { "sections._id": id, isActive: true },
        { "sections.$": 1, name: 1, students: 1, instructor: 1 }
    ).populate('instructor', 'firstname lastname code profilePic')
    if (!courseExist) errorResponse({ res, message: messages.course.section.notFound, statusCode: 404 })

    if (courseExist) {
        courseExist.sections[0].videos.map(v => {
            v.video = undefined
            v.materials = undefined
        });
    }
    return successResponse({
        res,
        message: messages.course.section.getSpecific,
        statusCode: 200,
        data: courseExist
    })
}

//join section 
export const joinSection = async (req, res, next) => {
    const { id } = req.params
    const { user } = req

    //check existence 
    const courseExist = await Course.findOne(
        { "sections._id": id, isActive: true },
        { "sections.$": 1, name: 1, students: 1, instructorRatio: 1, instructor: 1 }
    )
    if (!courseExist) errorResponse({ res, message: messages.course.section.notFound, statusCode: 404 })

    let studentExist = courseExist.students.find(stu => stu.toString() == user._id.toString())
    if (studentExist) errorResponse({ res, message: messages.course.studentAlreadyJoined, statusCode: 401 })
    studentExist = courseExist.sections[0].students.find(stu => stu.toString() == user._id.toString())
    if (studentExist) errorResponse({ res, message: messages.course.section.studentAlreadyJoined, statusCode: 401 })

    //instructor salary update
    if (courseExist.instructorRatio) {
        const instructorSalaryAmount = (courseExist.sections[0].price * courseExist.instructorRatio) / 100;
        const instructorSalaryExist = await instructorSalary.findOne({ instructor: courseExist.instructor });

        //update if exists else create
        if (instructorSalaryExist) {
            instructorSalaryExist.amount += instructorSalaryAmount;
            await instructorSalaryExist.save();
        } else {
            await instructorSalary.create({
                instructor: courseExist.instructor,
                amount: instructorSalaryAmount
            })
        }
    }

    //save
    const joinedStudent = await Course.findOneAndUpdate(
        { "sections._id": id },
        { $push: { "sections.$.students": user._id } },
        { new: true }
    ).select('sections')
    const section = joinedStudent.sections.find(
        (sec) => sec._id.toString() === id
    );
    //responase
    return successResponse({
        res,
        message: messages.course.section.joinSectionSuccessfully,
        statusCode: 200,
        data: section
    })
}

//add question to section 
export const addQuestion = async (req, res, next) => {
    const { id } = req.params
    const { user } = req
    const { question } = req.body

    //check existence
    const courseExist = await Course.findOne(
        { "sections._id": id, isActive: true },
        { "sections.$": 1, name: 1, students: 1 }
    )
    if (!courseExist) errorResponse({ res, message: messages.course.section.notFound, statusCode: 404 })

    //check if user enrolled in sections only
    const sections = courseExist.sections.filter(sec => sec.students.some(
        studentId => studentId.toString() === user._id.toString()
    ));
    if (sections.length == 0) {
        errorResponse({ res, message: messages.course.section.notPaied, statusCode: 401, })
    }

    //save
    const updatedSection = await Course.findOneAndUpdate(
        { "sections._id": id },
        { $push: { "sections.$.questions": { userId: user._id, userEmail: user.email, question } } },
        { new: true }
    ).select('sections')
    const section = updatedSection.sections.find((sec) => sec._id.toString() === id);

    //response
    return successResponse({
        res,
        message: messages.course.section.questionAddedSuccessfully,
        statusCode: 200,
        data: section
    })
}
