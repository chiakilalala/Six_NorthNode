const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerScreens = require('@/controllers/controllerScreens')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const middlewareAdminAuth = require('@/middlewares/middlewareAdminAuth')
const Screens = require('../models/modelScreens')
const mongoose = require('mongoose')

router.get(
  '/:movieId/playDate',
  serviceError.asyncError(async (req, res, next) => {
    /**
         * #swagger.tags = ['Screen']
         * #swagger.summary = '某部電影所有播放日期'
         * #swagger.description = '某部電影所有播放日期'
         * #swagger.parameters['movieId'] = { description: '電影id' }
         * #swagger.responses[200] = {
            description: '回傳範例資料',
            schema: {
              "status": "自行填寫",
              "data":[
                '2023-06-01',
                '2023-06-02',
                '2023-06-03'
              ]
            }
          }
         */

    const { movieId } = req.params
    const playDates = await controllerScreens.getPlayDates(movieId)
    serviceResponse.success(res, playDates)
  })
)

router.post(
  '/',
  middlewareAdminAuth,
  serviceError.asyncError(async (req, res, next) => {
    const { movieId, theaterId, startDate } = req.body
    if (!movieId || !theaterId || !startDate) {
      return serviceResponse.error(httpCode.BAD_REQUEST, '欄位不可為空', next)
    }
    /**
         * #swagger.tags = ['Screen']
         * #swagger.summary = '新增場次'
         * #swagger.description = '新增場次'
         * #swagger.parameters['body'] = {
              in: 'body',
              type: 'object',
              description: '新增電影場次用',
              schema:{
                      "$movieId": "string",
                      "$theaterId":"string",
                      "$seatsStatus":[
                          {
                            "seat_id": "A1",
                            "is_booked": true
                          },
                          {
                            "seat_id": "A2",
                            "is_booked": true
                          },
                          {
                            "seat_id": "A3",
                            "is_booked": false
                          }
                       ],
                      "$startDate":"2023-06-02",
                      "createTime": "2023-05-05"
              }
           }
         * #swagger.responses[200] = {
            description: '新增場次成功',
            schema: {
              "status": "true",
              "data": {
                "existingScreen": {
                  "_id": "6459c26fb2ae212cbafe7987",
                  "movieId": {
                      "_id": "6457a5189fe33a33dc9c81e5",
                      "name": "星際異攻隊3"
                  },
                  "theaterId": {
                      "_id": "6458edd4ae4008081f29c7b3",
                      "type": 1
                  },
                  "startDate": "2023-06-03T00:00:00.000Z",
                  "seatsStatus": [
                      {
                          "seat_id": "A1",
                          "is_booked": false
                      },
                      {
                          "seat_id": "A2",
                          "is_booked": false
                      },
                      {
                          "seat_id": "A3",
                          "is_booked": false
                      }
                    ]
                  }
                }
              }
          }
         * #swagger.responses[400] = {
            description: '有重複的場次',
            schema: {
              "status": false,
              "message": "有重複的場次請修正",
              "error": {
                "statusCode": 400,
                "isOperational": true
                },
              }
            }
      */

    const result = await controllerScreens.insertScreens(
      movieId, theaterId, startDate)
    serviceResponse.success(res, result)
  })
)
router.get(
  '/',
  serviceError.asyncError(async (req, res, next) => {
    /**
         * #swagger.tags = ['Screen']
         * #swagger.summary = '電影所有場次資訊'
         * #swagger.description = '電影所有場次資訊'
         * #swagger.responses[200] = {
            description: '回傳範例資料',
            schema: {
              "status": true,
              "data":[
                '2023-06-01',
                '2023-06-02',
                '2023-06-03'
              ]
            }
          }
    */
    const { movieId, type, startDate, name } = req.query

    const result = await controllerScreens.getScreens(movieId, type, startDate, name)
    console.log(result, 'controllerScreens.getScreens')
    console.log(req.query, 'req.query')
    serviceResponse.success(res, result)
  })

)
router.get(
  '/:screenId',
  serviceError.asyncError(async (req, res, next) => {
    /**
           * #swagger.tags = ['Screen']
           * #swagger.summary = '某部電影場次資訊'
           * #swagger.description = '某部電影場次資訊期'
           * #swagger.parameters['screenId'] = { description: '電影場次id' }
           * #swagger.responses[200] = {
              description: '回傳範例資料',
              schema: {
                "status": true,
                "data":{
                  "movieId": {
                      "_id": "6457a5189fe33a33dc9c81e5",
                      "name": "星際異攻隊3"
                    },
                   "theaterId": {
                      "_id": "6458e59aae4008081f29c7b1",
                      "type": 0
                  },
                  "startDate": "2023-06-04T00:00:00.000Z",
                  "seatsStatus": [
                      {
                          "seat_id": "A1",
                          "is_booked": true
                      },
                      {
                          "seat_id": "A2",
                          "is_booked": true
                      },
                    ]
                }
              }
            }
          */

    const { screenId } = req.params
    const result = await controllerScreens.getOneScreen(screenId)

    serviceResponse.success(res, result)
  })
)
router.delete(
  '/:screenId',
  middlewareAdminAuth,
  serviceError.asyncError(async (req, res, next) => {
  /**
         * #swagger.tags = ['Screen']
         * #swagger.summary = '刪除某部電影場次'
         * #swagger.description = '刪除某部電影場次'
         * #swagger.parameters['screenId'] = { description: '電影場次id' }
         * #swagger.responses[200] = {
            description: '刪除成功',
            schema: {
              "status": "true",
                  "data": {
                  "_id": "6450e3184764484909db19de",
                  "movieId": "645216095f6048901715286b",
                  "startDate": "2023-06-01T10:00:00.000Z",
                  "theaterId": "64537a165fff2ccab6e21239",
                   "seatsStatus": [ {
                      "seat_id": "A1",
                      "is_booked": false
                     },
                      {
                          "seat_id": "A2",
                          "is_booked": false
                      },
                      {
                          "seat_id": "A3",
                          "is_booked": false
                      },]
              }
            }
          }
         */
    const { screenId } = req.params
    const result = await controllerScreens.deleteOneScreen(screenId)
    serviceResponse.success(res, result)
  })
)

router.patch(
  '/:screenid',
  serviceError.asyncError(async (req, res, next) => {
    const { seatsStatus, startDate, movieId, theaterId } = req.body
    const { screenid } = req.params
    const screen = await Screens.findById(screenid)
    // 檢查必填欄位是否填寫
    if (!seatsStatus || !startDate) {
      return serviceResponse.error(httpCode.BAD_REQUEST, '內容為必填', next)
    }
    if (!screen) {
      return serviceResponse.error(httpCode.NOT_FOUND, '找不到場次資訊', next)
    }
    if (seatsStatus == null) {
      return serviceResponse.error(httpCode.BAD_REQUEST, '內容不能為空', next)
    }
    if (!mongoose.isObjectIdOrHexString(screenid)) {
      return serviceResponse.error(httpCode.NOT_FOUND, '所遇到的Id不是合法的ObjectId')
    }
    next()
  }),
  middlewareAdminAuth,
  serviceError.asyncError(async (req, res, next) => {
    /**
         * #swagger.tags = ['Screen']
         * #swagger.summary = '修改某場電影場次資訊'
         * #swagger.description = '修改某場電影場次資訊'
         * #swagger.parameters['screenid'] = { description: '場次id' }
         * #swagger.parameters['body'] = {
            in: 'body',
            type: 'object',
            required: 'true',
            description: '修改某場電影場次資訊用',
            schema:{
                    "$startDate": '2023-06-03',
                    "$seatsStatus": [
                        {
                            "seat_id": "A1",
                            "is_booked": true
                        },
                        {
                            "seat_id": "A2",
                            "is_booked": true
                        },
                      ]
                }
          }
          * #swagger.responses[200] = {
            description: '修改成功',
              schema: {
                "status": true,
                "data":{
                "seatsStatus"：[
                    {
                    "seat_id": "A1",
                    "is_booked": true
                    },
                    {
                    "seat_id": "A2",
                    "is_booked": true
                    },
                ],
                 "startDate": "2023-06-03T00:00:00.000Z",
                    "movieId": {
                        "_id": "6457a5189fe33a33dc9c81e5",
                        "name": "星際異攻隊3"
                    },
                "theaterId": {
                      "_id": "6458e59aae4008081f29c7b1",
                      "type": 0
                  }
              }
            }
          }
    */
    const { screenid } = req.params
    const { seatsStatus, startDate, theaterId } = req.body
    const { type } = req.body.theaterId || {}

    const result = await controllerScreens.updateScreen(
      screenid, seatsStatus, startDate, theaterId, type)
    serviceResponse.success(res, result)
  })
)

module.exports = router
