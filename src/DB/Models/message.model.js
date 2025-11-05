import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
   {
    content :{
        type : String , 
        required : true,
        minLength : [2 , "Content must be at least 2 characters long"],
        maxLength : [500 , "Content must be at most 500 characters long"]
    },
    // senderId : {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "User"
    // },
    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User", 
        required : true
    }

   },
    {
        timestamps: true
    })


const messageModel = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default messageModel;
