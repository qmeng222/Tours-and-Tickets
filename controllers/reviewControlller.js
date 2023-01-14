const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  // 201: created
  res.status(201).json({
    status: 'success',
    data: { review: newReview },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  // 200: ok
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }, // {reviews: reviews}
  });
});
