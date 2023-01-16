// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  // options: virtual properties (fields not stored in DB) also show up in Json and object outputs:
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour', // populate the tour field with the referenced tour
  //   select: 'name', // only show tour name
  // }).populate({
  //   path: 'user', // populate the tour field with the referenced tour
  //   select: 'name photo', // protect privacy, only show user name and photo
  // });
  // next();

  // in query middleware, this always points to the current query:
  this.populate({
    path: 'user', // populate the tour field with the referenced tour
    select: 'name photo', // protect privacy, only show user name and photo
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // this points to the model:
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // add one for each review matched in the prev step
        avgRating: { $avg: '$rating' }, // calc ave from the rating field
      },
    },
  ]);

  // console.log(tourId);
  // console.log(stats); // [ { _id: 63c5ce3276faca1e0a90051c, nRating: 4, avgRating: 4.725 } ]

  // update the tour document with the new reviews created:
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating, // refer to console.log(stats)
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post('save', function () {
  // this points to current document (review)
  // constructor is to the model who created this document (the Review model)
  this.constructor.calcAverageRatings(this.tour); // the tourId this review is for
});

// create model out of schema:
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
