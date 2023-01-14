const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewControlller');

const router = express.Router();

router.route('/').get(reviewController.getAllReviews).post(
  authController.protect, // (protect route) only authenticated user can create review
  authController.restrictTo('user'), // restrict route to users only
  reviewController.createReview
);

module.exports = router;
