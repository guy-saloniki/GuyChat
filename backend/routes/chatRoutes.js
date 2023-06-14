const express = require('express');
const router = express.Router();

const {
  createChat,
  getAllChats,
  getSingleChat,
  clearUnreadMessages,
} = require('../BLL/chatBLL');
const protect = require('../middleware/authMiddleware');

router.route('/').post(protect, createChat).get(protect, getAllChats);
router.route('/:chatId/clear').post(protect, clearUnreadMessages);
router.route('/:id').get(protect, getSingleChat);

module.exports = router;
