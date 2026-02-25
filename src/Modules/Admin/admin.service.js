import userModel, { genderEnum, providerEnum, roleEnum } from "../../DB/Models/user.model.js";
import { successResponse } from "../../Utils/successResponse.utiles.js";
import * as dbService from "../../DB/dbService.js"
import { asymmetricDecrypt, asymmetricEncrypt, encrypt } from "../../Utils/Encrypation/encrypation.util.js";
import { emailEvent } from "../../Utils/Events/email.event.utils.js";
import { customAlphabet } from "nanoid";
import { compare, hash } from "../../Utils/Hashing/hashing.utils.js";
import { generateToken, getNewLoginCrediential, verifyToken } from "../../Utils/tokens/token.utils.js";
import messageModel from "../../DB/Models/message.model.js";
import { v4 as uuidv4 } from "uuid"



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


export const getMessages = async (req, res, next) => {

    const { page, limit } = req.query;
    const { content } = req.query;
    const pageNumber = parseInt(page) || "";
    const limitNumber = parseInt(limit) || "";
    const skip = (pageNumber - 1) * limitNumber

    const filter = {};
    if (content) {
        filter.content = {
            $regex: content,
            $options: "i"
        };
    }
    const messages = await dbService.find({
        model: messageModel,
        // populate: [{ path: "receiverId", select: "firstName lastName email receiverId -_id" }] ,
        filter,
        select: "-__v",
        skip,
        limit: limitNumber
    })

    return successResponse({ res, message: "All messages Feteched successfully ", data: { messages } })
}


export const allUsers = async (req, res, next) => {
    let users = await dbService.find({
        model: userModel,
        filter: {},
        populate: [{ path: "messages", select: "content -_id -receiverId" }]
    })
    // symetric decryption
    // users = users.map((user => {
    //     return {
    //         ...user._doc,
    //         phone: decrypt(user.phone)
    //     }

    // }))

    //asymetric decryption
    // users = users.map((user) => {
    //     return {
    //         ...user._doc,
    //         phone: asymmetricDecrypt(user.phone)
    //     }
    // })

    return successResponse({ res, message: 'All user fetched successsfuly', data: { users } })
}


export const createUser = async (req, res, next) => {
    const { firstName, lastName, email, password, gender, phone } = req.body;
    let checkUser = await dbService.findOne({ model: userModel, filter: { email } }); // null || doc 
    if (checkUser) {
        return next(new Error("User already exists ", { cause: 400 }))
    }

    const tlds = email.split("@")[1];
    if (tlds !== "sara7a.com") {
        return next(new Error("Invalid email domain , email domain must be sara7a.com", { cause: 400 }))
    }

    const user = await dbService.create({
        model: userModel, data: [{
            firstName,
            lastName,
            email,
            password: await hash({ plainText: password }),
            role: roleEnum.ADMIN,
            confirmEmail: new Date(),
            shareId: uuidv4(),
            gender,
            phone
        }]
    })

    const creidentails = await getNewLoginCrediential(user)

    return successResponse({ res, message: "User created successfully", data: { creidentails } })
}







