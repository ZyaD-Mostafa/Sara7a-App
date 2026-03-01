import joi from "joi"
import { generalFields } from "../../Middelwares/validation.middelware.js"

export const loginAdminSchema = {
    body: joi.object({
        email: generalFields.email.required(),
        password: generalFields.password.required(),
    })
}

export const getMessageSchema = {
    query: joi.object({
        page: joi.number().positive(),
        limit: joi.number().positive(),
        content: joi.string(),
    })
}

export const createUserSchema ={
    body: joi.object({
        firstName: generalFields.firstName.required(),
        lastName: generalFields.lastName.required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        gender: generalFields.gender.required(),
        phone: generalFields.phone.required(),
    })
}