const mongoose = require('mongoose');

const SplashSchema = new mongoose.Schema({
  week: {
    type: Number,
    required: true,
    unique: true
  },
  video: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('splash', SplashSchema);
