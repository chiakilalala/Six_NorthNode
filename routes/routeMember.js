const express = require('express')
const router = express.Router()
const validator = require('validator')
const serviceError = require('@/services/serviceError')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const middlewareAuth = require('@/middlewares/middlewareAuth')

const controllerMember = require('@/controllers/controllerMember')

// 註冊
router.post('/signup', serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = '會員註冊'
   * #swagger.description = '會員註冊'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: 'true',
      description: '會員註冊用',
      schema:{
              "$email": 'example@gmail.com',
              "$password": 'password',
              "$nickName":'nickname',
          }
    }
   * #swagger.responses[200] = {
      description: '註冊成功',
      schema: {
        "status": true,
        "data": {
          "token": "token",
          "createRes":{
            "email": "example@gmail.com",
            "profilePic": "/images/profilePic.jpeg",
            "nickName": "nickname",
            "_id": "mongoId",
            "createdAt": "2023-04-26T15:47:12.219Z",
            "updatedAt": "2023-04-26T15:47:12.219Z",
            "__v": 0
          }
        },
      }
    }
    * #swagger.responses[402] = {
      description: '信箱、密碼、暱稱不可空白',
      schema: {
        "status": false,
        "message": "信箱、密碼、暱稱不可空白",
        "error": {
          "statusCode": 402,
          "isOperational": true
        },
      }
    }
    * #swagger.responses[400] = {
      description: 'email格式錯誤',
      schema: {
        "status": false,
        "message": "信箱格式錯誤",
        "error": {
          "statusCode": 400,
          "isOperational": true
        },
      }
    }
    * #swagger.responses[406] = {
      description: '信箱重複',
      schema: {
        "status": false,
        "message": "信箱重複",
        "error": {
        "statusCode": 406,
        "isOperational": true
        },
      }
    }
    * #swagger.responses[400] = {
      description: '密碼強度',
      schema: {
        "status": false,
        "message": "密碼長度至少8位、須包含數字與英文",
        "error": {
        "statusCode": 406,
        "isOperational": true
        },
      }
    }
   */

  const { email, password, nickName } = req.body

  if (!email || !password || !nickName) {
    return serviceResponse.error(httpCode.PAYMENT_REQUIRED, '信箱、密碼、暱稱不可空白', next)
  }

  if (!validator.isEmail(email)) {
    return serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤', next)
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minSymbols: 0, minUppercase: 0 })) {
    return serviceResponse.error(httpCode.BAD_REQUEST, '密碼長度至少8位、須包含數字與英文', next)
  }

  const result = await controllerMember.signup({ password, email, nickName }, next)
  serviceResponse.success(res, result)
})
)

// 登入
router.post('/signin', serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = '會員登入'
   * #swagger.description = '會員登入'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: 'true',
      description: '會員登入用',
      schema:{
              "$email": 'example@gmail.com',
              "$password": 'password',
          }
    }
   * #swagger.responses[200] = {
      description: '登入成功',
      schema: {
        "status": true,
        "data": {
          "token": "token",
          "signinRes":{
            "email": "example@gmail.com",
            "password": "null",
            "profilePic": "/images/profilePic.jpeg",
            "nickName": "nickname",
            "_id": "mongoId",
            "createdAt": "2023-04-26T15:47:12.219Z",
            "updatedAt": "2023-04-26T15:47:12.219Z",
            "__v": 0
          }
        },
      }
    }
    * #swagger.responses[402] = {
      description: '帳號或密碼欄位空白',
      schema: {
        "status": false,
        "message": "帳號密碼必填",
        "error": {
          "statusCode": 402,
          "isOperational": true
        },
      }
    }
    * #swagger.responses[400] = {
      description: 'email格式錯誤',
      schema: {
        "status": false,
        "message": "信箱格式錯誤",
        "error": {
          "statusCode": 400,
          "isOperational": true
        },
      }
    }
   * #swagger.responses[404] = {
      description: '未註冊的email',
      schema: {
        "status": false,
        "message": "帳號不存在",
        "error": {
          "statusCode": 404,
          "isOperational": true
        },
      }
    }
   * #swagger.responses[404] = {
      description: '密碼錯誤',
      schema: {
        "status": false,
        "message": "密碼錯誤",
        "error": {
          "statusCode": 404,
          "isOperational": true
        },
      }
    }
   */
  const { email, password } = req.body
  if (!email || !password) {
    return serviceResponse.error(httpCode.PAYMENT_REQUIRED, '帳號密碼必填', next)
  }

  if (!validator.isEmail(email)) {
    return serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤', next)
  }

  const result = await controllerMember.signin(email, password, next)
  serviceResponse.success(res, result)
}))

// 驗證信箱是否重複
router.post('/checkEmail', serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.summary = '驗證信箱重複'
   * #swagger.description = '驗證信箱重複'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: 'true',
      description: '驗證信箱重複用',
      schema:{
              "$email": 'example@gmail.com',
          }
    }
    * #swagger.responses[200] = {
      description: 'email可以使用',
      schema: {
        "status": true,
        "data": {
          "message": "example@gmail.com 可以使用"
        },
      }
    }
    * #swagger.responses[400] = {
      description: '信箱格式錯誤',
      schema: {
        "status": false,
        "message": "信箱格式錯誤",
        "error": {
        "statusCode": 400,
        "isOperational": true
        },
      }
    }
    * #swagger.responses[406] = {
      description: '信箱重複',
      schema: {
        "status": false,
        "message": "信箱重複",
        "error": {
        "statusCode": 406,
        "isOperational": true
        },
      }
    }
   */
  const { email } = req.body

  if (!validator.isEmail(email)) {
    return serviceResponse.error(httpCode.BAD_REQUEST, '信箱格式錯誤', next)
  }

  const result = await controllerMember.checkEmail(email, next)
  serviceResponse.success(res, result)
}))

// 修改密碼
router.post('/changePassword', middlewareAuth.loginAuth, serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ 'apiKeyAuth': [] }]
   * #swagger.summary = '修改會員密碼'
   * #swagger.description = '修改會員密碼'
   * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: 'true',
      description: '修改會員密碼用',
      schema:{
              "$password": 'password',
              "$confirmPassword": 'password',
          }
    }
    * #swagger.responses[200] = {
      description: '回傳物件',
      schema: {
        "status": true,
        "data": {
          "_id": "644cce67945042a407ed1c21",
           "email": "z2@gmail.com",
           "nickName": "aaa",
           "profilePic": "上傳圖片回傳的URL",
           "createdAt": "2023-04-29T07:59:35.033Z",
           "updatedAt": "2023-04-29T08:36:48.175Z",
           "__v": 0,
           "birthday": "2023-04-29T08:20:13.000Z",
           "phoneNumber": "0912345678"
        },
      }
    }
    * #swagger.responses[406] = {
      description: '密碼不一致',
      schema: {
        "status": false,
        "message": "密碼不一致",
        "error": {
        "statusCode": 406,
        "isOperational": true
        },
      }
    }
    * #swagger.responses[402] = {
      description: '密碼不能為空',
      schema: {
        "status": false,
        "message": "密碼不能為空",
        "error": {
        "statusCode": 402,
        "isOperational": true
        },
      }
    }
   */
  // 從jwt取得使用者id
  const { user } = req
  const { password, confirmPassword } = req.body
  if (!password || !confirmPassword) {
    return next(serviceResponse.error(httpCode.PAYMENT_REQUIRED, '密碼不能為空'))
  }

  if (password !== confirmPassword) {
    return next(serviceResponse.error(httpCode.NOT_ACCEPTABLE, '密碼不一致'))
  }

  const result = await controllerMember.changePassword(user, password)
  serviceResponse.success(res, result)
}))

// 取得會員資料
router.get('/getUser', middlewareAuth.loginAuth, serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ 'apiKeyAuth': [] }]
   * #swagger.summary = '取得會員資料'
   * #swagger.description = '取得會員資料'
    * #swagger.responses[200] = {
      description: '取得會員資料',
      schema: {
        "status": true,
        "data": {
          "_id": "644cce67945042a407ed1c21",
          "email": "z2@gmail.com",
          "nickName": "使用者暱稱",
          "profilePic": "",
          "createdAt": "2023-04-29T07:59:35.033Z",
          "updatedAt": "2023-04-29T08:08:39.850Z",
          "__v": 0,
          "birthday": "2022-02-03T00:00:00.000Z",
          "phoneNumber": "0912345678"
        },
      }
    }
   */
  // 從jwt取得使用者id
  const { user } = req
  const result = await controllerMember.getUser(user)
  serviceResponse.success(res, result)
}))

// 修改會員資料
router.post('/updateUser', middlewareAuth.loginAuth, serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ 'apiKeyAuth': [] }]
   * #swagger.summary = '修改會員資料'
   * #swagger.description = '修改會員資料'
   * * #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      required: 'true',
      description: '修改會員資料用',
      schema:{
              "nickName": '使用者暱稱',
              "phoneNumber": '0912345678',
              "birthday":'Sat Apr 29 2023 16:20:13 GMT+0800 (台北標準時間)或2020-01-01',
              "profilePic":'上傳圖片回傳的URL'
          }
    }
    * #swagger.responses[200] = {
      description: '修改會員資料',
      schema: {
        "status": true,
        "data": {
          "_id": "644cce67945042a407ed1c21",
          "email": "z2@gmail.com",
          "nickName": "使用者暱稱",
          "profilePic": "上傳圖片回傳的URL",
          "createdAt": "2023-04-29T07:59:35.033Z",
          "updatedAt": "2023-04-29T08:14:38.516Z",
          "__v": 0,
          "birthday": "2023-04-29T08:14:30.000Z",
          "phoneNumber": "0912345678"
        },
      }
    }
   */
  const { nickName, phoneNumber, birthday, profilePic } = req.body
  const { user } = req
  const result = await controllerMember.updateUser({ user, nickName, phoneNumber, birthday, profilePic })
  serviceResponse.success(res, result)
}))

// 檢查是否登入
router.get('/checkToken', middlewareAuth.loginAuth, serviceError.asyncError(async (req, res, next) => {
  /**
   * #swagger.tags = ['User']
   * #swagger.security = [{ 'apiKeyAuth': [] }]
   * #swagger.summary = '檢查是否有登入'
   * #swagger.description = '檢查是否有登入'
   * * #swagger.parameters['authorization'] = {
      in: 'header',
      type: 'string',
      required: 'true',
      description: '檢查是否有登入用',
      schema:{
              "header.authorization": 'Bearer token'
          }
    }
    * #swagger.responses[200] = {
      description: '修改會員資料',
      schema: {
        "status": true,
        "data": {
          "message": "已驗證的使用者"
        },
      }
    }
    * #swagger.responses[401] = {
      description: 'token驗證錯誤',
      schema: {
        "status": false,
        "message": "沒有權限",
        "error": {
        "statusCode": 401,
        "isOperational": true
        },
      }
    }
   */
  const { user } = req
  if (user !== undefined && user !== '') {
    const data = {
      message: '已驗證的使用者'
    }
    serviceResponse.success(res, data)
  }
}))

module.exports = router
