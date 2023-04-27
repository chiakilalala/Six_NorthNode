const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const serviceResponse = require('@/services/serviceResponse')
const middlewareAuth = require('@/middlewares/middlewareAuth')

const controllerFrontSideUser = require('@/controllers/controllerFrontSideUser')

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
            }
      }
     * #swagger.responses[200] = {
        description: '回傳物件',
        schema: {
          "status": true,
          "data": {
            "email": "example@gmail.com",
            "profilePic": "/images/profilePic.jpeg",
            "_id": "mongoId",
            "createdAt": "2023-04-26T15:47:12.219Z",
            "updatedAt": "2023-04-26T15:47:12.219Z",
            "__v": 0
          },
        }
      }
     */
  const result = await controllerFrontSideUser.signup(req, res, next)
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
      description: '回傳成功物件',
      schema: {
        "status": true,
        "data": {
          "token": "Bearer token",
          "id":"123456879",
          "email": "example@gmail.com"
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
  const result = await controllerFrontSideUser.signin(req, res, next)
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
      description: '回傳物件',
      schema: {
        "status": true,
        "data": {
          "message": "example@gmail.com 可以使用"
        },
      }
    }
    * #swagger.responses[406] = {
      description: '回傳物件',
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
  const result = await controllerFrontSideUser.checkEmail(req, res, next)
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
        "_id": "644921a5f392998795e9c8ff",
        "email": "user1@gmail.com",
        "profilePic": "/images/profilePic.jpeg",
        "createdAt": "2023-04-26T13:05:41.123Z",
        "updatedAt": "2023-04-26T16:02:43.035Z",
        "__v": 0
        },
      }
    }
    * #swagger.responses[406] = {
      description: '回傳物件',
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
      description: '回傳物件',
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
  const result = await controllerFrontSideUser.updateUser(req, res, next)
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
      description: '回傳物件',
      schema: {
        "status": true,
        "data": {
        "_id": "644921a5f392998795e9c8ff",
        "email": "user1@gmail.com",
        "profilePic": "/images/profilePic.jpeg",
        "createdAt": "2023-04-26T13:05:41.123Z",
        "updatedAt": "2023-04-26T16:02:43.035Z",
        "__v": 0
        },
      }
    }
   */
  const result = await controllerFrontSideUser.getUser(req, res, next)
  serviceResponse.success(res, result)
}))

module.exports = router
