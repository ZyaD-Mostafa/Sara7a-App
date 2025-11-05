import { EventEmitter } from "events";
import { emailSubject, sendEmail } from "../Emails/email.utils.js";
import { template } from "../Emails/otpEmailHTML.js";

export const emailEvent = new EventEmitter();
emailEvent.on("sendEmail", (data) => {
    sendEmail({
        to: data.to, subject: emailSubject.confirmEmail, html: template(data.otp, data.firstName)
    }).then(() => console.log(`✅ Email sent to ${data.to}`))
        .catch(err => console.error("❌ Email sending failed:", err.message));
})


emailEvent.on("forgetPassword", (data) => {
    sendEmail({
        to: data.to, subject: emailSubject.forgetPassword, html: template(data.otp, data.firstName ,emailSubject.forgetPassword )
    }).then(() => console.log(`✅ Email sent to ${data.to}`))
        .catch(err => console.error("❌ Email sending failed:", err.message));
})