import bcrypt from "bcrypt";


export const hash = async ({ plainText = "", slatRound = Number(process.env.SALT_ROUNDS) } = {}) => {
    return await bcrypt.hash(plainText, slatRound)
}



export const compare = async ({ plainText = "", hash = "" } = {}) => {
    return await bcrypt.compare(plainText, hash)
}



// $2b$10$nOUIs5kJ7naTuTFkBy1veuK0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
//  |  |  |                     |
//  |  |  |                     hash-value = K0kSxUFXfuaOKdOKf9xYT0KKIGSJwFa
//  |  |  |
//  |  |  salt = nOUIs5kJ7naTuTFkBy1veu
//  |  |
//  |  cost-factor => 10 = 2^10 rounds
//  |
//  hash-algorithm identifier => 2b = BCrypt