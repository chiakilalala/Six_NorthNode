const mongoose = require('mongoose')

const modelExample = mongoose.model(
  'admin',
  new mongoose.Schema({
    name: {
      type: String,
      required: [true, '請輸入您的名字']
    },
    email: {
      type: String,
      required: [true, '請輸入您的 Email'],
      unique: true,
      lowercase: true
      // select: false
    },
    password: {
      type: String,
      required: [true, '請輸入密碼'],
      minlength: 8,
      select: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    }

  }, { versionKey: false })
)

module.exports = modelExample
