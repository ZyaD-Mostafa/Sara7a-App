import mongoose from "mongoose";
const toeknSchema = new mongoose.Schema({

    jwtid: { type: String, required: true, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: "User",
        required: true
    },
    expiresIn: {
        type: Date,
        required: true
    }
},
    {
        timestamps: true
    })


const tokenModel = mongoose.models.Token || mongoose.model("Token", toeknSchema);

export default tokenModel;