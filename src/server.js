
import connectDb from "./db/connection.js"
import authRouter from "./module/auth/auth.route.js"
import bannerRouter from "./module/banner/banner.route.js"
import userRouter from "./module/user/user.route.js"
import { globalErrorHandling } from "./utils/error/global-errorhandling.js"
import i18n from "./utils/i18n.js"

const server = async (app, express) => {

    //parse req
    app.use(express.json())

    app.use(i18n.init);

    //connect to db
    await connectDb()

    //routes
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/banner', bannerRouter)

    app.use(globalErrorHandling)
}

export default server