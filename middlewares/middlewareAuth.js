const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')
const httpCode = require('@/utilities/httpCode')
const serviceJWT = require('@/services/serviceJWT')

const middlewareAuth = {
  loginAuth: serviceError.asyncError(async (req, res, next) => {
    let token

    if (!token) {
      serviceResponse.error(httpCode.UNAUTHORIZED, '無token尚未登入')
    }

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }

    // 有 token
    const decoded = await serviceJWT.decode(token)
    req.user = decoded.id
    next()
  })
}

module.exports = middlewareAuth
