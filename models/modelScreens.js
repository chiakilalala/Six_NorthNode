
const mongoose = require('mongoose')

const screensSchema = new mongoose.Schema({
  movieId: { type: mongoose.Types.ObjectId, ref: 'movie', required: true },
  theaterId: { type: mongoose.Types.ObjectId, ref: 'theaters', required: true },
  seatsStatus: {
    type: Array,
    required: true,
    default: () => {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
      const seats = []
      for (let i = 0; i < rows.length; i++) {
        for (let j = 1; j <= 10; j++) {
          seats.push({
            seat_id: `${rows[i]}${j}`,
            is_booked: false
          })
        }
      }

      return seats
    }
  },
  startDate: {
    type: Date,
    required: true,
    validator: function (v) {
      return v instanceof Date
    },
    message: props => `${props.value} 不是一个有效的日期值`
  },
  createTime: {
    type: Date,
    default: Date.now,
    select: false,
    required: true
  }
}, {
  toJSON: {
    versionKey: false
  }
})
// 建立索引，以便查詢時可以使用
screensSchema.index({ theaterId: 1, startDate: 1 }, { unique: true })

const Screens = mongoose.model('screens', screensSchema)

module.exports = Screens
