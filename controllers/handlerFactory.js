const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIfeatures = require('../utils/apiFeatures');

// generalization: the Model below could be Tour, User, Review, ...
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    //  201 means created:
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // for nested GET reviews of a tour:
    let filter = {}; // {} for finding all reviews (wo/ a filter)
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // execute query & chain the methods:
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    // send response:
    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestTime,
      results: docs.length,
      data: { data: docs },
    });
  });

// pop means populate:
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // eg: const tour = await Tour.findById(req.params.id).populate('reviews');
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document was found with that ID.', 404)); // return immediately without moving on to the next line
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc }, // { tour: tour }
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      // new: bool - true to return the modified document rather than the original; defaults to false:
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document was found with that ID.', 404)); // return immediately without moving on to the next line
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

// Note: only admin has permission to delete
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document was found with that ID.', 404)); // return immediately without moving on to the next line
    }

    // show that the deleted resource no longer exists, 204 means no content:
    res.status(204).json({
      status: 'success',
      // null means deleted
      data: null,
    });
  });
