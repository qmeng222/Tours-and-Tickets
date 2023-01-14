// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

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
  // in query middleware, this always points to the current query:
  this.populate({
    path: 'tour', // populate the tour field with the referenced tour
    select: 'name', // only show tour name
  }).populate({
    path: 'user', // populate the tour field with the referenced tour
    select: 'name photo', // protect privacy, only show user name and photo
  });
  next();
});

// create model out of schema:
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
