const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

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
