// import modules:
const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

// creates new router object:
const router = express.Router();

// // if there's no id in the route, this middleware will be ignored and move on to the next middleware:
// router.param('id', tourController.checkID);

// always place the 'specific paths' at the top of your code, and the 'general paths' at the very end
// therefore as soon as someone hits the top-5-cheap route, the first middleware that's gonna be run is aliasTopTours
router
  .route('/top-rated')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// assign the router obj to exports:
module.exports = router;
