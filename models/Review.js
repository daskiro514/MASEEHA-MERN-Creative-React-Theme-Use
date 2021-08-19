const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String
  },
  status: {
    type: Boolean
  },
  meditation_audio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'meditation_audio'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('review', ReviewSchema);
