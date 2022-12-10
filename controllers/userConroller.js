const fs = require('fs');

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

// handlers / controllers:
exports.createUser = (req, res) => {
  // 500 means internal server error:
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

exports.getAllUsers = (req, res) => {
  // 500 means internal server error:
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet defined',
  });
};

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
