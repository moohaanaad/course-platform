import { Course } from "../../db/model/course.js"
import { attachFiles } from "../../utils/multer/attachFiles.js";
import { errorResponse, successResponse } from "../../utils/res/index.js"
import randomstring from 'randomstring'

//create course
export const createCourse = async (req, res, next) => {
  const { user, files } = req

  console.log("befor");
  console.log(req.body);

  //prepare data
  attachFiles(req)
  for (let section of req.body.sections) {
    console.log(section);
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
  req.body.instracter = user._id
  req.body.code = randomstring.generate(4)
  req.body.freeVideo = freeVideo.path
  console.log("after");
  console.log(req.body);


  const createdCourse = await Course.create(req.body)

  return successResponse({
    res,
    statusCode: 201,
    message: "course created successfully",
    data: createdCourse
  })
}

//get all courses 
export const allCourses = async (req, res, next) => {

  const courses = await Course.find()
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
  const courseExist = await Course.findById(id)
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
  const courses = await Course.find()
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

  const course = await Course.findById(id).populate('instracter', 'username code profilePic');

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