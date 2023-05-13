const Screens = require('../models/modelScreens')
const Theaters = require('../models/modelTheaters')
const serviceResponse = require('@/services/serviceResponse.js')
const httpCode = require('@/utilities/httpCode')
const Movie = require('../models/modelMovie')
const mongoose = require('mongoose')
const serviceValidateDate = require('@/services/serviceValidateDate')

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
  },

  async  insertScreens (movieId, theaterId, startDate) {
    const movieExist = await Screens.findOne({ theaterId, startDate })
    console.log(theaterId, startDate)
    if (movieExist > 0) {
      throw serviceResponse.error(httpCode.BAD_REQUEST, '有重複的場次請修正')
    }

    const newScreens = await Screens.create({
      movieId,
      theaterId,
      startDate,
      createTime: new Date()
    })

    const result = await Screens.findById(newScreens._id)
      .populate({
        path: 'movieId',
        select: 'name'
      })
      .populate({
        path: 'theaterId',
        select: 'type'
      })

    console.log(result.theaterId.type)

    const seatsStatus = []
    if (result.theaterId.type === 0) {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
      for (let i = 0; i < rows.length; i++) {
        for (let j = 1; j <= 10; j++) {
          seatsStatus.push({
            seat_id: `${rows[i]}${j}`,
            is_booked: false
          })
        }
      }
    } else if (result.theaterId.type === 1) {
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
      for (let i = 0; i < rows.length; i++) {
        for (let j = 1; j <= 16; j++) {
          seatsStatus.push({
            seat_id: `${rows[i]}${j}`,
            is_booked: false
          })
        }
      }
    }
    if (!result) {
      return serviceResponse.error(httpCode.INTERNAL_SERVER_ERROR, '無法建立場次，請稍後再試')
    }
    return { result }
  },

  async getScreens (movieId, type, startDate, name) {
    const query = {}

    if (type !== undefined) {
      const theaters = await Theaters.findOne({ type }).catch(() => {
        throw serviceResponse.error(httpCode.BAD_REQUEST, 'Invalid Date')
      })
      if (!theaters) {
        throw serviceResponse.error(httpCode.NOT_FOUND, 'Theater not found')
      }
      query.theaterId = theaters._id
    }

    if (startDate !== undefined) {
      serviceValidateDate.validateDate(startDate) // 驗證日期
      const startDateTime = new Date(startDate).toISOString()
      const endDate = new Date(startDateTime)
      endDate.setDate(endDate.getDate() + 1)
      query.startDate = {
        $gte: new Date(startDateTime),
        $lt: new Date(endDate.toISOString())
      }
    }

    if (movieId !== undefined) {
      if (mongoose.isValidObjectId(movieId)) {
        query.movieId = movieId
      } else {
        throw serviceResponse.error(httpCode.BAD_REQUEST, 'Invalid theaterId')
      }
    }

    if (name !== undefined) {
      const movies = await Movie.find({ name: { $regex: name, $options: 'i' } }).catch(error => {
        throw serviceResponse.error(httpCode.INTERNAL_SERVER_ERROR, error.message)
      })
      if (movies.length === 0) {
        return []
      }
      const movieIds = movies.map(movie => movie._id)
      query.movieId = { $in: movieIds }
    }
    // console.log(query, 'before')
    const result = await Screens.find(query)
      .populate({
        path: 'movieId',
        select: 'name',
        match: { name: { $regex: new RegExp(name, 'i') } }
      })
      .populate({
        path: 'theaterId',
        select: 'type',
        match: { type: { $ne: null } }
      })
      .exec()
    const filterResult = result.filter(screen => screen.movieId && screen.theaterId)

    // console.log(query, 'after')
    // console.log(filterResult, 'result')
    return filterResult
  },
  async getOneScreen (screenId) {
    const OneScreen = await Screens.findById(screenId)
      .populate({
        path: 'movieId',
        select: 'name'
      })
      .populate({
        path: 'theaterId',
        select: 'type'
      })
    // console.log(OneScreen.movieId.name)
    if (!screenId) {
      return serviceResponse.error(httpCode.NOT_FOUND, '找不到場次資訊')
    }
    if (!mongoose.isObjectIdOrHexString(screenId)) {
      return serviceResponse.error(httpCode.NOT_FOUND, '所遇到的Id不是合法的ObjectId')
    }
    return OneScreen
  },

  async updateScreen (screenid, seatsStatus, startDate, theaterId) {
    const screenExist = await Screens.findOne({
      _id: { $ne: screenid },
      theaterId,
      startDate
    })// 所查詢到的場次資訊不包括正在被更新的那個場次資訊

    if (screenExist) {
      throw serviceResponse.error(httpCode.BAD_REQUEST, '有重複的場次請修正')
    }

    const result = await Screens.findByIdAndUpdate(
      screenid, {
        seatsStatus,
        startDate

      }, { new: true, runValidators: true, returnDocument: 'after' })
      .populate({
        path: 'movieId',
        select: 'name' // 顯示 "name" 欄位
      })
      .populate({
        path: 'theaterId',
        select: 'type' // 顯示 "type" 欄位
      })

    return {
      seatsStatus: result.seatsStatus,
      startDate: result.startDate,
      movieId: result.movieId,
      theaterId: result.theaterId
    }
  },
  async deleteOneScreen (screenId) {
    const Screen = await Screens.findById(screenId)
    if (!Screen) {
      return serviceResponse.error(httpCode.NOT_FOUND, '所遇到的Id不是合法的ObjectId')
    }
    const result = await Screens.findByIdAndDelete(screenId)

    return result
  }

}

module.exports = controllerScreens
