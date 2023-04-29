
const Movie = require('../models/modelMovie')
const serviceResponse = require('@/services/serviceResponse.js')
const httpCode = require('@/utilities/httpCode')

const controllerMovie = {
  async createMovie (
    name,
    imgs,
    level,
    desc,
    time,
    actors,
    videos,
    status,
    releaseData,
    createTime
  ) {
    const newMovie = await Movie.create({
      name,
      imgs,
      level,
      desc,
      time,
      actors,
      videos,
      status,
      releaseData,
      createTime
    })
    return newMovie
  }
}

module.exports = controllerMovie
