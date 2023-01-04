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
    res.status(500).json({
      // 1. log the error to the console:
      // console.error('ERROR 💥', err);
      // 2. send a generic error message:
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log('👉', err.stack);
  err.statusCode = err.statusCode || 500; // 500: internal server error
  res.status = res.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
