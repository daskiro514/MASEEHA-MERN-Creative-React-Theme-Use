const mongoose = require('mongoose');

const EmotionaudioSchema = new mongoose.Schema({
  title: {
    type: String
  },
  composername: {
    type: String
  },
  image: {
    type: String
  },
  audiofile: {
    type: String
  },
  duration: {
    type: Number
  },
  emotion_pack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'emotion_pack'
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'question'
  },
  answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'answer'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('emotion_audio', EmotionaudioSchema);