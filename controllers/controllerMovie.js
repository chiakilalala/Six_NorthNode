
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
  },

  async updateMovie (id, name, level, desc, releaseData) {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id, {
        name,
        level,
        desc,
        releaseData
      }, { new: true, returnDocument: 'after' })

    return updatedMovie
  },
  async deleteOneMovie (id) {
    const movie = await Movie.findById(id)
    if (!movie) {
      return serviceResponse.error(httpCode.NOT_FOUND, '找不到電影')
    }
    const deleteMove = await Movie.findByIdAndDelete(id)
    return deleteMove
  }

}

module.exports = controllerMovie
