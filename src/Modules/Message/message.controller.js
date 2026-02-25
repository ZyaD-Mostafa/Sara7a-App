import { Router } from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../Middelwares/validation.middelware.js";
import { sendMessageSchema } from "./message.validation.js";
import { authentaction, authorization, tokenTypeEnum } from "../../Middelwares/auth.middleware.js";
import { roleEnum } from "../../DB/Models/user.model.js";
import { getMessageSchema } from "../Admin/admin.validation.js";
const router = Router();


router.post("/send-message/:shareId", validation(sendMessageSchema), messageService.createMessage);

router.get("/get-my-messages", authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), authorization({ accessRoles: [roleEnum.USER] }), validation(getMessageSchema), messageService.getMyMessages);


export default router