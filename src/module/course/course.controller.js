import { roleTypes } from "../../common/constant/user.js";
import { messages } from "../../common/messages/message.js";
import { Course } from "../../db/model/course.js"
import { User } from "../../db/model/user.js";
import { attachFiles } from "../../utils/multer/attachFiles.js";
import { errorResponse, successResponse } from "../../utils/res/index.js"

//create course
export const createCourse = async (req, res, next) => {
  const { user, files } = req

  //cehck existence 
  const instracterExist = await User.findById(req.body.instracter)
  if (!instracterExist) errorResponse({ res, message: messages.user.notFound, statusCode: 404 })
  if (instracterExist.role !== roleTypes.INSTRACTER) errorResponse({ res, message: messages.course.shouldBeInstructor, statusCode: 401 })
  //prepare data
  attachFiles(req)
  for (let section of req.body.sections) {
    if (section.videos.length == 0) errorResponse(
      { res, message: messages.course.section.videoRequired, statusCode: 400 }
    )
    for (let video of section.videos) {
      if (video.name && !video.video) {
        if (req.header['accept-language'] == "en") errorResponse(
          { res, message: `Video "${video.name.en}" has name but no file uploaded`, statusCode: 422 }
        )
        errorResponse(
          { res, message: ` الفيديو  ${video.name.ar} يحتوي على اسم ولكن لم يتم رفع أي ملف له `, statusCode: 422 }
        )
      }
    }
  }
  const freeVideo = files.find(file => file.fieldname == "freeVideo")
  if (!freeVideo) errorResponse({ res, message: messages.course.freeVideoRequired, statusCode: 422 })
  req.body.createdBy = user._id
  req.body.freeVideo = freeVideo.path
  if (req.body.startAt == Date.now() || req.body.startAt <= Date.now()) req.body.isActive = true


  const createdCourse = await Course.create(req.body)

  return successResponse({
    res,
    statusCode: 201,
    message: messages.course.createdSuccessfully,
    data: createdCourse
  })
}

//get all courses 
export const allCourses = async (req, res, next) => {

  const courses = await Course.find({ isActive: true })
    .populate('instracter', 'firstname lastname code profilePic')
    .select('-sections.videos.video -sections.videos.materials')

  return successResponse({
    res,
    message: messages.course.getAll,
    statusCode: 200,
    data: courses
  })
}

//get specific course
export const specificCourse = async (req, res, nxt) => {
  const { id } = req.params

  //check existence 
  const courseExist = await Course.findOne({ _id: id, isActive: true })
    .populate('instracter', 'firstname lastname code profilePic')
    .select('-sections.videos.video -sections.videos.materials')

  if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })

  return successResponse({
    res,
    message: messages.course.getSpecific,
    statusCode: 200,
    data: courseExist
  })
}

//get all payed courses or sections 
export const allPayedCourses = async (req, res) => {
  const userId = req.user._id;

  //get all courses
  const courses = await Course.find({ isActive: true })
    .populate('instracter', 'firstname lastname code profilePic')

  const fullCourses = [];
  const sectionAccess = [];

  courses.forEach(course => {
    //check if user enrolled in full course
    const inCourse = course.students.some(studentId => studentId.toString() === userId.toString());
    if (inCourse) {
      fullCourses.push(course);
      return; //skip checking sections
    }

    //check if user enrolled in one or more sections
    const userSections = course.sections.filter(sec =>
      sec.students.some(studentId => studentId.toString() === userId.toString())
    );
    if (userSections.length > 0) {
      course.sections = userSections
      sectionAccess.push({ course });
    }
  });

  //if no access at all
  if (fullCourses.length === 0 && sectionAccess.length === 0) {
    return successResponse({
      res,
      success: false,
      message: messages.course.userNotEnrolled,
      statusCode:404
    });
  }

  return successResponse({
    res,
    fullCoursesCount: fullCourses.length,
    sectionAccessCount: sectionAccess.length,
    fullCourses,
    sectionAccess
  });
};

//get specific payed course or sections 
export const payedCourse = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id; // from auth middleware

  const course = await Course.findOne({ _id: id, isActive: true }).populate('instracter', 'username code profilePic');

  if (!course) return errorResponse({ res, message: messages.course.notFound, statusCode: 404 })

  //check if user enrolled in full course
  const inCourse = course.students.some(
    studentId => studentId.toString() === userId.toString()
  );
  if (inCourse) {
    return successResponse({
      res,
      message: messages.course.getSpecific,
      statusCode: 200,
      data: course
    })
  }

  //check if user enrolled in sections only
  const sections = course.sections.filter(sec =>
    sec.students.some(
      studentId => studentId.toString() === userId.toString()
    )
  );
  if (sections.length > 0) {
    course.sections = sections
    return successResponse({
      res,
      message: messages.course.section.getAll,
      statusCode: 200,
      data: course
    })
  }

  //not enrolled anywhere
  return successResponse({
    res,
    message: messages.course.userNotEnrolled,
    statusCode: 403,
    success: false
  })
}

//update course 
export const updateCourse = async (req, res, next) => {
  const { id } = req.params

  //check existence 
  const courseExist = await Course.findById(id)
  if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })

  //prepare data
  attachFiles(req)
  if (req.body.sections?.length) {
    for (let i = 0; i < req.body.sections.length; i++) {
      courseExist.sections.push(req.body.sections[i])
    }
  }
  if (req.body.name) courseExist.name = req.body.name
  if (req.body.price) courseExist.price = req.body.price
  if (req.body.description) courseExist.description = req.body.description
  if (req.body.startAt) courseExist.startAt = req.body.startAt
  if (req.body.endAt) courseExist.endAt = req.body.endAt

  //save data
  const updatedCourse = await courseExist.save()

  //response 
  return successResponse({
    res,
    message: messages.course.updatedSuccessfully,
    statusCode: 201,
    data: updatedCourse
  })
}

//join course
export const joinCourse = async (req, res, next) => {
  const { id } = req.params
  const { user } = req

  //cehck exitence 
  const courseExist = await Course.findOne({ _id: id, isActive: true })
  if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })
  const studentExist = courseExist.students.find(stu => stu.toString() == user._id.toString())
  if (studentExist) errorResponse({ res, message: messages.course.studentAlreadyJoined, statusCode: 401 })

  //prepare data
  courseExist.students.push(user._id)

  //save
  await courseExist.save()

  //response 
  return successResponse({
    res,
    message: messages.course.joinCourseSuccessfully,
    statusCode: 200,
    data: courseExist.students
  })
}
