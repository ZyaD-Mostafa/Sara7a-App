import { Router } from "express";
import * as userService from "../User/user.service.js"
import { authentaction, authorization, tokenTypeEnum } from "../../Middelwares/auth.middleware.js";
import { fileValidation, localFileUpload } from "../../Utils/multer/local.multer.js";
import { fileValidationMagicNumber } from "../../Middelwares/verifyFileUpload.middelware.js";
import { validation } from "../../Middelwares/validation.middelware.js";
import { deleteAccountSchema, freezeAccountSchema, profileImageSchema, restoreAccountSchema } from "./user.validation.js";
import { cloudFileUploadMulter } from "../../Utils/multer/cloud.multer.js";
import { roleEnum } from "../../DB/Models/user.model.js";
const router = Router();



router.get("/", userService.allUsers)
router.get("/getUser",authentaction({
    tokenType: tokenTypeEnum.ACCESS
}) , authorization({ accessRoles: [roleEnum.USER , roleEnum.ADMIN ] }) ,  userService.getUser)


router.patch("/update-profile", authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), userService.updateProfile)


router.patch("/profile-image",
    authentaction({
        tokenType: tokenTypeEnum.ACCESS
    }),
    authorization({ accessRoles: [roleEnum.USER] }),
    // localFileUpload({
    //     customPath: "User",
    //     validation: [...fileValidation.images, ...fileValidation.audio]
    // }).single("profileImage"),
    // validation(profileImageSchema),
    // fileValidationMagicNumber({ allowedTypes: [...fileValidation.images, ...fileValidation.audio] })

    cloudFileUploadMulter({ validation: [...fileValidation.images] }).single("profileImage"),
    userService.updateProfileImage)


router.patch("/cover-images",
    authentaction,
    //     localFileUpload({
    //     customPath: "User",
    //     validation: [...fileValidation.images, ...fileValidation.audio]
    // }).array("coverImages", 4),

    //fileValidationMagicNumber({allowedTypes :[...fileValidation.images, ...fileValidation.audio]})

    cloudFileUploadMulter({ validation: [...fileValidation.images, ...fileValidation.audio] }).array("coverImages", 4),
    userService.coverImages)



    
// freeze account (owner of the account || admin || super admin )
// delete or patch     optional params
router.delete ("{/:userId}/freeze-account" ,  authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), authorization({ accessRoles: [roleEnum.USER , roleEnum.ADMIN ] }), validation(freezeAccountSchema), userService.freezeAccount)


router.patch ("{/:userId}/restore-account" ,  authentaction({
    tokenType: tokenTypeEnum.ACCESS
}), authorization({ accessRoles: [roleEnum.USER , roleEnum.ADMIN ] }), validation(restoreAccountSchema), userService.restoreAccount)



router.delete("/:userId/delete-account",  authentaction({
    tokenType : tokenTypeEnum.ACCESS 
}) , authorization ({accessRoles: [roleEnum.ADMIN ]}), validation(deleteAccountSchema), userService.deleteAccount)

// add vaild layer after our normal check file mime type 

//uploads / User / userid/ 
//uploads / product / productid/
export default router