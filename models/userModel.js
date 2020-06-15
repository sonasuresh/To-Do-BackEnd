const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: String,
  mobile: Number,
  password: String,
  rating: {
    default: 0,
    type: Number
  },
  activeStatus: {
    default: false,
    type: Boolean
  },
  role: {
    default: 'USER',
    type: String

  }
})

module.exports = mongoose.model('User', UserSchema)
