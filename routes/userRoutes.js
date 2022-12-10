// import modules:
const express = require('express');
const userController = require('./../controllers/userConroller');

// creates new router object:
const router = express.Router();

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
