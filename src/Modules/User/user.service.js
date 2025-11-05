import * as dbService from "../../DB/dbService.js"
import tokenModel from "../../DB/Models/token.model.js"
import userModel from "../../DB/Models/user.model.js"
import { asymmetricDecrypt, decrypt } from "../../Utils/Encrypation/encrypation.util.js"
import { successResponse } from "../../Utils/successResponse.utiles.js"


export const allUsers = async (req, res, next) => {
    let users = await dbService.find({
        model: userModel,
        filter: {},
        populate: [{path : "messages" , select : "content -_id -receiverId" }]
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


export const updateProfile = async (req, res, next) => {
    const { firstName, lastName, gender } = req.body;
    const verifyBlackListToken = await dbService.findOne({ model: tokenModel, filter: { jwtid: req.decodedToken.jti } })
    if (verifyBlackListToken) {
        return next(new Error("Token is Revoked", { cause: 401 }))
    }
    const user = await dbService.findByIdAndUpdate({ model: userModel, id: req.user._id, data: { firstName, lastName, gender, $inc: { __v: 1 } } })
    return successResponse({ res, message: "Profile updated successfully", data: { user } })
}



export const updateProfileImage = async (req , res , next) => {
    return successResponse({ res, message: "image updated successfully", data: { file : req.file  } })
    
}