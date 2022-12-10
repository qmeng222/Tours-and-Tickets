// import modules:
const express = require('express');
const tourController = require('./../controllers/tourController');

// creates new router object:
const router = express.Router();

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
