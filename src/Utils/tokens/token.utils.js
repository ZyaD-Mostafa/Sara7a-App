import jwt from "jsonwebtoken";
import { roleEnum } from "../../DB/Models/user.model.js";
import { v4 as uuid } from "uuid"

export const singatureEnum = {
    ADMIN: "ADMIN",
    USER: "USER"
}


export const generateToken = ({ payload, secretKey = process.env.TOKEN_ACCESS_SECRET_KEY,
    option = { expiresIn: process.env.TOKEN_EXPIRE_TIME } }) => {
    return jwt.sign(payload, secretKey, option)
}


export const verifyToken = ({ token, secretKey = process.env.TOKEN_ACCESS_SECRET_KEY }) => {
    return jwt.verify(token, secretKey)
}



export const getSignature = async ({ singatureLevel = singatureEnum.USER }) => {
    let signature = { accessSignature: undefined, refershSignature: undefined }

    switch (singatureLevel) {
        case singatureEnum.ADMIN:
            signature.accessSignature = process.env.ADMIN_TOKEN_ACCESS_SECRET_KEY
            signature.refershSignature = process.env.ADMIN_TOKEN_REFRESH_SECRET_KEY
            break;
        default:
            signature.accessSignature = process.env.USER_TOKEN_ACCESS_SECRET_KEY
            signature.refershSignature = process.env.USER_TOKEN_REFRESH_SECRET_KEY
            break;

    }
    console.log(signature);

    return signature


}



export const getNewLoginCrediential = async (user) => {
    const signatures = await getSignature({ singatureLevel: user.role !== roleEnum.USER ? singatureEnum.ADMIN : singatureEnum.USER })
    const jwtid = uuid()
    const accessToken = generateToken({
        payload: { id: user._id, email: user.email }, secretKey: signatures.accessSignature, option: {
            expiresIn: Number(process.env.TOKEN_ACCESS_EXPIRE_TIME),
            jwtid,
        }
    })
    const refreshToken = generateToken({
        payload: { id: user._id, email: user.email }, secretKey: signatures.refershSignature, option: {
            expiresIn: Number(process.env.TOKEN_REFRESH_EXPIRE_TIME),
            jwtid,
        }
    })

    return { accessToken, refreshToken }
}