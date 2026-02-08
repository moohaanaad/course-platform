
import connectDb from "./db/connection.js"
import adminRouter from "./module/admin/admin.routes.js"
import authRouter from "./module/auth/auth.route.js"
import bannerRouter from "./module/banner/banner.route.js"
import courseRouter from "./module/course/course.routes.js"
import instructorRoutour from "./module/instructor/instructor.routes.js"
import paymentRouter from "./module/payment/payment.routes.js"
import universityRouter from "./module/university/university.routes.js"
import userRouter from "./module/user/user.route.js"
import { globalErrorHandling } from "./utils/error/global-errorhandling.js"
import i18n from "./utils/i18n.js"
import './utils/jobs/activeStatus.job.js'
const server = async (app, express) => {

    //parse req
    app.use(express.json())

    app.use(i18n.init);

    //connect to db
    await connectDb()
    app.use('/uploads//image', express.static('uploads/image'));
    app.use('/uploads//User', express.static('uploads/User'));
    //routes
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/banner', bannerRouter)
    app.use('/course', courseRouter)
    app.use('/admin', adminRouter)
    app.use('/university', universityRouter)
    app.use('/instructor', instructorRoutour)
    app.use('/payment', paymentRouter)

    app.use(globalErrorHandling)
}

export default server