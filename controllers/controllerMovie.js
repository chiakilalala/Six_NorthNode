
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
      const releaseDate = new Date()
      const released = isRelease === 'true'

      // filter by release date
      movies = await Movie.find({
        name: { $regex: name, $options: 'i' },
        releaseData: {
          [released ? '$lte' : '$gt']: releaseDate
        }
      })
    } else if (name !== '') {
    // fuzzy search
      movies = await Movie.find({
        name: { $regex: name, $options: 'i' }
      })
    } else {
    // return all movies
      movies = await Movie.find()
    }

    movies = movies.filter(movie => {
      const releaseData = movie.releaseData
      if (!releaseData) {
        return false
      }
      return typeof releaseData.getMonth === 'function'
    })

    return movies
  }

}

module.exports = controllerMovie
