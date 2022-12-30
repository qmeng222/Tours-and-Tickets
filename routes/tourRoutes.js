// import modules:
const express = require('express');
const tourController = require('../controllers/tourController');

// creates new router object:
const router = express.Router();

// // if there's no id in the route, this middleware will be ignored and move on to the next middleware:
// router.param('id', tourController.checkID);

// always place the 'specific paths' at the top of your code, and the 'general paths' at the very end
// therefore as soon as someone hits the top-5-cheap route, the first middleware that's gonna be run is aliasTopTours
router
  .route('/top-rated')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  // .post(tourController.checkBody, tourController.createTour) // checkBody first before creating tour
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// assign the router obj to exports:
module.exports = router;
