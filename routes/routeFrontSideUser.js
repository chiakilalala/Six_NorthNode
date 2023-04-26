const express = require('express')

const serviceError = require('@/services/serviceError')
const serviceResponse = require('@/services/serviceResponse')

const middlewareAuth = require('@/middlewares/middlewareAuth')

const controllerFrontSideUser = require('@/controllers/controllerFrontSideUser')

const router = express.Router()

router
  // 註冊
  .post('/signup', serviceError.asyncError(async (req, res, next) => {
    const result = await controllerFrontSideUser.signup(req, res, next)
    serviceResponse.success(res, result)
  }))

  // 登入
  .post('/signin', serviceError.asyncError(async (req, res, next) => {
    const result = await controllerFrontSideUser.signin(req, res, next)
    serviceResponse.success(res, result)
  }))

  // 驗證信箱是否重複 不能放在需要驗證的路由前面
  .post('/checkEmail', serviceError.asyncError(async (req, res, next) => {
    const result = await controllerFrontSideUser.checkEmail(req, res, next)
    serviceResponse.success(res, result)
  }))

  // 修改
  .post('/updateUser', middlewareAuth.loginAuth, serviceError.asyncError(async (req, res, next) => {
    const result = await controllerFrontSideUser.updateUser(req, res, next)
    serviceResponse.success(res, result)
  }))

// 刪除
module.exports = router
