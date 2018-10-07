var mongoose = require('mongoose')
var Schema = mongoose.Schema

var article = new Schema({
  title: String,
  category: String,
  author: String,
  sapo: String,
  content: String,
  image: String,
  imagesEditor: [],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  comments: [{ id: String, date: Date, username: String, comment: String }],
  meta: {
    votes: Number,
    favs: Number
  }
})

module.exports = mongoose.model('Article', article)
