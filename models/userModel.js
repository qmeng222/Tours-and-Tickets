const mongoose = require('mongoose');
const validator = require('validator');

// create schema:
const userSchema = new mongoose.Schema({
  name: {
    type: Sring,
    required: [true, 'Please tell us your name.'],
  },

  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 8,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
});

// create model out of schema:
const User = mongoose.model('User', userSchema);

module.exports = User;
