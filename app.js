// import modules (require):
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug'); // tell Express what template engine I'm going to use
app.set('views', path.join(__dirname, 'views'));

// GLOBAL MIDDLEWARES:
// app.use(express.static(`${__dirname}/public`)); // serving static files
app.use(express.static(path.join(__dirname, 'public'))); // serving static files

// set security HTTP headers:
app.use(helmet());

// process.env is the global environment variables:
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // req logger: GET /api/v1/tours 200 7.416 ms - 8681
}

// limit brute force attacks from the same IP:
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 1 hour --> ms
  message: 'Too many request from this IP. Please try again in an hour.', // 429: too many requests
});

app.use('/api', limiter); // apply to all routes that start with /api

// body parser, reading data from body into req.body:
app.use(express.json({ limit: '10kb' })); // data from the body is added to the request object

// data sanitization against NoSQL query injection:
app.use(mongoSanitize());

// data sanitization against XSS:
app.use(xss());

// prevent HTTP Parameter Pollution (HPP):
// eg: GET {{URL}}api/v1/tours?sort=duration&sort=price -> {{URL}}api/v1/tours?sort=price
app.use(
  hpp({
    whitelist: [
      'duration', // eg: GET {{URL}}api/v1/tours?duration=5&duration=9 --> duration = 5 || 9
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// test middleware:
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// mount routers on routes:
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Express assumes whatever we pass into next be an error
});

app.use(globalErrorHandler);

module.exports = app;
