var mongoose = require('mongoose')
var Schema = mongoose.Schema

var category = new Schema({
  name: String
})

module.exports = mongoose.model('Category', category)
