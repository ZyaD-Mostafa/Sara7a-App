import tokenModel from "../DB/Models/token.model.js";
import { verifyToken } from "../Utils/tokens/token.utils.js";
import * as dbService from "../DB/dbService.js"
import userModel from "../DB/Models/user.model.js";

export const authentaction = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return next(new Error("Authorized Token Is Missing", { cause: 400 }))
    }

    if (!authorization.startsWith(process.env.SECRET_KEY_TOKEN_FORMAT)) {
        return next(new Error("Invalid Token Format", { cause: 401 }))
    }
    const token = authorization.split(" ")[1];
    const decodedToken = verifyToken({ token });

    if (!decodedToken.jti) {
        return next(new Error("Invalid Token", { cause: 401 }))
    }

    // check if token is blacklisted || Revoked
    const verifyBlackListToken = await dbService.findOne({ model: tokenModel, filter: { jwtid: decodedToken.jti } })
    if (verifyBlackListToken) {
        return next(new Error("Token is Revoked", { cause: 401 }))
    }

    //check if user   TO GET lasted data from DB
    const user = await dbService.findById({ model: userModel, id: decodedToken.id })
    if (!user) {
        return next(new Error("User Not Found", { cause: 404 }))
    }

    req.user = user;
    req.decodedToken = decodedToken;
    next()
}

// req => object : {body , params , query , headers , user , decodedToken }