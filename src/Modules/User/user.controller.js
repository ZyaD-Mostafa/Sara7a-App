import { Router } from "express";
import * as userService from "../User/user.service.js"
import { authentaction } from "../../Middelwares/auth.middleware.js";
import { localFileUpload } from "../../Utils/multer/local.multer.js";
const router = Router();



router.get("/", userService.allUsers)


router.patch("/update-profile", authentaction, userService.updateProfile)
router.patch("/profile-image", authentaction, localFileUpload().single("profileImage"), userService.updateProfileImage)

export default router