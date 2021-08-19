const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mime = require('mime');
const fs = require('fs')
const Splash = require('../../models/Splash');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  limits: {
    fileSize: 100000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(mp4|MP4)$/)) {
      return cb(
        new Error(
          'only upload files with mp4, MP4 format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

router.get('/', async (req, res) => {
  const result = await Splash.find().sort({ date: 1 });
  res.json(result);
});

router.post('/add', upload.fields([{ name: 'video', maxCount: 1 }]), async (req, res) => {
  let video = req.files["video"][0].filename;
  let newSplash = new Splash({
    week: req.body.week,
    video: video,
    status: req.body.status,
  });
  await newSplash.save();
  res.json("ok");
})

router.post('/update', upload.fields([{ name: 'video', maxCount: 1 }]), async (req, res) => {
  let filter = { _id: req.body._id };
  let video = req.files["video"] ? req.files["video"][0].filename : undefined;
  let update = {
    week: req.body.week,
    status: req.body.status,
  }
  if (video) update.video = video
  await Splash.findOneAndUpdate(filter, update);
  res.json("ok");
})

router.delete('/:id', async (req, res) => {
  await Splash.remove({ _id: req.params.id });
  res.json("ok");
})

module.exports = router;
