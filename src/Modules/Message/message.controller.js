import { Router  } from "express";
import * as messageService from "./message.service.js";
import { validation } from "../../Middelwares/validation.middelware.js";
import { sendMessageSchema } from "./message.validation.js";
const router = Router();


router.post("/send-message/:receiverId", validation(sendMessageSchema),  messageService.createMessage);
router.get("/get-messages", messageService.getMessages);


export default router