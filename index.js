const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors())

const PORT = process.env.PORT || 4000

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

const UserRoute = require('./routes/userRoute')
const TaskRoute = require('./routes/taskRoute')

app.use('/user', UserRoute)
app.use('/task', TaskRoute)

// const URL = 'mongodb://127.0.0.1:27017/todo' // local

const URL = 'mongodb+srv://sonas:sona123%23@cluster0-x4ayx.mongodb.net/switchon?retryWrites=true&w=majority'// online
mongoose.connect(URL, { useNewUrlParser: true, useFindAndModify: false }, (err) => {
  if (err) {
    console.log('Error while Connecting!')
  } else {
    console.log('Connected to Mongo DB')
  }
})

app.get('/', function (req, res) {
  res.send('Welcome!')
})
app.listen(PORT, () => {
  console.log('Server Started on PORT ' + PORT)
})
