import { Router } from "express";
import * as adminService from "./admin.service.js";
import { authentaction, authorization, tokenTypeEnum } from "../../Middelwares/auth.middleware.js";
import { validation } from "../../Middelwares/validation.middelware.js";
import * as validationSchema from "./admin.validation.js";
import { roleEnum } from "../../DB/Models/user.model.js";
const router = Router();

router.get("/get-messages", authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), authorization({ accessRoles: [roleEnum.ADMIN] }), validation(validationSchema.getMessageSchema), adminService.getMessages);


router.get("/", authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), authorization({ accessRoles: [roleEnum.ADMIN] }), adminService.allUsers)


router.post("/Create-User-Admin", authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), authorization({ accessRoles: [roleEnum.ADMIN] }), validation(validationSchema.createUserSchema), adminService.createUser)


export default router