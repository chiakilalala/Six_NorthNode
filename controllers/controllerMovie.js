
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
    let movies = []

    if (isRelease !== undefined) {
      if (isRelease) {
      // filter by release date ( on or before today)
        movies = await Movie.find({
          name: { $regex: name, $options: 'i' },
          releaseData: { $lte: new Date() }
        })
      } else {
      // filter by release date (after today)
        movies = await Movie.find({
          name: { $regex: name, $options: 'i' },
          releaseData: { $gt: new Date() }
        })
      }
    } else if (name !== '') {
    // fuzzy search
      movies = await Movie.find({
        name: { $regex: name, $options: 'i' }
      })
    } else {
    // return all movies
      movies = await Movie.find()
    }
    return movies
  }

}

module.exports = controllerMovie
