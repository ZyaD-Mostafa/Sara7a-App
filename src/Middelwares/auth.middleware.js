import tokenModel from "../DB/Models/token.model.js";
import { getSignature, verifyToken } from "../Utils/tokens/token.utils.js";
import * as dbService from "../DB/dbService.js"
import userModel from "../DB/Models/user.model.js";
import { decode } from "jsonwebtoken";


export const tokenTypeEnum = {
    ACCESS: "ACCESS",
    REFRESH: "REFRESH"
}

const decodedTokenFun = async ({ authentaction, tokenType = tokenTypeEnum.ACCESS, next } = {}) => {

    const [Bearer, token] = authentaction.split(" ") || []
    if (!Bearer || !token) {
        return next(new Error("Invalid Token ", { cause: 400 }))
    }

    let signature = await getSignature({ singatureLevel: Bearer });
    
    const decoded = verifyToken({
        token,
        secretKey: tokenType === tokenTypeEnum.ACCESS ? signature.accessSignature : signature.refershSignature
    })


    if (!decoded.jti) return next(new Error("Invalid Token", { cause: 401 }))

    const revokedToken = await dbService.findOne({
        model: tokenModel,
        filter: {
            jwtid: decoded.jti
        }
    })

    if (revokedToken) return next(new Error("Token is Revoked", { cause: 401 }))

    const user = await dbService.findById({
        model: userModel,
        id: decoded.id
    })
    if (!user) return next(new Error("User Not Found", { cause: 401 }))

    return { user, decoded }
    // // const { authorization } = req.headers;
    // if (!authorization) {
    //     return next(new Error("Authorized Token Is Missing", { cause: 400 }))
    // }

    // if (!authorization.startsWith(process.env.SECRET_KEY_TOKEN_FORMAT)) {
    //     return next(new Error("Invalid Token Format", { cause: 401 }))
    // }
    // //   const token = authorization.split(" ")[1];
    // const decodedToken = verifyToken({ token });

    // if (!decodedToken.jti) {
    //     return next(new Error("Invalid Token", { cause: 401 }))
    // }

    // // check if token is blacklisted || Revoked
    // const verifyBlackListToken = await dbService.findOne({ model: tokenModel, filter: { jwtid: decodedToken.jti } })
    // if (verifyBlackListToken) {
    //     return next(new Error("Token is Revoked", { cause: 401 }))
    // }

    // //check if user   TO GET lasted data from DB
    // const user = await dbService.findById({ model: userModel, id: decodedToken.id })
    // if (!user) {
    //     return next(new Error("User Not Found", { cause: 404 }))
    // }

    // req.user = user;
    // req.decodedToken = decodedToken;
    // next()
}

export const authentaction = ({ tokenType = tokenTypeEnum.ACCESS } = {}) => {
    return async (req, res, next) => {
        const { user, decoded } = (await decodedTokenFun({
            authentaction: req.headers.authorization,
            tokenType,
            next
        })) || {};
        req.user = user
        req.decoded = decoded
        return next();
    }
}

// req => object : {body , params , query , headers , user , decoded }







export const authorization = ({ accessRoles = [] } = {}) => {
    return (req, res, next) => {
        if (!accessRoles.includes(req.user.role)) {
            return next(new Error("invalid role", { cause: 401 }))
        }
        next()
    }
}
