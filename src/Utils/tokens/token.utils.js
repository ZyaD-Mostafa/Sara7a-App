import jwt from "jsonwebtoken";

export const generateToken = ({ payload, secretKey = process.env.TOKEN_ACCESS_SECRET_KEY,
    option = { expiresIn: process.env.TOKEN_EXPIRE_TIME } }) => {
    return jwt.sign(payload, secretKey, option)
}


export const verifyToken = ({ token, secretKey = process.env.TOKEN_ACCESS_SECRET_KEY }) => {
    return jwt.verify(token, secretKey)
}