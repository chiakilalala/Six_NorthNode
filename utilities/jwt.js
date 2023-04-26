const jwt = require('jsonwebtoken')
require('dotenv').config()

const token = {
  async signinToken (userId) {
    return jwt.sign(
      // data的內容可以在登入解密出來
      {
        id: userId
      },
      // 給jwt一個字串當作加密編碼參考
      // process.env.SECRET=SECRET
      process.env.SECRET,
      {
        algorithm: 'HS256',
        // process.env.EXPIRES_IN=7d
        expiresIn: process.env.EXPIRES_IN
      }
    )
  }
}

module.exports = token
