const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const mime = require('mime')
const fs = require('fs')
const request = require('request')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const EmotionAudio = require('../../models/Emotionaudio')
const EmotioinPack = require('../../models/Emotionpack')
const Question = require('../../models/Question')
const Answer = require('../../models/Answer')
const { dirname } = require('path')
const Emotionpack = require('../../models/Emotionpack')

router.get('/', async (req, res) => {
  res.json(await EmotionAudio.find().populate('emotion_pack').populate('question').populate('answer').sort({ date: 1 }))
})

router.post('/matched', async (req, res) => {
  let result = await EmotionAudio.findOne({
    $and: [
      { emotion_pack: req.body.emotionPack_id },
      { question: req.body.question_id },
      { answer: req.body.answer_id }
    ]
  })
  if (result === null) {
    console.log(req.body)
    result = await EmotionAudio.findOne({
      $and: [
        { emotion_pack: req.body.emotionPack_id },
        { question: req.body.question_id },
      ]
    })
    console.log(result)
  }
  res.json(result)
})

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

const download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    // console.log('content-type:', res.headers['content-type'])
    // console.log('content-length:', res.headers['content-length'])
    request(uri).pipe(fs.createWriteStream(path.join("./files/", filename))).on('close', callback)
  })
}

router.post('/add', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audiofile', maxCount: 1 }]), async (req, res) => {
  let image = req.files["image"] ? req.files["image"][0].filename : undefined
  let audiofile = req.files["audiofile"][0].filename
  let duration = await getAudioDurationInSeconds('./files/' + audiofile)
  duration = Math.floor(duration)
  let question = undefined
  let answer = undefined
  if (req.body.question) question = req.body.question
  if (req.body.answer) answer = req.body.answer
  let newEmotionAudio = new EmotionAudio({
    title: req.body.title,
    composername: req.body.composername,
    duration: duration,
    emotion_pack: req.body.emotion_pack,
    question: question,
    answer: answer,
    audiofile: audiofile
  })
  if (image) newEmotionAudio.image = image
  await newEmotionAudio.save()
  res.json(await EmotionAudio.find().populate('emotion_pack').populate('question').populate('answer').sort({ date: 1 }))
})

router.post('/update', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audiofile', maxCount: 1 }]), async (req, res) => {
  let filter = { _id: req.body._id }
  let image = req.files["image"] ? req.files["image"][0].filename : undefined
  let audiofile = req.files["audiofile"] ? req.files["audiofile"][0].filename : undefined
  let question = undefined
  let answer = undefined
  if (req.body.question) question = req.body.question
  if (req.body.answer) answer = req.body.answer
  let update = {
    title: req.body.title,
    composername: req.body.composername,
    emotion_pack: req.body.emotion_pack,
    question: question,
    answer: answer,
  }
  if (image) update.image = image
  if (audiofile) {
    update.audiofile = audiofile
    let duration = await getAudioDurationInSeconds('./files/' + audiofile)
    duration = Math.floor(duration)
    update.duration = duration
  }
  await EmotionAudio.findOneAndUpdate(filter, update)
  res.json(await EmotionAudio.find().populate('emotion_pack').populate('question').populate('answer').sort({ date: 1 }))
})

router.delete('/:id', async (req, res) => {
  await EmotionAudio.remove({ _id: req.params.id })
  res.json(await EmotionAudio.find().populate('emotion_pack').populate('question').populate('answer').sort({ date: 1 }))
})

router.post('/csv', async (req, res) => {
  if (req.body.image) download(req.body.imagePath, req.body.image, function () {})
  download(req.body.audioPath, req.body.audiofile, function () {})
  let duration = await getAudioDurationInSeconds('./files/' + req.body.audiofile)
  duration = Math.floor(duration)
  emotionPackID = (await EmotioinPack.findOne({name: req.body.emotionpackContent}))._id
  let newEmotionAudio = new EmotionAudio({
    title: req.body.title,
    composername: req.body.composername,
    duration: duration,
    emotion_pack: emotionPackID,
    audiofile: req.body.audiofile
  })
  if (req.body.image) newEmotionAudio.image = req.body.image
  if (req.body.questionContent) newEmotionAudio.question = (await Question.findOne({question: req.body.questionContent}))._id
  if (req.body.answerContent) newEmotionAudio.answer = (await Answer.findOne({answer: req.body.answerContent}))._id
  await newEmotionAudio.save()
  res.json("ok")
})

module.exports = router
