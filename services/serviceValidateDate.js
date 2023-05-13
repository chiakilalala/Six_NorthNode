const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

const serviceValidateDate = {
  validateDate (date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      throw serviceResponse.error(httpCode.BAD_REQUEST, 'Invalid Date')
    }
  }
}

module.exports = serviceValidateDate
