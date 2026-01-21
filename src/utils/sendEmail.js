import nodemailer from "nodemailer"
import fs from "fs";
import path from "path";
export const sendEmail = async ({ to, subject, otp, type }) => {
    let htmlContent = ""
    if (type === "sendOtp") {
        const htmlPath = path.join(
            process.cwd(),
            "src",
            "templates",
            "otp.template.html"
        );

         htmlContent = fs.readFileSync(htmlPath, "utf8");

        htmlContent = htmlContent.replace("{{otpCode}}", otp);
        htmlContent = htmlContent.replace("{{userName}}", to);
        htmlContent = htmlContent.replace("{{otpValidityMinutes}}", 15);
        htmlContent = htmlContent.replace("{{supportEmail}}", "Gradia.kwt@gmail.com");

    } else {

        const htmlPath = path.join(
            process.cwd(),
            "src",
            "templates",
            "resete-password.template.html"
        );

        htmlContent = fs.readFileSync(htmlPath, "utf8");

        htmlContent = htmlContent.replace("{{otpCode}}", otp);
        htmlContent = htmlContent.replace("{{userName}}", to);
        htmlContent = htmlContent.replace("{{otpValidityMinutes}}", 15);
        htmlContent = htmlContent.replace("{{supportEmail}}", "Gradia.kwt@gmail.com");
    }
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER_NAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const info = await transporter.sendMail({
        from: 'social-media 👻', // sender address
        to, // list of receivers
        subject, // Subject line
        html: htmlContent// html body
    });

}