const express = require('express');
const router = express.Router();
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');

router.get('/', async (req, res) => {
  const result = await Question.find().populate('emotionpack').populate('answers').populate('parent').populate('parent_answer').sort({ date: 1 });
  res.json(result);
});

router.post('/ancestor', async (req, res) => {
  const result = await Question.findOne({ $and: [{ serial_number: 1 }, { emotionpack: req.body.emotionPack_id }] }).populate('answers')
  res.json(result)
})

router.post('/question_answer', async (req, res) => {
  const result = await Question.findOne({
    $and: [
      { emotionpack: req.body.emotionPack_id },
      { parent: req.body.question_id },
      { parent_answer: req.body.answer_id }
    ]
  }).populate('answers')
  res.json(result)
})

router.post('/app/question_detail', async (req, res) => {
  const question = await Question.findOne({ _id: req.body.question }).populate('emotionpack').populate('answers')
  res.json(question)
})

router.post('/app/question_detail/next', async (req, res) => {
  const question = await Question.findOne({ parent: req.body.parent, parent_answer: req.body.parent_answer }).populate('emotionpack').populate('answers')
  res.json(question)
})

router.post('/add', async (req, res) => {
  let answerIDs = [];
  for (let i = 0; i < req.body.answers.length; i++) {
    let element = req.body.answers[i]
    let newAnswer = new Answer({
      answer: element.answer,
      explaination: element.explaination,
    })
    await newAnswer.save();
    answerIDs.push(newAnswer.id);
  }
  let emotionpack = req.body.category;
  if (!emotionpack) emotionpack = undefined;

  let newQuestion = new Question({
    serial_number: req.body.serial_number,
    question: req.body.question,
    type: req.body.type,
    emotionpack: emotionpack,
    answers: answerIDs,
    parent: req.body.parent,
    parent_answer: req.body.parent_answer
  });
  await newQuestion.save();
  res.json(await Question.find().populate('emotionpack').populate('answers').populate('parent').populate('parent_answer').sort({ date: 1 }));
})

router.post('/update', async (req, res) => {
  let filter = { _id: req.body._id }
  let targetQuestion = await Question.findOne(filter);
  if (targetQuestion.answers) {
    for (let i = 0; i < targetQuestion.answers.length; i++) {
      await Answer.remove({ _id: targetQuestion.answers[i] });
    }
  }

  let answerIDs = [];
  for (let i = 0; i < req.body.answers.length; i++) {
    let element = req.body.answers[i]
    let newAnswer = new Answer({
      answer: element.answer,
      explaination: element.explaination,
    })
    await newAnswer.save();
    answerIDs.push(newAnswer.id);
  }
  let emotionpack = req.body.emotionpack;
  if (!emotionpack) emotionpack = undefined;

  let update = {
    serial_number: req.body.serial_number,
    question: req.body.question,
    type: req.body.type,
    emotionpack: emotionpack,
    answers: answerIDs,
    parent: req.body.parent,
    parent_answer: req.body.parent_answer
  }
  await Question.findOneAndUpdate(filter, update);

  res.json(await Question.find().populate('emotionpack').populate('answers').populate('parent').populate('parent_answer').sort({ date: 1 }));
})

router.delete('/:id', async (req, res) => {
  await Question.remove({ _id: req.params.id });
  res.json(await Question.find().populate('emotionpack').populate('answers').populate('parent').populate('parent_answer').sort({ date: 1 }));
})

module.exports = router;
