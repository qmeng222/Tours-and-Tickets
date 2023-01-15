const Tour = require('../models/tourModel');
const APIfeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// // checkID middleware:
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id is ${val}.`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// // checkBody middleware:
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price or both in the body',
//     });
//   }
//   next();
// };

// alias middleware:
exports.aliasTopTours = (req, res, next) => {
  // prefilling the query string for the user, so that the user doesn't have to do it on his own:
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,-ratingsQuantity';
  req.query.fields =
    'name,price,ratingsAverage,ratingsQuantity,summary,difficulty';
  next();
};

// handlers/controllers:
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  //  201 means created:
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.getAllTours = catchAsync(async (req, res, next) => {
  // execute query & chain the methods:
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // send response:
  res.status(200).json({
    status: 'success',
    // requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // console.log(req.params);
  // // 👆get {id: '5', x: '23', y: undefined} for '/api/v1/tours/:id/:x:y?'
  // const id = req.params.id * 1; // str --> num
  // const tour = tours.find((el) => el.id === id);
  // const tour = await Tour.findOne({_id: req.params.id});
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No tour was found with that ID.', 404)); // return immediately without moving on to the next line
  }

  res.status(200).json({
    status: 'success',
    data: { tour }, // { tour: tour }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    // new: bool - true to return the modified document rather than the original; defaults to false:
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour was found with that ID.', 404)); // return immediately without moving on to the next line
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour was found with that ID.', 404)); // return immediately without moving on to the next line
//   }

//   // show that the deleted resource no longer exists, 204 means no content:
//   res.status(204).json({
//     status: 'success',
//     // it is a common practice not to send back any data to the client when there was a delete operation:
//     data: null,
//   });
// });
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        numRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // 1 for ascending
    },
    // { $match: { _id: { $ne: 'EASY' } } }, // _id was set as difficulty; ne --> not equal
  ]);
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, // [...tours]
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } }, // set _id to 0, so the _id no longer shows up; otherwise set to 1 to show up
    { $sort: { month: 1 } }, // 1 --> asc, -1 --> des
    // { $sort: { numTourStarts: -1 } },
    { $limit: 12 },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
