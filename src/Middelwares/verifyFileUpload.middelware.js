import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

// Middleware to validate file type by magic number (file signatures)
export const fileValidationMagicNumber = ({ allowedTypes = [] }) => {

    return async (req, res, next) => {
        try {
            // get the file path
            const filePath = req.file.path;
            // read the file and return buffer
            const buffer = fs.readFileSync(filePath);
            // get the file type
            const type = await fileTypeFromBuffer(buffer);
            // validate
            if (!type || !allowedTypes.includes(type.mime))
                return next(new Error("Invalid file type , from magic number"));

            return next();
        } catch (error) {
            return next(new Error("Internal server error"));
        }

    }
}