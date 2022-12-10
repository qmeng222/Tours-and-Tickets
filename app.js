// import modules (require):
const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// middlewares (for all routes):
app.use(express.json()); // data from the body is added to the request object

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('Hello from the middleware👋');
  next(); // at the end of each middleware function, a next function is called
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mount routers on routes:
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
