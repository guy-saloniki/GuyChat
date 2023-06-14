const asyncHandler = require('../middleware/asyncHandler');
const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');

// Create new chat
// route - POST /api/chats/
// Private
const createChat = asyncHandler(async (req, res) => {
  const newChat = new Chat({ members: req.body });
  const savedChat = await newChat.save();

  //Populat members and last message in the saved chat
  await savedChat.populate('members');

  res.status(200).json(savedChat);
});

// Get all chats of current user
// route - GET /api/chats/
// Private
const getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({
    members: {
      $in: [req.user._id],
    },
  })
    .populate('members lastMessage')
    .sort({ updatedAt: -1 });

  res.status(200).json(chats);
});

// Get single chat
// route - GET /api/chats/:id
// Private
const getSingleChat = asyncHandler(async (req, res) => {
  const chat = await Chat.findById(req.params.id);

  if (!chat) {
    res.status('404');
    throw new Error('Chat not found');
  }
  res.status(200).json(chat);
});

// Clear all read messages
// route - POST /api/chats/:chatId/clear
// Private
const clearUnreadMessages = asyncHandler(async (req, res) => {
  //Find chat and update unread messages count to 0
  const chat = await Chat.findById(req.params.chatId);
  if (!chat) {
    res.status('404');
    throw new Error('Chat not found');
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    req.params.chatId,
    { unreadMessages: 0 },
    { new: true }
  );

  //Find all unread messages of this chat and update them to read
  await Message.updateMany(
    {
      chat: req.params.chatId,
      isRead: false,
    },
    { isRead: true }
  );

  res.status(200).json(updatedChat);
});
module.exports = {
  createChat,
  getAllChats,
  getSingleChat,
  clearUnreadMessages,
};
