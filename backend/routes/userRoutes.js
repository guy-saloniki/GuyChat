const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../BLL/userBLL');
const protect = require('../middleware/authMiddleware');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/profile').get(protect, getUserProfile);

module.exports = router;
