const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  serial_number: {
    type: Number
  },
  question: {
    type: String
  },
  type: {
    type: String
  },
  emotionpack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'emotion_pack'
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'question'
  },
  parent_answer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'answer'
  },
  answers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'answer'
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('question', QuestionSchema);
