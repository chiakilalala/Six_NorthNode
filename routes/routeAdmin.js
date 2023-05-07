const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerAdmin = require('@/controllers/controllerAdmin')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const Admin = require('../models/modelAdmin')
const validator = require('validator')
const serviceJWT = require('@/services/serviceJWT')
const middlewareAdminAuth = require('@/middlewares/middlewareAdminAuth')

router.post(
  '/signup',
  serviceError.asyncError(async (req, res, next) => {
    const { name, email, password } = req.body

    if (!email || !password || !name) {
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
     * #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: 'true',
        description: '會員註冊用',
        schema:{
                "$email": 'example@gmail.com',
                "$password": 'password',
                "$name":'name',
            }
      }
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "user": {
            "name": "name",
            "email": "example@gmail.com",
            "password": "$2a$12$ZNPx7mwkP0/QC6h6eaW5eeuJXdEQrolyIejEZEc55p2doi3C6g/3q",
            "role": "admin",
            "_id": "644f92cfcb3582d71cee8d80",
            "createdAt": "2023-05-01T10:22:07.078Z"
          },
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NGY5MmNmY2IzNTgyZDcxY2VlOGQ4MCIsImlhdCI6MTY4MjkzNjUyNywiZXhwIjoxNjgzNTQxMzI3fQ.yt4zPWEnxZ5Vj49Mcsq61j1qo4Bv0pfdH8GbJazkyE0"
        }
      }
     */

    const { name, email, password } = req.body
    const newAdmin = await controllerAdmin.signUp(name, email, password)
    const token = serviceJWT.generateJWT(newAdmin)

    serviceResponse.success(res, {
      user: newAdmin,
      token
    })
  })
)

router.post(
  '/login',
  serviceError.asyncError(async (req, res, next) => {
    const { email, password } = req.body
    const isAdmin = await Admin.findOne({ email, role: 'admin' })
    // 驗證
    if (!email || !password) {
      serviceResponse.error(httpCode.BAD_REQUEST, '欄位不可為空')
    }
    if (!validator.isLength(password, { min: 8 })) {
      serviceResponse.error(httpCode.BAD_REQUEST, '密碼長度至少8位')
    }

    if (!validator.isEmail(email)) {
      serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤')
    }
    if (!isAdmin) {
      serviceResponse.error(httpCode.BAD_REQUEST, '非管理者角色')
    }
    next()
  }),
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Admin']
     * #swagger.summary = '管理員登入'
     * #swagger.description = '管理員登入'
     * #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: 'true',
        description: '會員註冊用',
        schema:{
                "$email": 'example@gmail.com',
                "$password": 'password',
            }
      }
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "status": true,
          "data": "登入成功",
        }
      }
     */
    const { email, password } = req.body
    const newAdmin = await controllerAdmin.Login(email, password)
    const token = serviceJWT.generateJWT(newAdmin)
    serviceResponse.success(res, {
      user: newAdmin,
      token
    })
  })
)

module.exports = router
