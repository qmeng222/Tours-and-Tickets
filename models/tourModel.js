const mongoose = require('mongoose');
const slugify = require('slugify');

// create schema:
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      trim: true,
      maxlength: [50, 'A tour must have less or equal than 40 characters.'],
      minlength: [10, 'A tour must have more or equal than 10 characters.'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration.'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size.'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty.'],
      // the enum validator: check if the value given is in the array or not, if the value is not in the array, Mongoose will throw a ValidationError
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, or medium, or difficult.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.'],
      max: [5, 'Rating must be below 5.'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary.'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image.'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// duration days --> weeks
tourSchema.virtual('durationWeekds').get(function () {
  return this.duration / 7;
});

// pre document middleware: function execute before Mongoose .save() / .create() method
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // in document middleware, "this" object points to the current document
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('will save document...');
//   next();
// });

// // post document middleware:
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// pre query middleware: find nonsecret tours
// for all the strings that start with the name 'find' ('find', 'findOne', 'findOneAndUpdate', 'findOneAndDelete' ...):
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // bc the editors are not currently set to false
  this.start = Date.now(); // in query middleware, this object points to the current query
  next();
});

// post query middleware:
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs); // [...tours]
  next();
});

// pre aggregate middleware: exclude the secret tours in the aggregation
tourSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline()); // in aggregate middleware, "this" object points to the current aggregation object
  // // [{'$match': {...}}, {'$group': {...}}, {'$sort': {...}}]
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
