const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  answer: {
    type: String
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'question'
  },
  explaination: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('answer', AnswerSchema);
