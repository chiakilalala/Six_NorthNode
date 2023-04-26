const express = require('express')

const serviceError = require('@/services/serviceError')
const serviceResponse = require('@/services/serviceResponse')

const middlewareAuth = require('@/middlewares/middlewareAuth')

const controllerFrontSideUser = require('@/controllers/controllerFrontSideUser')

const router = express.Router()

router
  // 註冊
  .post('/signup', serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Signup']
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
          "data": "{
            "email": "example@gmail.com",
            "password": "$2a$10$gM12N5eCKXwA12uKBRO9jOUl3QK3FruZ57XCR0ECXbEPnPNBfPrbO",
            "profilePic": "/images/profilePic.jpeg",
            "_id": "mongoId",
            "createdAt": "2023-04-26T15:47:12.219Z",
            "updatedAt": "2023-04-26T15:47:12.219Z",
            "__v": 0
          }",
        }
      }
     */
    const result = await controllerFrontSideUser.signup(req, res, next)
    serviceResponse.success(res, result)
  }))

  // 登入
  .post('/signin', serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Signin']
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
          "data": "{
            "token": "token",
            "email": "example@gmail.com"
          }",
        }
      }
     */
    const result = await controllerFrontSideUser.signin(req, res, next)
    serviceResponse.success(res, result)
  }))

  // 驗證信箱是否重複 不能放在需要驗證的路由前面
  .post('/checkEmail', serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['CheckEmail']
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
          "data": "{
            "message": "example@gmail.com 可以使用"
          }",
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

  // 修改
  .post('/updateUser', middlewareAuth.loginAuth, serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['UpdateUser']
     * #swagger.summary = '修改會員資料'
     * #swagger.description = '修改會員資料'
     * #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: 'true',
        description: '修改會員資料用',
        schema:{
                "$password": 'password',
                "$confirmPassword": 'password',
            }
      }
      * #swagger.responses[200] = {
        description: '回傳物件',
        schema: {
          "status": true,
          "data": "{
          "_id": "644921a5f392998795e9c8ff",
          "email": "user1@gmail.com",
          "password": "$2a$10$IBsir4sPL1nZnGp4K9JOLOu5E./iFOko.20w/EnFsFMOJH9e3B1Ve",
          "profilePic": "/images/profilePic.jpeg",
          "createdAt": "2023-04-26T13:05:41.123Z",
          "updatedAt": "2023-04-26T16:02:43.035Z",
          "__v": 0
          }",
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
     */
    const result = await controllerFrontSideUser.updateUser(req, res, next)
    serviceResponse.success(res, result)
  }))

// 刪除
module.exports = router
