const Screens = require('../models/modelScreens')
const serviceResponse = require('@/services/serviceResponse.js')
const httpCode = require('@/utilities/httpCode')

const controllerScreens = {

  async getPlayDates (movieId) {
    const ObjectId = require('mongoose').Types.ObjectId
    const screens = await Screens.find({ movieId: new ObjectId(movieId) })
    const playDates = []

    const currentDate = new Date()

    screens.forEach((screen) => {
      const startDate = screen.startDate
      if (startDate >= currentDate) {
        const formattedDate = startDate.toISOString().split('T')[0]
        if (!playDates.includes(formattedDate)) {
          playDates.push(formattedDate)
        }
      }
    })

    return playDates
  }

}

module.exports = controllerScreens
