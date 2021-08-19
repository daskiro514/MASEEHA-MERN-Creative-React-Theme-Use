const mongoose = require('mongoose');

const EmotionpackSchema = new mongoose.Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
  price: {
    type: Number
  },
  thumbimage: {
    type: String
  },
  image: {
    type: String
  },
  description: {
    type: String,
  },
  status: {
    type: Boolean
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('emotion_pack', EmotionpackSchema);