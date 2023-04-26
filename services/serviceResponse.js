const serviceResponse = {
  success (res, data) {
    res
      .send({
        status: true,
        data
      })
      .end()
  },
  error (httpStatus, errMessage, next) {
    const error = new Error(errMessage)

    error.statusCode = httpStatus

    error.isOperational = true

    if (next) next(error)
    return error
  }
}

module.exports = serviceResponse
