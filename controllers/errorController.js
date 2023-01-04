module.exports = (err, req, res, next) => {
  // console.log('👉', err.stack);
  err.statusCode = err.statusCode || 500; // 500: internal server error
  res.status = res.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
