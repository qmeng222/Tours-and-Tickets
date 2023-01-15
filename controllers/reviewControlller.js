const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.setTourUserIds = (req, res, next) => {
  // allow nested routes:
  // if didn't specify the tour ID:
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // if didn't specify the user:
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {}; // {} for finding all reviews (wo/ a filter)
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  // 200: ok
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }, // {reviews: reviews}
  });
});
