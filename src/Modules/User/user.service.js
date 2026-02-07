import * as dbService from "../../DB/dbService.js"
import tokenModel from "../../DB/Models/token.model.js"
import userModel, { roleEnum } from "../../DB/Models/user.model.js"
import { asymmetricDecrypt, decrypt } from "../../Utils/Encrypation/encrypation.util.js"
import { cloudinaryConfig } from "../../Utils/multer/cloudinary.config.js"
import { successResponse } from "../../Utils/successResponse.utiles.js"


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


export const getUser = async (req, res, next) => {
    return successResponse({ res, message: 'User fetched successsfuly', data: { userData: req.user } })
}


export const updateProfile = async (req, res, next) => {
    const { firstName, lastName, gender } = req.body;
    const verifyBlackListToken = await dbService.findOne({ model: tokenModel, filter: { jwtid: req.decoded.jti } })
    if (verifyBlackListToken) {
        return next(new Error("Token is Revoked", { cause: 401 }))
    }
    const user = await dbService.findByIdAndUpdate({ model: userModel, id: req.user._id, data: { firstName, lastName, gender, $inc: { __v: 1 } } })
    return successResponse({ res, message: "Profile updated successfully", data: { user } })
}



export const updateProfileImage = async (req, res, next) => {

    // const user = await dbService.findOneAndUpdate({
    //     model: userModel,
    //     filter: { _id: req.user._id },
    //     data: { profileImage: req.file.finalPath, $inc: { __v: 1 } }
    // })
    // if (!user) {
    //     return next(new Error("User not found", { cause: 404 }))
    // }



    //upload in cloud 

    if (!req.file) {
        return next(new Error("Image is required", { cause: 400 }));
    }

    const oldPublicId = req.user.cloudProfileImage?.public_id;


    console.log("Uploading to cloudinary...");

    const { public_id, secure_url } =
        await cloudinaryConfig().uploader.upload(req.file.path, {
            folder: `Sara7aApp/Users/${req.user._id}`,
        });

    console.log("Uploading to cloudinary...");


    const user = await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: {
            cloudProfileImage: { public_id, secure_url },
            $inc: { __v: 1 },
        },
    });

    if (!user) {
        // rollback الصورة الجديدة لو اليوزر مش موجود
        await cloudinaryConfig().uploader.destroy(public_id);
        return next(new Error("User not found", { cause: 404 }));
    }

    // حذف الصورة القديمة بعد نجاح التحديث
    if (oldPublicId) {
        await cloudinaryConfig().uploader.destroy(oldPublicId);
    }

    return successResponse({ res, message: "image updated successfully", data: { public_id, secure_url } })

}



export const coverImages = async (req, res, next) => {

    const attachments = []

    for (const file of req.files) {
        const { public_id, secure_url } = await cloudinaryConfig().uploader.upload(file.path, {
            folder: `Sara7aApp/Users/${req.user._id}`
        })
        attachments.push({ public_id, secure_url })
    }

    const user = await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: req.user._id },
        data: { cloudCoverImage: attachments, $inc: { __v: 1 } }
    })
    if (!user) {
        return next(new Error("User not found", { cause: 404 }))
    }

    if (req.user.cloudCoverImage.length > 0) {
        for (const image of req.user.cloudCoverImage) {
            await cloudinaryConfig().uploader.destroy(image.public_id)
        }
    }
    return successResponse({ res, message: "cover images uploadeds successfully", data: { user } })

}




export const freezeAccount = async (req, res, next) => {
    const { userId } = req.params;

    if (userId && req.user.role !== roleEnum.ADMIN) {
        return next(new Error("You are not authorized to freeze this account", { cause: 401 }))
    }


    const updatedUser = await dbService.findOneAndUpdate({
        model: userModel,
        filter: { _id: userId || req.user._id, freezedAt: { $exists: false } },
        data: { freezedAt: Date.now(), freezedBy: req.user._id, $unset: { restoredAt: 1, restoredBy: 1 }, $inc: { __v: 1 } }
    })
    return updatedUser ?
        successResponse({ res, message: "Account frozen successfully", data: { updatedUser } }) :
        next(new Error("User not found", { cause: 404 }))
}



export const restoreAccount = async (req, res, next) => {

    const { userId } = req.params;

    if (userId && req.user.role === roleEnum.ADMIN) {
        const user = await dbService.findById({ model: userModel, id: userId })
        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }
        if (user.freezedBy.toString() !== req.user._id.toString()) {
            return next(new Error("this account freezed by owner of the account", { cause: 401 }))
        }

        const updatedUser = await dbService.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: userId,
                freezedAt: { $exists: true },
                freezedBy: { $exists: true }
            },
            data: {
                $unset: { freezedAt: 1, freezedBy: 1 },
                restoredAt: Date.now(),
                restoredBy: req.user._id,
                $inc: { __v: 1 }
            }
        })

        return successResponse({ res, message: "Account restored successfully", data: { updatedUser } })

    } if (!userId && req.user.role === roleEnum.USER) {
        const user = await dbService.findById({ model: userModel, id: req.user._id })

        if (user.freezedBy?.toString() !== req.user._id.toString()) {
            return next(new Error("your accound frezzed by admin", { cause: 401 }))
        }

        const updatedUser = await dbService.findOneAndUpdate({
            model: userModel,
            filter: {
                _id: req.user._id,
                freezedAt: { $exists: true },
                freezedBy: { $exists: true },
                freezedBy: req.user._id
            },
            data: {
                $unset: { freezedAt: 1, freezedBy: 1 },
                restoredAt: Date.now(),
                restoredBy: req.user._id,
                $inc: { __v: 1 }
            }
        })

        return successResponse({ res, message: "Account restored successfully", data: { updatedUser } })
    }


}



export const deleteAccount = async (req, res, next) => {
    const { userId } = req.params;
    const authUser = req.user;

    // ======================
    // USER deletes himself
    // ======================
    if (!userId) {
        if (authUser.role !== roleEnum.USER) {
            return next(new Error("Not authorized", { cause: 401 }));
        }

        const user = await dbService.findById({
            model: userModel,
            id: authUser._id,
        });

        if (!user) {
            return next(new Error("User not found", { cause: 404 }));
        }

        if (user.freezedBy === roleEnum.ADMIN) {
            return next(new Error("Account freezed by admin", { cause: 401 }));
        }
        if (!user.freezedAt) {
            return next(new Error("Account not freezed", { cause: 401 }));
        }

        await dbService.findByIdAndDelete({
            model: userModel,
            id: authUser._id,
        });

        return successResponse({ res, message: "Account deleted successfully" });
    }

    // ======================
    // ADMIN deletes user
    // ======================
    if (authUser.role !== roleEnum.ADMIN) {
        return next(new Error("Not authorized", { cause: 401 }));
    }

    const user = await dbService.findOne({
        model: userModel,
        filter: {
            _id: userId,
            freezedAt: { $exists: true },
        },
    });

    if (!user) {
        return next(
            new Error("User not found or account not freezed", { cause: 404 })
        );
    }

    await dbService.findByIdAndDelete({
        model: userModel,
        id: userId,
    });

    return successResponse({ res, message: "Account deleted successfully" });
};
