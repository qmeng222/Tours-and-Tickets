const Tour = require('../models/tourModel');

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

// handlers / controllers:
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
    // make a deep copty so that there is no reflection on the original object when the changes are made in the copied object:
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log('👉', req.query, queryObj);
    // { difficulty: 'easy', page: '2', sort: '1', limit: '10' } { difficulty: 'easy' }

    // console.log(req.requestTime);

    // // method 1 - get/filter selected tours from the database:
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // // method 2 - filter using Mongoose methods:
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // method 3 - build a query & execute a query:
    const query = Tour.find(queryObj); // build
    const tours = await query; // execute

    // send response:
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: tours.length,
      data: { tours: tours },
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
