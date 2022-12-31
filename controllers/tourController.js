const Tour = require('../models/tourModel');
const APIfeatures = require('../Utils/apiFeatures');

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
exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();

    const newTour = await Tour.create(req.body);

    //  201 means created:
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // 400 stands for bad request:
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // console.log(req.params);
    // // 👆get {id: '5', x: '23', y: undefined} for '/api/v1/tours/:id/:x:y?'
    // const id = req.params.id * 1; // str --> num
    // const tour = tours.find((el) => el.id === id);
    // const tour = await Tour.findOne({_id: req.params.id});
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: { tours: tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // new: bool - true to return the modified document rather than the original, defaults to false:
      new: true,
      // runValidators: bool - if true, runs update validators on this command. Update validators validate the update operation against the model's schema:
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    // show that the deleted resource no longer exists, 204 means no content:
    res.status(204).json({
      status: 'success',
      // it is a common practice not to send back any data to the client when there was a delete operation:
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
