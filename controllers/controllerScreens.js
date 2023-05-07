const Screens = require('../models/modelScreens')
const serviceResponse = require('@/services/serviceResponse.js')
const httpCode = require('@/utilities/httpCode')

const controllerScreens = {

  async getPlayDates (movieId) {
    // console.log('movieId:', movieId)

    const ObjectId = require('mongoose').Types.ObjectId
    const screens = await Screens.find({ movieId: new ObjectId(movieId) })
    const playDates = []

    // console.log('screens count:', screens.length)

    screens.forEach((screen) => {
      screen.startDate.forEach((date) => {
        const startDate = date.toISOString().split('T')[0]
        if (!playDates.includes(startDate)) {
          playDates.push(startDate)
        }
      })
    })

    // console.log('playDates:', playDates)

    return playDates
  }

}

module.exports = controllerScreens
