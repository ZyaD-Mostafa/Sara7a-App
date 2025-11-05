import mongoose from "mongoose";
export const genderEnum = {
    MALE: "MALE",
    FEMALE: "FEMALE"
}
export const providerEnum = {
    SYSTEM: "SYSTEM",
    GOOGLE: "GOOGLE"
}
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, "First name must be at least 2 characters long"],
        maxLength: [20, "First name must be at most 20 characters long"]

    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: [2, "Last name must be at least 2 characters long"],
        maxLength: [20, "Last name must be at most 20 characters long"]
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return providerEnum.GOOGLE ? false : true
        },
    },
    gender: {
        type: String,
        enum: {
            values: Object.values(genderEnum), // ["MALE" , "FEMALE"]
            message: "Gender must be either MALE or FEMALE"
        },
        default: genderEnum.MALE
    },
    provider: {
        type: String,
        enum: {
            values: Object.values(providerEnum), // ["SYSTEM" , "GOOGLE"]
            message: "Provider must be either SYSTEM or GOOGLE"
        },
        default: providerEnum.SYSTEM
    },
    phone: String,

    confirmEmail: Date,
    confirmEmailOTP: String,
    confirmEmailOTPExpiresAt: Date,
    forgetPasswordOTP: String,
    forgetPasswordOTPExpiresAt: Date
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    })


userSchema.virtual("messages", {
    localField: "_id",
    foreignField: "receiverId",
    ref: "Message",
    justOne: false
})
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;