import nodemailer from "nodemailer"
import config from "../config/config.js";
import type { EmailOptions } from "../types/Auth/user.types.js";

const sendEmail = async (option: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: config.GOOGLE_USER,
            pass: config.GOOGLE_PASS
        },
        tls:{
            rejectUnauthorized:false
        }
    });

    const mailOptions = {
        from: `Zentro ${config.GOOGLE_USER}`,
        to: option.email,
        subject: option.subject,
        text:option.text,
        html:option.html
    };

    await transporter.sendMail(mailOptions);
    
}

export default sendEmail;