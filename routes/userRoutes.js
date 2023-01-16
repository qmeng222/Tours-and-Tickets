// import modules:
const express = require('express');
const userController = require('../controllers/userConroller');
const authController = require('../controllers/authController');

// creates new router object:
const router = express.Router();

// app.METHOD(path, callback [, callback ...])
router.post('/signup', authController.signup); // .post() method to handle POST requests
router.post('/login', authController.login); // .post() method to send in the login credentials
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
////////////// Authentication: all middlewares come after this one are now protected //////////////

router.patch('/updateMyPassword', authController.updatePassword);
router.get(
  '/me',
  userController.getMe, // get user id
  userController.getUser
);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));
////////////// Authorization: from this point on, all the routes are protected and restricted only to the admin //////////////

router
  .route('/')
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// assign the router obj to exports:
module.exports = router;
