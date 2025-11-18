
import connectDb from "./db/connection.js"
import authRouter from "./module/auth/auth.route.js"
import bannerRouter from "./module/banner/banner.route.js"
import { globalErrorHandling } from "./utils/error/global-errorhandling.js"
import path from "path"
import { fileURLToPath } from "url"
import { I18n } from 'i18n'
import userRouter from "./module/user/user.route.js"


const server = async (app, express) => {

    //parse req
    app.use(express.json())

    // //sittings i18n
    // new I18n.configure({
    //     locales: ["en", "ar"],
    //     defaultLocale: "en",
    //     directory: path.join(__dirname, "common/messages"),
    //     objectNotation: true,
    //     queryParameter: "lang" //lang=ar
    // });

    // // Middleware
    // app.use((req, res, next) => {
    //     let lang = req.headers["accept-language"];
    //     if (!lang) lang = req.query.lang;         
    //     if (!lang) lang = "en";                    

    //     I18n.setLocale(lang);
    //     req.t = I18n.__; 
    //     next();
    // });


    //connect to db
    await connectDb()

    //routes
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/banner', bannerRouter)

    app.use(globalErrorHandling)
}

export default server