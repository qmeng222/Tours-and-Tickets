const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// generalization: the Model below could be Tour, User, Review, ...
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
