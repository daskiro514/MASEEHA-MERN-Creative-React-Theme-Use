const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

// Connect Database
connectDB()

// Init Middleware
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(express.json())
app.use(cors())
app.use('/filepath/', express.static('files'))
app.use('/image-in-csv/', express.static('uploads/images'))
app.use('/eAudio-in-csv/', express.static('uploads/emotionaudios'))
app.use('/mAudio-in-csv/', express.static('uploads/meditationaudios'))
// Define Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/emotion_packs', require('./routes/api/emotionpacks'))
app.use('/api/questions', require('./routes/api/questions'))
app.use('/api/emotionaudio', require('./routes/api/emotionaudio'))
app.use('/api/meditationaudio', require('./routes/api/meditationaudio'))
app.use('/api/splash', require('./routes/api/splashes'))
app.use('/api/review', require('./routes/api/reviews'))

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
