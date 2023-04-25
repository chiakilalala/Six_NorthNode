const jwt = require('jsonwebtoken')
const serviceResponse = require('@/services/serviceResponse')
const config = require('@/utilities/config')

const serviceJWT = {
  generateJWT: (user) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_DAY
    })
    // console.log(token)
    return token
  },

  // 驗證 token 正確性
  decode: async (token) => {
    try {
      const payload = await jwt.verify(token, config.JWT_SECRET)
      // console.log(payload)
      return payload
    } catch (err) {
      // console.log(err)
      throw serviceResponse.error(401, '沒有權限')
    }
  }
}
module.exports = serviceJWT
