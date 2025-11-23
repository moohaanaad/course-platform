import { Course } from "../../db/model/course.js"
import { attachFiles } from "../../utils/multer/attachFiles.js";
import { errorResponse, successResponse } from "../../utils/res/index.js"
import randomstring from 'randomstring'

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

  successResponse({
    res,
    statusCode: 201,
    message: "course created successfully",
    data: createdCourse
  })
}