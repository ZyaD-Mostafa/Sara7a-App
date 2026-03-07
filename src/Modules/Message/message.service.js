import userModel from "../../DB/Models/user.model.js";
import messageModel from "../../DB/Models/message.model.js";
import * as dbServic from "../../DB/dbService.js";
import { successResponse } from "../../Utils/successResponse.utiles.js";
import { createEmailLoginToken } from "../../Utils/tokens/token.utils.js";
import { emailEvent } from "../../Utils/Events/email.event.utils.js";
import { redis } from "../../DB/Redis/ConnRedis.js";


export const createMessage = async (req, res, next) => {

    const { content } = req.body;
    const { shareId } = req.params;

    //check if user exists
    const receiver = await dbServic.findOne({
        model: userModel,
        filter: { shareId }
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
    // ✅ Generate email token
    const emailToken = await createEmailLoginToken(receiver._id);
    const inboxLink = `http://localhost:5173/#/email-login-redirect?token=${emailToken}`;

    emailEvent.emit("newMessage", { to: receiver.email, inboxLink })


    return successResponse({ res, message: 'Message sent successfully ', data: { message } })

}


export const getMyMessages = async (req, res, next) => {

    const { page, limit } = req.query;
    const { content } = req.query;
    const userId = req.user._id;
    const pageNumber = parseInt(page) || "";
    const limitNumber = parseInt(limit) || "";
    const skip = (pageNumber - 1) * limitNumber
    const cachedMessages = await redis.get(`messages:${userId}`)
    if (cachedMessages) {
        return successResponse({ res, message: "All messages Feteched successfully ", data: { messages: cachedMessages } })
    }
    const filter = {
        receiverId: userId
    };
    if (content) {
        filter.content = {
            $regex: content,
            $options: "i"
        };
    }
    const messages = await dbServic.find({
        model: messageModel,
        // populate: [{ path: "receiverId", select: "firstName lastName email receiverId -_id" }] ,
        filter,
        select: "-__v",
        skip,
        limit: limitNumber
    })


    const newCachedMessages = await redis.setex(`messages:${userId}`, 30, JSON.stringify(messages))

    return successResponse({ res, message: "All messages Feteched successfully ", data: { messages } })
}


export const favMessage = async (req, res, next) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await dbServic.findOne({
        model: messageModel,
        filter: { _id: messageId, receiverId: userId }
    });
    if (!message) {
        return next(new Error("Message not found / you are not the owner of this message"));
    }

    let fav = message.fav ? null : new Date()
    message.fav = fav;
    await message.save();

    return successResponse({ res, message: fav ? "Message favourited successfully " : "Message un-favourited successfully ", data: { message } })
}
