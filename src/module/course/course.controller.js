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
  if (instracterExist.role !== roleTypes.INSTRACTER) errorResponse({ res, message: "user should be an instracter", statusCode: 401 })
  //prepare data
  attachFiles(req)
  for (let section of req.body.sections) {
    if (section.videos.length == 0) return errorResponse(
      { res, message: "every section must have video", statusCode: 400 }
    )
    for (let video of section.videos) {
      if (video.name && !video.video) return errorResponse(
        { res, message: `Video "${video.name}" has name but no file uploaded`, statusCode: 400 }
      )
    }
  }
  const freeVideo = files.find(file => file.fieldname == "freeVideo")
  if (!freeVideo) return errorResponse({ res, message: 'free video is required', statusCode: 400 })
  req.body.createdBy = user._id
  req.body.freeVideo = freeVideo.path
  if (req.body.startAt == Date.now() || req.body.startAt <= Date.now()) req.body.isActive = true


  const createdCourse = await Course.create(req.body)

  return successResponse({
    res,
    statusCode: 201,
    message: "course created successfully",
    data: createdCourse
  })
}

//                                  -------get-------
//get all courses 
export const allCourses = async (req, res, next) => {

  const courses = await Course.find({ isActive: true })
    .populate('instracter', 'firstname lastname code profilePic')
    .select('-sections.videos.video -sections.videos.materials')

  return successResponse({
    res,
    message: 'all courses',
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

  if (!courseExist) errorResponse({ res, message: "course not found", statusCode: 404 })

  return successResponse({
    res,
    message: "get specific course",
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
    return res.status(404).json({
      access: "none",
      message: "User is not enrolled in any courses or sections"
    });
  }

  return res.status(200).json({
    access: "found",
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

  if (!course) return errorResponse({ res, message: "course not found", statusCode: 404 })

  //check if user enrolled in full course
  const inCourse = course.students.some(
    studentId => studentId.toString() === userId.toString()
  );
  if (inCourse) {
    return successResponse({
      res,
      message: "full",
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
      message: "sections",
      statusCode: 200,
      data: course
    })
  }

  //not enrolled anywhere
  return successResponse({
    res,
    message: "User is not enrolled in this course or any section",
    statusCode: 403,
    success: false
  })
}

//                                  -------update-------
//update section 
export const updateSection = async (req, res, next) => {
  const { sectionId } = req.params

  //check existence
  const sectionExist = await Course.findOne({ "sections._id": sectionId })
  if (!sectionExist) errorResponse({ res, message: 'section notfound', statusCode: 404 })

  //prepare data
  attachFiles(req)
  if (req.body.sections[0]?.videos?.length) {
    for (let i = 0; i < req.body.sections[0].videos.length; i++) {
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

//update course 
export const updateCourse = async (req, res, next) => {
  const { id } = req.params

  //check existence 
  const courseExist = await Course.findById(id)
  if (!courseExist) errorResponse({ res, message: "course not fond", statusCode: 404 })

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
    message: 'updated Successfully',
    statusCode: 201,
    data: updatedCourse
  })
}

//                                  -------join-------
//join course
export const joinCourse = async (req, res, next) => {
  const { id } = req.params
  const { user } = req

  //cehck exitence 
  const courseExist = await Course.findOne({ _id: id, isActive: true })
  if (!courseExist) errorResponse({ res, message: 'course no found', statusCode: 404 })
  const studentExist = courseExist.students.find(stu => stu.toString() == user._id.toString())
  if (studentExist) errorResponse({ res, message: "student already joined in this course", statusCode: 401 })

  //prepare data
  courseExist.students.push(user._id)

  //save
  await courseExist.save()

  //response 
  return successResponse({
    res,
    message: 'join successfully',
    statusCode: 200,
    data: courseExist.students
  })
}

// join section 
export const joinSection = async (req, res, next) => {
  const { sectionId } = req.params
  const { user } = req

  //check existence 
  const courseExist = await Course.findOne(
    { "sections._id": sectionId, isActive: true },
    { "sections.$": 1, name: 1, students: 1 }
  )
  if (!courseExist) errorResponse({ res, message: 'section not found', statusCode: 404 })

  let studentExist = courseExist.students.find(stu => stu.toString() == user._id.toString())
  if (studentExist) errorResponse({ res, message: 'student already joined in this course', statusCode: 401 })
  studentExist = courseExist.sections[0].students.find(stu => stu.toString() == user._id.toString())
  if (studentExist) errorResponse({ res, message: 'student already joined in this section', statusCode: 401 })
  
  //save
  const joinedStudent = await Course.findOneAndUpdate(
    { "sections._id": sectionId },
    { $push: { "sections.$.students": user._id } },
    { new: true }
  ).select('sections')
  const section = joinedStudent.sections.find(
  (sec) => sec._id.toString() === sectionId
);
  //responase
  return successResponse({
    res,
    message: "joined successfully",
    statusCode: 200,
    data: section
  })
  // const studentExist  
}
