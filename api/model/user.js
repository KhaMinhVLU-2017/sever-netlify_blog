var mongoose = require('mongoose')

var user = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: Number,
  hometown: String,
  live: String,
  birdthday: Date,
  gender: Boolean,
  skill: String,
  job: String,
  name: String,
  article: String,
  avatar: String
})
module.exports = mongoose.model('User', user)
