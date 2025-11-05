import nodemailer from "nodemailer";

export async function sendEmail({ to = "", subject = "", text, html , attachments = [] , cc ="" , bcc = "" } = {}) {
    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Wrap in an async IIFE so we can use await.

    const info = await transporter.sendMail({
        from: `"Sara7a App 😊" ${process.env.EMAIL_USER}`,
        to,
        subject,
        text, // plain‑text body
        html , // HTML body
        attachments , 
        cc,
        bcc

    });

    

    console.log("Message sent:", info.messageId);
}
export const emailSubject = {
        confirmEmail : "Confirm Your Email",
        forgetPassword : "Reset Your Password",
    }