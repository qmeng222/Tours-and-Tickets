const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // const util = require('util'); destructure that object and take promisify directly from there
const sendEmail = require('../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  // tocken = payload + secret:
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // console.log('1️⃣', req.body);
  const newUser = await User.create({
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  // console.log('2️⃣', newUser);
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
  // console.log(token);
  if (!token) {
    return next(new AppError('Please log in to get access.', 401));
  }

  // 2. verify the token (valid and unexpired):
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // the decoded payload from the JSON web token
  // console.log(decoded); // { id: '63bb6a4abcdde573773ff530', iat: 1673226826, exp: 1681002826 }

  // 3. check if user still exists (eg: user deleted after signing up):
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4. check if user changed password after the token was issued:
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed the password. Please log in again.',
        401
      )
    );
  }

  req.user = currentUser;
  next(); // grant access to protected route
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['lead-guide', 'admin'], role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403) // 403: forbidden
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. get user's email:
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new AppError('There is no matching user with the email provided.', 404)
    ); // 404: not found

  // 2. generate random reset token:
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. send it to user's email:
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? No worries. Just submit a PATCH request with your new password and passwordConfirm to ${resetURL}.\nIf you didn't forgot your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    console.log("I'm here!!!");

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Please try again later!'
      ),
      500 // 500: internal server error
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. get user based on the token:
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token) // /resetPassword/:token
    .digest('hex');

  // find the user for the token:
  const user = await User.findOne({
    passwordResetToken: hashedToken, // token stored in DB is encrypted
    passwordResetExpires: { $gt: Date.now() }, // check token has not expired
  });

  // 2. if user exist AND token has not expired, set the new pw:
  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3. update changedPasswordAt property for that user:

  // 4. log the user in (send the JWT to the client):
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
