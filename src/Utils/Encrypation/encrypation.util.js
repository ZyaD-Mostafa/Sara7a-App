import crypto, { Cipher } from "node:crypto";
import fs from "node:fs";

const ENCRYPATION_SECERT_KEY = Buffer.from("12345678912345678912345678912345"); // 32bit alwayes for eas
const IV_LENGTH = Number(process.env.IV_LENGTH); // 16  alwayes for eas

//Symmetric encryption
export const encrypt = (plainText) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        ENCRYPATION_SECERT_KEY,
        iv,
    )

    let encrypted = cipher.update(plainText, "utf-8", "hex");
    encrypted += cipher.final("hex")

    return iv.toString("hex") + ":" + encrypted
}

export const decrypt = (encryptedText) => {

    const [ivHex, cipherText] = encryptedText.split(":")
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        ENCRYPATION_SECERT_KEY,
        iv,
    )
    let decryptedData = decipher.update(cipherText, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
}


//=======================================================

//Asymmetric encryption


if (fs.existsSync("public_Key.pem") && fs.existsSync("private_Key.pem")) {
    console.log("Keys already exist");
} else {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem"
        }
    })

    fs.writeFileSync("public_Key.pem", publicKey)
    fs.writeFileSync("private_Key.pem", privateKey)
}

export const asymmetricEncrypt = async (plainText) => {
    const bufferedText = Buffer.from(plainText, "utf-8")
    const encryptText = crypto.publicEncrypt({
        key: fs.readFileSync("public_Key.pem", "utf-8"),
        padding: crypto.constants.RSA_OAEP_PADDING,
    },
        bufferedText
    )

    return encryptText.toString("hex")
}


export const asymmetricDecrypt = (cipherText) => {
    const bufferedCipherText = Buffer.from(cipherText, "hex")
    console.log(bufferedCipherText)
    const decryptText = crypto.privateDecrypt({
        key: fs.readFileSync("private_Key.pem", "utf-8"),
        padding: crypto.constants.RSA_OAEP_PADDING,
    },
        bufferedCipherText
    )

    return decryptText.toString("utf-8")
}