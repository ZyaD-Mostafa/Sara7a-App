import joi from "joi"
import { generalFields } from "../../Middelwares/validation.middelware.js"
export const sendMessageSchema = {
    body: joi.object({
        content: joi.string().min(2).max(500).required(),
    })
    ,

    params: joi.object({
        shareId: generalFields.shareId.required(),
        page: joi.number().positive(),
        limit: joi.number().positive(),
    })

}


