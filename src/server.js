import connectDb from "./db/connection.js"
import authRouter from "./module/auth/auth.route.js"
import bannerRouter from "./module/banner/banner.route.js"
import { globalErrorHandling } from "./utils/error/global-errorhandling.js"


const server = async (app, express) => {

    //parse req
    app.use(express.json())

    //connect to db
    await connectDb()
    
    //routes
    app.use('/auth', authRouter)
    app.use('/banner', bannerRouter)
    
    app.use(globalErrorHandling)
}

export default server