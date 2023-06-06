const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');

// Register user
// route - POST /api/users/register
// Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check if email already exists
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error('Email already exists');
  }

  //create new user
  const user = await User.create({ name, email, password });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }
  generateToken(res, user._id);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email });
});

// Login user && get token
// route - POST /api/users/login
// Public
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(404);
    throw new Error('Invalid email or password');
  }
  generateToken(res, user._id);
  res.status(200).json({ _id: user._id, name: user.name, email: user.email });
});

// Get user profile
// route - GET /api/users/profile
// Private
const getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ _id: user._id, name: user.name, email: user.email });
});

module.exports = { registerUser, loginUser, getUserProfile };
