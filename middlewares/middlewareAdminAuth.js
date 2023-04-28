const serviceResponse = require('@/services/serviceResponse')
const serviceError = require('@/services/serviceError')
const serviceJWT = require('@/services/serviceJWT')
const Admin = require('@/models/modelAdmin')
const httpCode = require('@/utilities/httpCode')

const middlewareAdminAuth = serviceError.asyncError(async (req, res, next) => {
  // 確認 token 是否存在

  let token = null
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')

  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return serviceResponse.error(400, '沒有權限', next)
  }
  // 驗證 token 正確性
  const decode = await serviceJWT.decode(token)
  // Find the user by ID
  const currentUser = await Admin.findById(decode.id)
  // If no user is found, return an error
  if (!currentUser) {
    serviceResponse.error(400, '沒有權限', next)
  }
  // Set the user in the request object
  req.user = currentUser
  // Call the next middleware

  next()
})

module.exports = middlewareAdminAuth
