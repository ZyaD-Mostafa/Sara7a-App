import userModel, { genderEnum, providerEnum } from "../../DB/Models/user.model.js";
import { successResponse } from "../../Utils/successResponse.utiles.js";
import * as dbService from "../../DB/dbService.js"
import { asymmetricDecrypt, asymmetricEncrypt, encrypt } from "../../Utils/Encrypation/encrypation.util.js";
import { emailEvent } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet } from "nanoid";
import { compare, hash } from "../../Utils/Hashing/hashing.utils.js";
import { generateToken, getNewLoginCrediential, verifyToken } from "../../Utils/tokens/token.utils.js";
import { v4 as uuid } from "uuid"
import tokenModel from "../../DB/Models/token.model.js";
import { OAuth2Client } from 'google-auth-library';

export const signup = async (req, res, next) => {

    const { firstName, lastName, email, password, confirmPassword, gender, phone } = req.body;


    //check if user is exist
    const checkUser = await dbService.findOne({ model: userModel, filter: { email } })
    if (checkUser) {
        return next(new Error("User already exists", { cause: 409 }))
    }

    // generate otp
    const otp = customAlphabet("1234567890", 6)();


    // symetric encryption
    // const cryptedPhone  = encrypt(phone)  

    //asymetric encryption
    const cryptedPhone = await asymmetricEncrypt(phone);

    // otp expires in 3 minutes
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

    //create user
    const user = await dbService.create({
        model: userModel,
        data: [{ firstName, lastName, email, password: await hash({ plainText: password }), gender, phone: cryptedPhone, confirmEmailOTP: await hash({ plainText: otp }), confirmEmailOTPExpiresAt: otpExpiresAt }]
    })


    //sending email
    emailEvent.emit("sendEmail", { to: email, otp, firstName })


    return successResponse({ res, statusCode: 201, message: "User created successfully", data: user })

}

export const resendOtp = async (req, res, next) => {
    const { email } = req.body;
    //check if user is exist
    const checkUser = await dbService.findOne({ model: userModel, filter: { email } })
    if (!checkUser) {
        return next(new Error("User not found", { cause: 404 }))
    }
    // generate otp
    const otp = customAlphabet("1234567890", 6)();
    // otp expires in 3 minutes
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
    // update user
    await dbService.updateOne({ model: userModel, filter: { email }, data: { confirmEmailOTP: await hash({ plainText: otp }), confirmEmailOTPExpiresAt: otpExpiresAt } })
    //sending email
    emailEvent.emit("sendEmail", { to: email, otp, firstName: checkUser.firstName })
    return successResponse({ res, statusCode: 200, message: "OTP resent successfully" })
}

export const login = async (req, res, next) => {

    const { email, password } = req.body;
    //check if user is exist
    let checkUser = await dbService.findOne({ model: userModel, filter: { email } }); // null || doc 
    if (!checkUser) {
        return next(new Error("User not found ", { cause: 404 }))
    }

    if (!(await compare({ plainText: password, hash: checkUser.password }))) {
        return next(new Error("Invalid Email or Password ", { cause: 400 }))
    }
    if (!checkUser.confirmEmail) {
        return next(new Error("Please confirm your email", { cause: 400 }))
    }
    // checkUser.phone = asymmetricDecrypt(checkUser.phone)

    const creidentails = await getNewLoginCrediential(checkUser)

    return successResponse({ res, statusCode: 200, message: "User logged in successfully", data: { creidentails } })

}

export const confirm_email = async (req, res, next) => {

    const { email, otp } = req.body;
    //check if user is exist
    let checkUser = await dbService.findOne({
        model: userModel, filter: {
            email,
            confirmEmail: { $exists: false },
            confirmEmailOTP: { $exists: true },

        }
    }); // null || doc 
    if (!checkUser) {
        return next(new Error("User not found  or email already confirmed", { cause: 404 }))
    }

    if (checkUser.confirmEmailOTPExpiresAt < Date.now()) {
        return next(new Error("OTP expired, please request a new one", { cause: 400 }));
    }

    if (!(await compare({ plainText: otp, hash: checkUser.confirmEmailOTP }))) {
        return next(new Error("Invalid OTP", { cause: 400 }))
    }
    await dbService.updateOne({
        model: userModel, filter: { email }, data: {
            confirmEmail: Date.now(),
            $unset: { confirmEmailOTP: 1, confirmEmailOTPExpiresAt: 1 },
            $inc: { __v: 1 }
        }
    })

    return successResponse({ res, statusCode: 200, message: "Email confirmed successfully" })

}


export const logout = async (req, res, next) => {
    // you must be logged in to logout 
    await dbService.create(
        {
            model: tokenModel,
            data: [{ userId: req.user._id, jwtid: req.decodedToken.jti, expiresIn: new Date(req.decodedToken.exp * 1000) }]
        });
    return successResponse({ res, message: "Logged out successfully" })
}



export const refreshToken = async (req, res, next) => {

    const user = req.user
    const creidentails = await getNewLoginCrediential(checkUser)

    return successResponse({ res, message: "Token refreshed successfully", data: { creidentails } })
}



export const forgetPassword = async (req, res, next) => {

    const { email } = req.body;

    const otp = await customAlphabet("1234567890", 6)()
    const user = await dbService.findOneAndUpdate({
        model: userModel, filter: { email, confirmEmail: { $exists: true } }, data: {
            forgetPasswordOTP: await hash({ plainText: otp }),
            forgetPasswordOTPExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
        }
    })

    if (!user) {
        return next(new Error("User not found or email not confirmed", { cause: 404 }))
    }

    emailEvent.emit("forgetPassword", { to: email, otp, firstName: user.firstName })

    return successResponse({ res, message: "Check Your Box✌️" })
}


export const updatePassword = async (req, res, next) => {

    const { password, newPassword } = req.body;

    if (!await compare({ plainText: password, hash: req.user.password })) {
        return next(new Error("Invalid Password", { cause: 400 }))
    }

    const newpass = await dbService.findByIdAndUpdate({
        model: userModel, id: req.user._id, data: {
            password: await hash({ plainText: newPassword }),
            $inc: { __v: 1 }
        }
    })

    return successResponse({ res, message: "Password updated successfully", data: newpass })

}



export const resetPassword = async (req, res, next) => {

    const { email, otp, password } = req.body;

    const user = await dbService.findOne({ model: userModel, filter: { email, forgetPasswordOTP: { $exists: true }, forgetPasswordOTPExpiresAt: { $gt: Date.now() } } })

    if (!user) {
        return next(new Error("User not found or OTP expired", { cause: 404 }))
    }
    if (user.forgetPasswordOTPExpiresAt < new Date(Date.now())) {
        return next(new Error("OTP expired", { cause: 400 }))
    }

    if (!await compare({ plainText: otp, hash: user.forgetPasswordOTP })) {
        return next(new Error("Invalid OTP", { cause: 400 }))
    }

    await dbService.findOneAndUpdate({
        model: userModel,
        data: {
            password: await hash({ plainText: password }),
            $unset: {
                forgetPasswordOTP: 1,
                forgetPasswordOTPExpiresAt: 1
            },
            $inc: { __v: 1 }
        }
    })

    return successResponse({ res, message: "Password Reset successfully" })

}


async function verfiyGoogleAccount({ idToken }) {
    const client = new OAuth2Client();

    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    return payload
}

export const loginWithGmail = async (req, res, next) => {
    const { idToken } = req.body;
    const { email, email_verified, given_name, family_name } = await verfiyGoogleAccount({ idToken })

    console.log(email, email_verified, given_name, family_name);

    if (!email_verified) {
        return next(new Error("Email not verified", { cause: 401 }))
    }

    const user = await dbService.findOne({
        model: userModel,
        filter: { email }
    })
    if (user) {
        if (user.provider === providerEnum.GOOGLE) {
            const creidentails = await getNewLoginCrediential(user)

            return successResponse({ res, statusCode: 200, message: "User logged in successfully", data: { accessToken, refreshToken } })
        }
    }


    const newUser = await dbService.create({
        model: userModel,
        data: [{
            firstName: given_name,
            lastName: family_name,
            email,
            confirmEmail: Date.now(),
            provider: providerEnum.GOOGLE
        }]
    })

    const accessToken = generateToken({
        payload: { id: user._id, email: checkUser.email }, secretKey: process.env.TOKEN_ACCESS_SECRET_KEY, option: {
            expiresIn: Number(process.env.TOKEN_ACCESS_EXPIRE_TIME),
            jwtid: uuid(),
        }
    })
    const refreshToken = generateToken({
        payload: { id: user._id, email: user.email }, secretKey: process.env.TOKEN_REFRESH_SECRET_KEY, option: {
            expiresIn: Number(process.env.TOKEN_REFRESH_EXPIRE_TIME),
            jwtid: uuid(),
        }
    })


    return successResponse({ res, message: "User created successfully", data: { accessToken, refreshToken } })
}

