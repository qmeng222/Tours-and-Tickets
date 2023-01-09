const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = (id) => {
  // tocken = payload + secret:
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  // 201 (successfully createed):
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. check if both email and password are provided:
  if (!email || !password) {
    return next(new AppError('Please provide both email and passoword.', 400)); // 400: bad req
  }

  // 2. check if user account exists & pw is correct:
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401)); // 401: unauthorized
  }

  // 3. if everythign is ok, send token to client:
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
