
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
    director,
    actors,
    videos,
    videoImg,
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
      director,
      actors,
      videos,
      videoImg,
      status,
      releaseData,
      createTime
    })
    return newMovie
  },

  async getMovies (isRelease, name) {
    const query = {}
    if (name) {
      query.name = { $regex: name, $options: 'i' }
    }
    if (isRelease === 'true') {
      query.releaseData = { $lte: new Date() }
    } else if (isRelease === 'false') {
      query.releaseData = { $gt: new Date() }
    }
    const result = await Movie.find(query)
    return result
  }

}

module.exports = controllerMovie
