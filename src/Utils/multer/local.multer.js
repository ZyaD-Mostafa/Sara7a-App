import multer from "multer";
import path from "path";
import fs from "fs"

export const fileValidation = {
    images : [ "image/jpeg" , "image/png" , "image/jpg"],
    audio : [ "audio/mp3" , "audio/wav" , "audio/mpeg"],
    video : [ "video/mp4" , "video/mpeg" , "video/quicktime"],
}

export const localFileUpload = ({ customPath = "general"  , validation = [] }) => {
    const basePath = `uploads/${customPath}`  //uploads/User
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            let userBasePath = basePath;
          //  if( req.user?._id) {userBasePath += `/${req.user._id}`} //uploads/User/_id
            if (req.user) {
                userBasePath +=`/${req.user._id}` // uploads/user/_id
            }
            const fullPath = path.resolve(`./src/${userBasePath}`)
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true })
            }
            cb(null, fullPath)
        },

        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "-" + file.originalname
            file.finalPath  = `${basePath}/${req.user._id}/${uniqueSuffix}`
            cb(null, uniqueSuffix)
        }
    })

    const fileFilter  = (req  ,file , cb )=>{
        if( validation.includes(file.mimetype)){
            cb(null , true)
        }else{
            cb(new Error ("Invalid file type") , false)
        }
    }
    return multer({ storage , fileFilter })
}









