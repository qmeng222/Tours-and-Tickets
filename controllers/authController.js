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

exports.protect = catchAsync(async (req, res, next) => {
  // 1. get the token and check if it's there:
  let token; // in ES6 variable declaratory, const and let are block scoped
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(new AppError('Please log in to get access.', 401));
  }
  // 2. verify the token:

  // 3. check if user still exists

  // 4. check if user changed password after the token was issued:

  next();
});
