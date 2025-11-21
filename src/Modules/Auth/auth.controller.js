import { Router } from "express";
import * as authService from "./auth.service.js";
import { authentaction, tokenTypeEnum } from "../../Middelwares/auth.middleware.js";
import { validation } from "../../Middelwares/validation.middelware.js";
import * as validationSchema from "./auth.validation.js";
const router = Router();

router.post("/signup", validation(validationSchema.signupSchema), authService.signup)
router.post("/login", validation(validationSchema.loginSchema), authService.login)
router.patch("/confirm-email", validation(validationSchema.confirmEmailSchema), authService.confirm_email)
router.post("/revoke-token", authentaction({ tokenType: tokenTypeEnum.ACCESS }), authService.logout)
router.post("/refresh-token", authentaction({ tokenType: tokenTypeEnum.REFRESH }), authService.refreshToken)
// update password Assignment
router.patch("/update-password", authentaction, validation(validationSchema.updatePasswordSchema), authService.updatePassword)


router.patch("/forget-password", validation(validationSchema.forgetPasswordSchema), authService.forgetPassword)
router.patch("/reset-password", validation(validationSchema.resetPasswordSchema), authService.resetPassword)



router.post("/social-login", authService.loginWithGmail)







export default router