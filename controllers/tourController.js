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
      message: 'invalid data sent',
      // message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.requestTime);

    // get all tours from the database:
    const tours = await Tour.find();

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

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { tour: '<udated tour here...>' },
  });
};

exports.deleteTour = (req, res) => {
  // show that the deleted resource now no longer exists, 204 means no content:
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
