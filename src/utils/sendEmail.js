import nodemailer from "nodemailer"

export const sendEmail = async ({ to, subject, otp  }) => {

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
        html: `<p>
        your OTP is : ${otp} 
        </p>`// html body
    });
    
}