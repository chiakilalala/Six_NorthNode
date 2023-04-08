const mongoose = require('mongoose')

const {{ camelCase name}} = mongoose.model(
  'example',
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })
)

module.exports = {{ camelCase name}} 
