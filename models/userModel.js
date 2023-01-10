const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// create schema:
const userSchema = new mongoose.Schema({
  name: {
    type: String,
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
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },

  passwordChangedAt: Date,
});

// pre document middleware: function execute before Mongoose .save() / .create() method
userSchema.pre('save', async function (next) {
  // this referes to the current document:
  // if the password has not been modified, just exit this function and call the next middleware:
  if (!this.isModified('password')) return next();

  // hash means encryption; 12 is the a cost parameter. The higher the cost is, the better the password will be encrypted:
  this.password = await bcrypt.hash(this.password, 12);

  // after validation, delete the passwordConfirm. passwordConfirm is a required input, but not required to persist in databse:
  this.passwordConfirm = undefined;
  next();
});

// instance methods:
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // ms --> s, 10: base 10 number

    // console.log('✅', this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
  return false; // false means pw not changed
};

// create model out of schema:
const User = mongoose.model('User', userSchema);

module.exports = User;
