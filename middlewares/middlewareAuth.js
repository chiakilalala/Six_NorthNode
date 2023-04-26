const jwt = require('jsonwebtoken')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

const middlewareAuth = {
  async loginAuth (req, res, next) {
    let token
    // 取得現在時間 單位為秒
    const time = Math.floor(Date.now() / 1000)
    if (
      req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
      serviceResponse.error(httpCode.UNAUTHORIZED, '無token尚未登入')
    }

    // 有 token
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET, (err, decode) => {
        if (err) {
          reject(err)
        } else if (decode.exp <= time) {
          resolve('token已過期')
        } else {
          resolve(decode)
        }
      })
    })
    req.user = decoded.id
    next()
  }
}

module.exports = middlewareAuth
