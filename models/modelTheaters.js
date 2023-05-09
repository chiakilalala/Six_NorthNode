const mongoose = require('mongoose')

const modelExample = mongoose.model(
  'theaters',
  new mongoose.Schema({
    type: {
      type: Number,
      required: [true, '廳院種類 未填寫'],
      enum: [0, 1], // 0:一般,1:豪華
      default: 0
    },
    seats: {
      type: Array,
      required: true,
      default: function () {
        if (this.type === 0) {
          // type 為 0 时，有 13 排，每排 10 个座位
          return [...Array(13)].map((_, i) => {
            return [...Array(10)].map((_, j) => {
              return `A${String.fromCharCode(65 + i)}${j + 1}`
            })
          })
        } else if (this.type === 1) {
          // type 為 1 时，有 15 排，每排 16 个座位
          return [...Array(15)].map((_, i) => {
            return [...Array(16)].map((_, j) => {
              return `A${String.fromCharCode(65 + i)}${j + 1}`
            })
          })
        }
      }
    },
    price: {
      type: Number,
      required: [true, '價錢 未填寫']
    },
    createTime: {
      type: Date,
      default: Date.now,
      required: true,
      select: false
    }
  }, {
    toJSON: {
      versionKey: false
    }
  })
)

module.exports = modelExample
