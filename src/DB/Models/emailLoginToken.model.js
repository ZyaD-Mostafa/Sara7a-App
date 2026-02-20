import mongoose from "mongoose";
const emailLoginTokenSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    })


emailLoginTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const emailLoginTokenModel = mongoose.models.EmailLoginToken || mongoose.model("EmailLoginToken", emailLoginTokenSchema);

export default emailLoginTokenModel;