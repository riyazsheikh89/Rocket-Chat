const asyncHandler = require("express-async-handler");
const User = require("../models/user-model");
const Chat = require("../models/chat-model");


// Access one to one chat, if doesn't exist then creat single chat
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    
    //Find if there is a one to one chat exist or not
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
    .populate("users", "-password").populate("lastMessage");

    // if the chat exists
    if (isChat.length > 0) {
        let isChat2 = await User.populate(isChat, {
          path: "lastMessage.sender",
          select: "name email image",
        });
        res.send(isChat[0]);
    } 
    else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const newChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password");
            res.status(200).send(fullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});


// Fetch all the chats for a user
const fetchChats = asyncHandler(async(req, res) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: {$eq: req.user._id} } })
            .populate("users", "-password")
            .populate("admin", "-password")
            .populate("lastMessage")
            .sort({ updatedAt: -1 });

        chats = await User.populate(chats, {
            path: "lastMessage.sender",
            select: "name pic email"
        });
        res.status(200).send(chats);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


// Create a Group Chat
const createGroupChat = asyncHandler(async(req, res) => {
    if (!req.body.users || req.body.chatName) {
        return res.status(400).send({message: "Provide all information"});
    }
    //parse the users, as it is coming as stringyfy from frontend
    let users = JSON.parse(req.body.users);
    users.push(req.user);   // add the Loged-in user itself

    if (users.length < 3) {
        return res.status(400).send({
            message: "Atleast 3 users are required to create a Group Chat"
        });
    }
    try {
        const newGroupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            admin: req.user
        });
        // Populate the group info
        const groupInfo = await Chat.findOne({ _id: newGroupChat._id })
            .populate("users", "-password")
            .populate("admin", "-password");
        res.status(200).json(groupInfo);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


// Rename a Group
const renameGroup = asyncHandler(async(req, res) => {
    const { chatId, chatName } = req.body;
    const chat = await Chat.findByIdAndUpdate(chatId, {chatName}, {new: true})
        .populate("users", "-password")
        .populate("admin", "-password");
    
    if (!chat) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json({
            success: true,
            message: "successfully updated group name",
            err: {},
            chat,
        });
    }
});


// Add new user to group
const addToGroup = asyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;
    const updatedGroup = await Chat.findByIdAndUpdate(chatId, 
        {$push: {users: userId} },
        {new: true})
        .populate("users", "-password")
        .populate("admin", "-password");
    
    if (!updatedGroup) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json({
            success: true,
            message: "successfully added user into the group",
            err: {},
            updatedGroup,
        });
    }
});


// Remove a user from group
const removeFromGroup = asyncHandler(async(req, res) => {
    const { chatId, userId } = req.body;
    const updatedGroup = await Chat.findByIdAndUpdate(chatId, 
        {$pull: {users: userId} },
        {new: true})
        .populate("users", "-password")
        .populate("admin", "-password");
    
    if (!updatedGroup) {
        res.status(404);
        throw new Error("Chat not found");
    } else {
        res.status(200).json({
            success: true,
            message: "successfully removed user from the group",
            err: {},
            updatedGroup,
        });
    }
});


module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
};
