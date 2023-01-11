// import modules:
const express = require('express');
const userController = require('./../controllers/userConroller');
const authController = require('./../controllers/authController');

// creates new router object:
const router = express.Router();

// app.METHOD(path, callback [, callback ...])
// .post() method to handle POST requests:
router.post('/signup', authController.signup);
// .post() method to send in the login credentials:
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

router.patch(
  '/updateMyData',
  authController.protect,
  userController.updateMyData
);

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
