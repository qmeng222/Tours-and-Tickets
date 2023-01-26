const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');
const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

// upload image files only:
const multerFilter = (req, file, cb) => {
  // console.log(req.file) --> {..., mimetype: 'image/jpeg', ...}
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// upload.single('image');
// upload.array('images', 3);
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

exports.resizeTourImages = (req, res, next) => {
  console.log(req.files);
  next();
};

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
exports.createTour = factory.createOne(Tour);
exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // path posts to the field to populate
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        // group by tour difficulty:
        _id: { $toUpper: '$difficulty' },
        // add one for each tour that we have:
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

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.111745,-118.113491/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // MongoDB expects the radius of our sphere to be in radians (arcLength = r * radian)
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; // Earth radius: 6378.1 km (or 3963.2 mi)

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }
  // console.log(distance, lat, lng, unit); // eg: 233 34.111745 -118.113491 mi

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; // m -> mi or km

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], // * 1 to conver to numbers
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier, // m to km
      },
    },
    // only show the name of the tours and distances (1 to show up, 0 to hide):
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
