const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewControlller');

const router = express.Router({ mergeParams: true });
// eg: mergeParams to get tourId for POST /tours/123456abcdef/reviews

router.route('/').get(reviewController.getAllReviews).post(
  authController.protect, // (protect route) only authenticated user can create review
  authController.restrictTo('user'), // restrict route to users only
  reviewController.createReview
);

router.route('/:id').delete(reviewController.deleteReview);

module.exports = router;
