// import modules:
const express = require('express');
const tourController = require('./../controllers/tourController');

// creates new router object:
const router = express.Router();

// if there's no id in the route, this middleware will be ignored and move on to the following middleware:
router.param('id', tourController.checkID);

router
  .route('/')
  .post(tourController.createTour)
  .get(tourController.getAllTours);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// assign the router obj to exports:
module.exports = router;
