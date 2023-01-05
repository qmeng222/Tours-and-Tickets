const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // only send operational error messages to the client:
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // for programming or other errors, don't leak error details to the client:
    // 1. log the error to the console:
    console.error('ERROR 💥', err);

    // 2. send a generic error message:
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log('👉', err.stack);
  err.statusCode = err.statusCode || 500; // 500: internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // error.name = err.name;
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(error, res);
  }
};
