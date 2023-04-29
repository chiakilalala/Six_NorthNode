const mongoose = require('mongoose')

const modelExample = mongoose.model(
  'movie',
  new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'name 未填寫']
    },
    imgs: {
      type: Array,
      default: []
    },
    level: {
      type: Number,
      required: [true, '電影級別 未填寫'],
      default: 0,
      enum: [0, 1, 2] // 0:普通1:保護2:限制
    },
    desc: {
      type: String,
      required: [true, '電影敘述 未填寫']
    },
    time: {
      type: Number,
      default: 0
    },
    actors: {
      type: [String],
      default: []
    },
    videos: {
      type: [String],
      default: []
    },
    status: {
      type: Number,
      enum: [0, 1] // 0:下檔1:尚未下檔
    },
    releaseData: {
      type: Date,
      required: [true, '電影上映日期 未填寫'],
      validator: function (v) {
        return v instanceof Date
      },
      message: props => `${props.value} 不是一个有效的日期值`

    },
    createTime: {
      type: Date,
      default: Date.now,
      select: false
    }
  }, {
    toJSON: {
      versionKey: false
    }
  })
)

module.exports = modelExample
