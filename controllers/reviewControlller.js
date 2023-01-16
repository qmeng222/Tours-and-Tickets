const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.createReview = factory.createOne(Review);
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
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
