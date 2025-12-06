import { Types } from "mongoose";
import { genderEnum } from "../DB/Models/user.model.js"
import joi from "joi"


export const validation = (schema) => {
    // {body  } --- > req[key]
    return (req, res, next) => {

        const validationErrors = [];
        for (const key of Object.keys(schema)) {
            // [body , params]
            const validationReault = schema[key].validate(req[key], { abortEarly: false });

            if (validationReault.error) {
                validationErrors.push({ key, details: validationReault.error.details });
            }
        }

        if (validationErrors.length) {
            return res.status(400).json({ message: "Validation error", details: validationErrors })
        }
        // if there is no error
        return next();

    }

}




export const generalFields = {
    firstName: joi.string().min(2).max(20).messages({
        "string.min": "First name must be at least 2 characters long",
        "string.max": "First name must be at most 20 characters long",
        "any.required": "First name is required"
    }),
    lastName: joi.string().min(2).max(20),
    email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 5, tlds: { allow: ["com", "org", "net"] } }),
    password: joi.string(),
    confirmPassword: joi.string().valid(joi.ref("password")),
    gender: joi.string().valid(...Object.values(genderEnum)).default(genderEnum.MALE),
    phone: joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),  //Eg phone number : 01123456789
    otp: joi.string(),
    id: joi.string().custom((value, helper) => {
        return (Types.ObjectId.isValid(value) || helper.message("Invalid Object id format"))
    }),

    file: {
        fieldname: joi.string(),
        originalname: joi.string(),
        encoding: joi.string(),
        mimetype: joi.string(),
        size: joi.number().positive(),
        destination: joi.string(),
        filename: joi.string(),
        path: joi.string(),
        finalPath: joi.string(),
    }
}

