const mongoose = require('mongoose')

const modelExample = mongoose.model(
  'example',
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  })
)

module.exports = modelExample
