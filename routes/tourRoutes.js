// import modules:
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// creates new router object:
const router = express.Router();

// nested routes: eg, POST /tours/123456abcdef/reviews
// NOTE: tourRouter was already mounted on tours
router.use('/:tourId/reviews', reviewRouter);

// // if there's no id in the route, this middleware will be ignored and move on to the next middleware:
// router.param('id', tourController.checkID);

// always place the 'specific paths' at the top of your code, and the 'general paths' at the very end
// therefore as soon as someone hits the top-5-cheap route, the first middleware that's gonna be run is aliasTopTours
router
  .route('/top-rated')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'), // exclude 'user'
  tourController.getMonthlyPlan
);

// geospatial queries: find tours within radius:
// eg: /tours-within/233/center/-40,45/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

// geospatial aggreagation: calculate the distance from a certain point to all the tours：
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('lead-guide', 'admin'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('lead-guide', 'admin'),
    tourController.deleteTour
  );

// assign the router obj to exports:
module.exports = router;
