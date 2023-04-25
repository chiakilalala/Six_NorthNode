const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerAdmin = require('@/controllers/controllerAdmin')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

const validator = require('validator')
const serviceJWT = require('@/services/serviceJWT')
const middlewareAdminAuth = require('@/middlewares/middlewareAdminAuth')

router.post(
  '/signup',
  serviceError.asyncError(async (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      serviceResponse.error(httpCode.BAD_REQUEST, '欄位不可為空', next)
    }
    if (!validator.isLength(password, { min: 8 })) {
      serviceResponse.error(httpCode.BAD_REQUEST, '密碼長度至少8位', next)
    }

    if (!validator.isEmail(email)) {
      serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤', next)
    }
    next()
  }),
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Admin']
     * #swagger.summary = '管理員註冊'
     * #swagger.description = '管理員註冊'
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
            "name":"admin",
            "email":"admin@gmail.com",
            "password":"admin123",
            "confirmPassword":"admin123"
        }
      }
     */

    const { name, email, password } = req.body
    const newUser = await controllerAdmin.signUp(name, email, password)
    const token = serviceJWT.generateJWT(newUser)
    serviceResponse.success(res, {
      user: newUser,
      token
    })
  })
)

router.post(
  '/login',
  serviceError.asyncError(async (req, res, next) => {
    const { email, password, name } = req.body
    // 驗證
    if (!email || !password) {
      serviceResponse.error(httpCode.BAD_REQUEST, '欄位不可為空', next)
    }
    if (!validator.isLength(password, { min: 8 })) {
      serviceResponse.error(httpCode.BAD_REQUEST, '密碼長度至少8位', next)
    }

    if (!validator.isEmail(email)) {
      serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤', next)
    }
    if (name !== 'admin') {
      serviceResponse.error(httpCode.BAD_REQUEST, '非管理者本人', next)
    }
    next()
  }),
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['AdminLogin']
     * #swagger.summary = '管理員登入'
     * #swagger.description = '管理員登入'
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "status": true,
          "data": "登入成功",
        }
      }
     */
    const { email, password } = req.body
    const newUser = await controllerAdmin.Login(email, password)
    const token = serviceJWT.generateJWT(newUser)
    serviceResponse.success(res, '登入成功', {
      user: newUser,
      token
    })
  })
)

module.exports = router