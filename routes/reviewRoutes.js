const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewControlller');

const router = express.Router({ mergeParams: true });
// eg: mergeParams to get tourId for POST /tours/123456abcdef/reviews

router.use(authController.protect);
////////////// all middlewares come after this one are now protected //////////////

router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'), // restrict route to users only
  reviewController.setTourUserIds,
  reviewController.createReview
);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
