import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { roleTypes } from "../../common/constant/user.js";
import { messages } from "../../common/messages/message.js";
import { Certificate } from "../../db/model/certificate.js";
import { Course } from "../../db/model/course.js";
import { instructorSalary } from "../../db/model/instructor.salary.js";
import { User } from "../../db/model/user.js";
import { attachFiles } from "../../utils/multer/attachFiles.js";
import digitalOcean from "../../utils/multer/cloud.config.js";
import { deleteFile } from "../../utils/multer/deletefille.js";
import { errorResponse, successResponse } from "../../utils/res/index.js";

//create course
export const createCourse = async (req, res, next) => {
  const { user, files } = req

  //cehck existence 
  const instructorExist = await User.findById(req.body.instructor)
  if (!instructorExist) errorResponse({ res, message: messages.user.notFound, statusCode: 404 })
  if (instructorExist.role !== roleTypes.INSTRUCTOR) errorResponse({ res, message: messages.course.shouldBeInstructor, statusCode: 401 })
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
  req.body.freeVideo = freeVideo.key
  if (req.body.startAt == Date.now() || req.body.startAt <= Date.now()) req.body.isActive = true


  const createdCourse = await Course.create(req.body)

  return successResponse({
    res,
    statusCode: 201,
    message: messages.course.createdSuccessfully,
    data: createdCourse
  })
}

//get course from search
export const searchCourse = async (req, res, next) => {
  const { name } = req.query

  if (!name) errorResponse({ res, message: messages.course.searchNameRequired, statusCode: 404 })

  const courses = await Course.find({
    $or: [
      { 'name.ar': { $regex: name, $options: 'i' } },
      { 'name.en': { $regex: name, $options: 'i' } }
    ], isActive: true
  })
    .populate('instructor', 'firstname lastname code profilePic')
    .select('-sections.videos.video -sections.videos.materials -instructorRatio')

  if (!courses.length) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })
    
  return successResponse({
    res,
    message: messages.course.getAll,
    statusCode: 200,
    data: courses
  })

}

//get all courses 
export const allCourses = async (req, res, next) => {

  const courses = await Course.find({ isActive: true })
    .populate('instructor', 'firstname lastname code profilePic')
    .select('-sections.videos.video -sections.videos.materials -instructorRatio')

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
    .populate('instructor', 'firstname lastname code profilePic')
    .select('-sections.videos.video -sections.videos.materials -instructorRatio')

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
    .populate('instructor', 'firstname lastname code profilePic')
    .select('-instructorRatio')

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
      statusCode: 404
    });
  }

  return successResponse({
    res,
    message: messages.course.getAllPayed,
    statusCode: 200,
    data: {
      fullCoursesCount: fullCourses.length,
      sectionAccessCount: sectionAccess.length,
      fullCourses,
      sectionAccess
    }
  });

};

//get specific payed course or sections 
export const payedCourse = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id; // from auth middleware

  const course = await Course.findOne({ _id: id, isActive: true })
    .populate('instructor', 'username code profilePic')
    .select('-instructorRatio')

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
  if (req.body.name) {
    const certificateExist = await Certificate.findOne({ courseId: courseExist._id })
    if (certificateExist) {
      certificateExist.courseName = req.body.name
      await certificateExist.save()
    }
    courseExist.name = req.body.name
  }
  if (req.body.description) {
    const certificateExist = await Certificate.findOne({ courseId: courseExist._id })
    if (certificateExist) {
      certificateExist.courseDescription = req.body.description
      await certificateExist.save()
    }
    courseExist.description = req.body.description
  }
  if (req.body.price) courseExist.price = req.body.price
  if (req.body.startAt) courseExist.startAt = req.body.startAt
  if (req.body.endAt) courseExist.endAt = req.body.endAt
  const freeVideo = req.files.find(file => file.fieldname == "freeVideo")
  if (freeVideo) {
    deleteFile(courseExist.freeVideo)
    courseExist.freeVideo = freeVideo.key
  }

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

  //instructor salary update
  if (courseExist.instructorRatio) {
    const instructorSalaryAmount = (courseExist.price * courseExist.instructorRatio) / 100;
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
  await courseExist.save()

  //response 
  return successResponse({
    res,
    message: messages.course.joinCourseSuccessfully,
    statusCode: 200,
    data: courseExist.students
  })
}

//get video materials
export const getMaterials = async (req, res, next) => {
  const { id, sectionId, videoId } = req.params;
  const userId = req.user._id;

  //cehck existence 
  const course = await Course.findOne({
    _id: id,
    sections: { $elemMatch: { _id: sectionId, "videos._id": videoId } }
  }, { "sections.$": 1, students: 1 });

  if (!course) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })

  //cehck if user is student
  const userIdStr = userId.toString();
  const isStudent = course.students.some((id) => id.toString() === userIdStr) || course.sections[0].students.some((id) => id.toString() === userIdStr);
  if (!isStudent) errorResponse({ res, message: messages.course.userNotEnrolled, statusCode: 403 })

  //materials path
  const materialPaths = course?.sections[0]?.videos[0]?.materials;
  if (!materialPaths) errorResponse({ res, message: messages.course.materialNotFound, statusCode: 404 })


  const urls = await Promise.all(
    materialPaths.map(async (key) => {
      const command = new GetObjectCommand({
        Bucket: "my-uploads",
        Key: key,
        ResponseContentType: "application/pdf",
        ResponseContentDisposition: "inline",
      });

      return await getSignedUrl(digitalOcean, command, {
        expiresIn: 60 * 5, // 5 minutes
      });
    })
  );

  successResponse({
    res,
    message: messages.course.getAll,
    data: {
      count: urls.length,
      urls,
    },
    statusCode: 200,
    success: true
  })
}

//stream video
export const streamVideo = async (req, res) => {

  const { id, sectionId, videoId } = req.params;
  const userId = req.user._id;

  //cehck existence 
  const course = await Course.findOne({
    _id: id,
    sections: { $elemMatch: { _id: sectionId, "videos._id": videoId } }
  }, { "sections.$": 1, students: 1 });

  if (!course) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })

  //cehck if user is student
  const userIdStr = userId.toString();

  const isStudent = course.students.some((id) => id.toString() === userIdStr) || course.sections[0].students.some((id) => id.toString() === userIdStr);
  if (!isStudent) errorResponse({ res, message: messages.course.userNotEnrolled, statusCode: 403 })

  // Streaming part
  const videoPath = course?.sections[0]?.videos[0]?.video;

  if (!videoPath) errorResponse({ res, message: messages.course.videoNotFound, statusCode: 404 })

  if (!course.sections[0].videos[0].isWatched) {
    await Course.updateOne({
      _id: id,
      "sections._id": sectionId,
      "sections.videos._id": videoId
    }, {
      $set: {
        "sections.$[sec].videos.$[vid].isWatched": true
      }
    },
      {
        arrayFilters: [
          { "sec._id": sectionId },
          { "vid._id": videoId }
        ]
      });
  }

  const command = new GetObjectCommand({
    Bucket: "my-uploads",
    Key: videoPath,
  });

  const signedUrl = await getSignedUrl(digitalOcean, command, {
    expiresIn: 300, // 5 دقائق
  });

  res.json({
    url: signedUrl,
  });
};

//stream free video
export const streamFreeVideo = async (req, res) => {
  const { id } = req.params;

  //cehck existence
  const course = await Course.findById(id);
  if (!course) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })


  const command = new GetObjectCommand({
    Bucket: "my-uploads",
    Key: course.freeVideo,
  });

  const signedUrl = await getSignedUrl(digitalOcean, command, {
    expiresIn: 300, // 5 دقائق
  });

  res.json({
    url: signedUrl,
  });
};

//delete course
export const deleteCourse = async (req, res) => {
  const { id } = req.params;

  //check existence
  const courseExist = await Course.findById(id);
  if (!courseExist) errorResponse({ res, message: messages.course.notFound, statusCode: 404 })
  if (courseExist.isActive == true) errorResponse({ res, message: messages.course.cannotDeleteActiveCourse, statusCode: 400 })

  const videoPaths = [];
  //collect video paths from sections
  courseExist.sections.forEach(section => {
    section.videos.forEach(video => {
      if (video.video) {
        videoPaths.push(video.video);
      }
    });
  });
  //delete videos from storage
  videoPaths.forEach(videoPath => deleteFile(videoPath));

  //delete free video
  deleteFile(courseExist.freeVideo);

  //delete course from db
  await Course.findByIdAndDelete(id);

  return successResponse({
    res,
    message: messages.course.deletedSuccessfully,
    statusCode: 200
  })
}
