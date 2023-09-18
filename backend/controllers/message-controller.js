const asyncHandler = require('express-async-handler');
const Message = require('../models/message-model');
const Chat = require("../models/chat-model");
const User = require('../models/user-model');

// Send message to group or single chat
const sendMessage = asyncHandler(async (req, res) => {
    const {content, chatId} = req.body;

    if (!content || !chatId)
        res.status(400).send("Invalid Parameters!");

    const newMessage = {
        sender: req.user._id,
        chat: chatId,
        content: content
    };

    try {
        let message = await Message.create(newMessage);
        message = await message.populate("sender", "name image");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name email image"
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            lastMessage: message,
        });
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


// Fetch all messages of a particular chatId (singl chat / group chat)
const getMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({chat: req.params.chatId})
            .populate('sender', 'name email image')
            .populate('chat');
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})


module.exports = {
    sendMessage,
    getMessages
}