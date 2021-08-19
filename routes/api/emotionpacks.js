const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const mime = require('mime');
const fs = require('fs')
const EmotionPack = require('../../models/Emotionpack');

router.get('/', async (req, res) => {
  const emotion_packs = await EmotionPack.find().sort({ date: 1 });
  res.json(emotion_packs);
});

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files');
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    }
  }),
  limits: {
    fileSize: 1000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|JPG|PNG|png|pdf|doc|docx|xlsx|xls)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      );
    }
    cb(undefined, true); // continue with upload
  }
});

router.post('/add', upload.fields([{ name: 'thumbimage', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  let thumbImageFileName = req.files["thumbimage"][0].filename;
  let imageFileName = req.files["image"][0].filename;
  let newEmotionPack = new EmotionPack({
    name: req.body.name,
    type: req.body.type,
    price: Number(req.body.price),
    description: req.body.description,
    thumbimage: thumbImageFileName,
    image: imageFileName,
    status: req.body.status,
  });
  await newEmotionPack.save();
  res.json(await EmotionPack.find().sort({ date: 1 }));
})

router.post('/update', upload.fields([{ name: 'thumbimage', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  let filter = { _id: req.body._id }
  let thumbImageFileName = req.files["thumbimage"] ? req.files["thumbimage"][0].filename : undefined;
  let imageFileName = req.files["image"] ? req.files["image"][0].filename : undefined;
  let update = {
    name: req.body.name,
    type: req.body.type,
    price: Number(req.body.price),
    description: req.body.description,
    status: req.body.status,
  };
  if (thumbImageFileName) update.thumbimage = thumbImageFileName;
  if (imageFileName) update.image = imageFileName;
  await EmotionPack.findOneAndUpdate(filter, update);
  res.json(await EmotionPack.find().sort({ date: 1 }));
})

router.delete('/:id', async (req, res) => {
  await EmotionPack.remove({ _id: req.params.id });
  res.json(await EmotionPack.find().sort({ date: 1 }));
})

module.exports = router;
