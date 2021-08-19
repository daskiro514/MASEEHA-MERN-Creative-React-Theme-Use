const mongoose = require('mongoose');

const MeditationaudioSchema = new mongoose.Schema({
  name: {
    type: String
  },
  author: {
    type: String
  },
  purpose: {
    type: String
  },
  description: {
    type: String
  },
  duration: {
    type: String
  },
  ratings: [
    {
      type: Number,
    }
  ],
  listen_counts: {
    type: Number,
    default: 0
  },
  tags: [  
    {
      type: String
    }
  ],
  featured: {
    type: Boolean
  },
  type: {
    type: String
  },
  price: {
    type: Number
  },
  status: {
    type: Boolean
  },
  audiofile: {
    type: String
  },
  // emotion_pack: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'emotion_pack'
  // },
  thumbimage: {
    type: String
  },
  image: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('meditation_audio', MeditationaudioSchema);