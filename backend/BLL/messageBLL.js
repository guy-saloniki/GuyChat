const asyncHandler = require('../middleware/asyncHandler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');

// Send message
// route - POST /api/messages/
// Private
const sendMessage = asyncHandler(async (req, res) => {
  // Store message
  const message = new Message(req.body);
  const savedMessage = await message.save();

  //update last message of chat
  await Chat.findOneAndUpdate(
    { _id: req.body.chat },
    { lastMessage: savedMessage._id, $inc: { unreadMessages: 1 } }
  );

  res.status(200).json(savedMessage);
});

// Get all messages of a chat
// route - GET /api/messages/:chatId
// Private
const getAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({
    chat: req.params.chatId,
  }).sort({ createdAt: 1 });
  res.status(200).json(messages);
});

module.exports = { sendMessage, getAllMessages };
