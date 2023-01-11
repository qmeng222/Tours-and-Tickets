const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// handlers / controllers:
exports.createUser = (req, res, next) => {
  // 500 means internal server error:
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // send response:
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.getUser = (req, res) => {
  // 500 means internal server error:
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.updateUser = (req, res) => {
  // 500 means internal server error:
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.deleteUser = (req, res) => {
  // 500 means internal server error:
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

// for logged-in user only:
exports.updateMyData = catchAsync(async (req, res, next) => {
  // 1) raise error if user POSTs password:
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // filter out unwanted fields that are not allowed to be updated:
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) update user document (name and/or email), update role to "admin" is not allowed:
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
