import userModel from "../../DB/Models/user.model.js";
import messageModel from "../../DB/Models/message.model.js";
import * as dbServic from "../../DB/dbService.js";
import { successResponse } from "../../Utils/successResponse.utiles.js";


export const createMessage = async (req, res, next) => {

    const { content } = req.body;
    const { receiverId } = req.params;

    //check if user exists
    const receiver = await dbServic.findById({
        model: userModel,
        id: receiverId
    });
    if (!receiver) {
        return next(new Error("Receiver not found"));
    }

    const message = await dbServic.create({
        model: messageModel,
        data: [{
            content,
            receiverId: receiver._id
        }],
    });

    return successResponse({ res, message: 'Message sent successfully', data: { message } })

}


export const getMessages = async (req, res, next) => {

    const { page, limit } = req.query;
    const { content } = req.query;
    const pageNumber = parseInt(page) || "";
    const limitNumber = parseInt(limit) || "";
    const skip = (pageNumber - 1) * limitNumber
    const messages = await dbServic.find({
        model: messageModel,
        // populate: [{ path: "receiverId", select: "firstName lastName email receiverId -_id" }] ,
        filter: {
            content: {
                $regex: content,
                $options: "i"
            }
        },
        select: "-__v",
        skip,
        limit: limitNumber
    })

    return successResponse({ res, message: "All messages Feteched successfully ", data: { messages } })
}