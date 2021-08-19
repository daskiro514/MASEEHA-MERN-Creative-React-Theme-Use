const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const mime = require('mime')
const fs = require('fs')
const request = require('request')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const MeditationAudio = require('../../models/Meditationaudio')

router.get('/', async (req, res) => {
  res.json(await MeditationAudio.find().sort({ date: 1 }))
})

router.post('/time_filtered', async (req, res) => {
  res.json((await MeditationAudio.find().sort({ date: 1 })).filter(element => element.duration < Number(req.body.time)))
})

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    // console.log('content-type:', res.headers['content-type'])
    // console.log('content-length:', res.headers['content-length'])
    request(uri).pipe(fs.createWriteStream(path.join("./files/", filename))).on('close', callback)
  })
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './files')
    },
    filename(req, file, cb) {
      // cb(null, `${new Date().getTime()}_${file.originalname}`)
      cb(null, file.originalname)
    }
  }),
  limits: {
    fileSize: 100000000 // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|JPG|PNG|png|mp3|MP3|AAC|aac|wav|WAV)$/)) {
      return cb(
        new Error(
          'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
        )
      )
    }
    cb(undefined, true) // continue with upload
  }
})

router.post('/add', upload.fields([{ name: 'audiofile', maxCount: 1 }, { name: 'thumbimage', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  let audiofile = req.files["audiofile"][0].filename
  let duration = await getAudioDurationInSeconds('./files/' + audiofile)
  duration = Math.floor(duration)
  let thumbImageFileName = req.files["thumbimage"] ? req.files["thumbimage"][0].filename : undefined
  let imageFileName = req.files["image"] ? req.files["image"][0].filename : undefined
  let newMeditationAudio = new MeditationAudio({
    name: req.body.name,
    author: req.body.author,
    purpose: req.body.purpose,
    description: req.body.description,
    duration: duration,
    avgrating: req.body.avgrating,
    tags: req.body.tags,
    featured: req.body.featured,
    type: req.body.type,
    price: 0,
    status: req.body.status,
    emotion_pack: req.body.emotion_pack,
    audiofile: audiofile,
  })
  if (req.body.type === "Paid") newMeditationAudio.price = req.body.price
  let tempTags = req.body.tags.split(",")
  newMeditationAudio.tags = tempTags
  if (thumbImageFileName) newMeditationAudio.thumbimage = thumbImageFileName
  if (imageFileName) newMeditationAudio.image = imageFileName
  await newMeditationAudio.save()
  res.json(await MeditationAudio.find().sort({ date: 1 }))
})

router.post('/update', upload.fields([{ name: 'audiofile', maxCount: 1 }, { name: 'thumbimage', maxCount: 1 }, { name: 'image', maxCount: 1 }]), async (req, res) => {
  let filter = { _id: req.body._id }
  let audiofile = req.files["audiofile"] ? req.files["audiofile"][0].filename : undefined
  let thumbImageFileName = req.files["thumbimage"] ? req.files["thumbimage"][0].filename : undefined
  let imageFileName = req.files["image"] ? req.files["image"][0].filename : undefined
  let update = {
    name: req.body.name,
    author: req.body.author,
    purpose: req.body.purpose,
    description: req.body.description,
    avgrating: req.body.avgrating,
    featured: req.body.featured,
    type: req.body.type,
    status: req.body.status,
    emotion_pack: req.body.emotion_pack,
  }
  if (req.body.type === "Paid") update.price = req.body.price
  else update.price = 0
  let tempTags = req.body.tags.split(",")
  update.tags = tempTags
  if (audiofile) {
    update.audiofile = audiofile
    let duration = await getAudioDurationInSeconds('./files/' + audiofile)
    duration = Math.floor(duration)
    update.duration = duration
  }
  if (thumbImageFileName) update.thumbimage = thumbImageFileName
  if (imageFileName) update.image = imageFileName
  await MeditationAudio.findOneAndUpdate(filter, update)
  res.json(await MeditationAudio.find().sort({ date: 1 }))
})

router.delete('/:id', async (req, res) => {
  await MeditationAudio.remove({ _id: req.params.id })
  res.json(await MeditationAudio.find().sort({ date: 1 }))
})

router.post('/csv', async (req, res) => {
  if (req.body.image) download(req.body.imagePath, req.body.image, function () {})
  if (req.body.thumbimage) download(req.body.thumbimagePath, req.body.thumbimage, function () {})
  download(req.body.audioPath, req.body.audiofile, function () {})
  let duration = await getAudioDurationInSeconds('./files/' + req.body.audiofile)
  duration = Math.floor(duration)
  let newMeditationAudio = new MeditationAudio({
    name: req.body.name,
    author: req.body.author,
    purpose: req.body.purpose,
    description: req.body.description,
    duration: duration,
    avgrating: req.body.avgrating,
    tags: req.body.tags,
    featured: req.body.featured,
    type: req.body.type,
    price: 0,
    status: req.body.status,
    emotion_pack: req.body.emotion_pack,
    audiofile: req.body.audiofile,
  })
  if (req.body.type === "Paid") newMeditationAudio.price = Number(req.body.price)
  let tempTags = req.body.tags.split(",")
  newMeditationAudio.tags = tempTags
  if (req.body.thumbimage) newMeditationAudio.thumbimage = req.body.thumbimage
  if (req.body.image) newMeditationAudio.image = req.body.image
  await newMeditationAudio.save()
  res.json("ok")
})

module.exports = router
