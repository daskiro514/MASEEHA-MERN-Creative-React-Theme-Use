const express = require('express');
const router = express.Router();
const Review = require('../../models/Review');

router.get('/', async (req, res) => {
  const result = await Review.find().populate('meditation_audio').populate('user').sort({ date: 1 });
  res.json(result);
});

router.post('/add', async (req, res) => {
  let newReview = new Review({
    review: req.body.review,
    status: req.body.status,
    meditation_audio: req.body.meditation_audio,
    user: req.body.user,
  });
  await newReview.save();
  res.json("ok");
})

router.post('/update', async (req, res) => {
  let filter = { _id: req.body._id };
  let update = {
    review: req.body.review,
    status: req.body.status,
  }
  await Review.findOneAndUpdate(filter, update);
  res.json("ok");
})

router.delete('/:id', async (req, res) => {
  await Review.remove({ _id: req.params.id });
  res.json("ok");
})

module.exports = router;
