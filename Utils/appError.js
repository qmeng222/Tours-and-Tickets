// let all AppError objects inherit from the built-in error:
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // call the parent class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // operational errors

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
