// import modules (require):
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// middlewares (for all routes):

// process.env is the global environment variables:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // req logger: GET /api/v1/tours 200 7.416 ms - 8681
}

app.use(express.json()); // data from the body is added to the request object
app.use(express.static(`${__dirname}/public`)); // serving static files

// app.use((req, res, next) => {
//   console.log('Hello from the middleware👋');
//   next(); // at the end of each middleware function, a next function is called
// });

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// mount routers on routes: middleware is added to the middleware stack in the order that it's defined
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Express assumes whatever we pass into next be an error
});

app.use(globalErrorHandler);

module.exports = app;
