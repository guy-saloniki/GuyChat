const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsersList,
  logoutUser,
} = require('../BLL/userBLL');
const protect = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(protect, logoutUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/userlist').get(protect, getUsersList);

module.exports = router;
