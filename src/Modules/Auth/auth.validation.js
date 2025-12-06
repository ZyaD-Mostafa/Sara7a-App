import joi from "joi"
import { generalFields } from "../../Middelwares/validation.middelware.js"
import { roleEnum } from "../../DB/Models/user.model.js"
export const signupSchema = {
    body: joi.object({

        firstName: generalFields.firstName.required(),
        lastName: generalFields.lastName.required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        confirmPassword: generalFields.confirmPassword.required(),
        gender: generalFields.gender.required(),
        phone: generalFields.phone.required(),
        otp: joi.string(),
        role : joi.string().valid(...Object.values(roleEnum)).default(roleEnum.USER)
    })

}





export const loginSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        password: generalFields.password.required(),
    })
}




export const confirmEmailSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        otp: generalFields.otp.required(),
    })
}


export const forgetPasswordSchema = {
    body: joi.object({
        email: generalFields.email.required(),
    })
}


export const updatePasswordSchema = {
    body: joi.object({
        password: generalFields.password.required(),
        newPassword: generalFields.password.required(),
        confirmPassword: joi.string().valid(joi.ref("newPassword"))
    })
}   
export const resetPasswordSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        otp: generalFields.otp.required(),
        password: generalFields.password.required(),
        confirmPassword: generalFields.confirmPassword.required(),
    })
}   