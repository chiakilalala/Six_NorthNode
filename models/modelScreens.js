
const mongoose = require('mongoose')

const screensSchema = new mongoose.Schema({
  movieId: { type: mongoose.Types.ObjectId, ref: 'Movie', required: true },
  theaterId: { type: Object, required: true },
  seatsStatus: { type: Object, required: true },
  startDate: [{ type: Date, required: true }],
  createTime: { type: Date, required: true }
}, {
  toJSON: {
    versionKey: false
  }
})

const Screens = mongoose.model('screens', screensSchema)

module.exports = Screens
