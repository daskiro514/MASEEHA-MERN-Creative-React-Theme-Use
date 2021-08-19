const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
var nodemailer = require("nodemailer");
const Emotionpack = require('../../models/Emotionpack');

var smtpTransport = nodemailer.createTransport({
  // service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: config.MAIL_USER,
      pass: config.MAIL_PASS
  }
});

router.get('/', async (req, res) => {
  const result = await User.find().populate('emotion_packs').sort({ date: 1 });
  res.json(result);
});

router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, location } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      user = new User({
        name,
        email,
        avatar,
        password,
        location
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/forgotpassword', async (req, res) => {
  let user = await User.findOne({'email': req.body.email});
  let response = {
    type: "info",
    content: "This account does not exist. Please check and try again."
  }
  if (user) {
    response.content = 'We sent you an email. Please check your inbox for password reset link.'
    var notificationContent = {
      from: 'Mesiah<test@test.com>',
      to : req.body.email,
      subject : "Reset Password",
      html : `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Mesiah Reset Password</title></head><body><div>We received your Reset Password Request.Please check the link below to reset your password on this account.</div><div><a href="http://localhost:8080/pswdreset/${user._id}">RESET PASSWORD</a></div></body></html>`
    }
    console.log(notificationContent)
  } else {
    response.type = "warning"
  }
  res.json(response)
})

router.post('/add', async (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    location: req.body.location,
    emotion_packs: req.body.emotion_packs
  });
  await newUser.save();
  res.json("ok");
})

router.post('/app/buy_emotionpack', async (req, res) => {
  let filter = { _id: req.body.user }
  let emotionPack = await Emotionpack.findOne({name: req.body.emotionPack})
  let emotionPackArray = []
  let user = await User.findOne({_id: req.body.user})
  user.emotion_packs.forEach(element => {
    emotionPackArray.push(element)
  });
  emotionPackArray.push(emotionPack._id) 
  let update = {emotion_packs: emotionPackArray}
  let doc = await User.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true // Make this update into an upsert
  });
  res.json(doc)
})

router.delete('/:id', async (req, res) => {
  await User.remove({ _id: req.params.id });
  res.json("ok");
})

module.exports = router;
