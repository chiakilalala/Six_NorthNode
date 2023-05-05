const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const serviceJWT = require('@/services/serviceJWT')
const controllerMovie = require('@/controllers/controllerMovie')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const middlewareAdminAuth = require('@/middlewares/middlewareAdminAuth')
const Movie = require('../models/modelMovie')
const mongoose = require('mongoose')

router.post(
  '/',
  middlewareAdminAuth,
  serviceError.asyncError(async (req, res, next) => {
    const { name, imgs, level, desc, time, actors, videos, status, releaseData } = req.body
    if (!name || !level || !desc || !releaseData) {
      serviceResponse.error(httpCode.BAD_REQUEST, '欄位不可為空', next)
    }

    /**
     * #swagger.tags = ['Movie']
     * #swagger.summary = '新增電影資訊'
     * #swagger.description = '新增電影資訊'
     * #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: 'true',
        description: '新增電影資訊',
        schema:{
                "$name": '捍衛任務5',
                "$imgs": ['url'],
                "$level": 1,
                "$desc":'一個神隱少女的故事',
                "$time": 180,
                "actors": ["string"],
                "videos": ["string"],
                "status": 1,
                "$releaseData": "2023-05-01"
        }
      }
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "data":{
          "name": "捍衛任務5",
          "imgs": ["https://example.com/img1.jpg"],
          "level": 1,
          "desc": "一個神隱少女的故事",
          "time": 240,
          "actors": ["某某2", "某某4"],
          "videos": ["https://example.com/video1.mp4"],
          "status": 1,
          "releaseData": "2023-05-01T00:00:00.000Z",
          "createTime": "2023-05-03T14:26:35.378Z",
          "_id": "64526f1bd4947558c2b2b135"
          }
        }
      }
     */

    const result = await controllerMovie.createMovie(
      name,
      imgs,
      level,
      desc,
      time,
      actors,
      videos,
      status,
      releaseData)
    serviceResponse.success(res, result)
  })
)

router.get(
  '/',
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Movie']
     * #swagger.summary = '獲取電影列表'
     * #swagger.description = '獲取電影列表'
     * #swagger.parameters['isRelease'] = { description: '是否上檔', type: 'boolean', default: true }
     * #swagger.parameters['name'] = { description: '電影名稱模糊搜尋', type: 'string', default: '鋼鐵人' }
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "status": true,
          "data": [
            {
              "id": 1,
              "name": '鋼鐵人',
              "imgs": ["https://example.com/img1.jpg"],
              "level": 0,
              "desc": 'string',
              "time": 90,
              "actors": ['jason', 'vivian', 'echo'],
              "videos": ['https://example.com/video1.mp4'],
              "status": 1,
              "release_data": 'yymmdd-hms'
            }
          ],
        }
      }
     */

    const isRelease = req.query.isRelease
    const name = req.query.name || ''
    const movies = await controllerMovie.getMovies(isRelease, name)
    serviceResponse.success(res, {
      isRelease,
      data: movies
    })
  })
)

router.patch(
  '/:id',
  serviceError.asyncError(async (req, res, next) => {
    const { name, level, desc, releaseData } = req.body
    const { id } = req.params
    const movie = await Movie.findById(id)
    // 檢查必填欄位是否填寫
    if (!name || !level || !desc || !releaseData) {
      return serviceResponse.error(httpCode.BAD_REQUEST, 'name, level, desc, releaseData內容為必填', next)
    }

    if (!movie) {
      return serviceResponse.error(httpCode.NOT_FOUND, '找不到電影', next)
    }

    next()
  }),
  middlewareAdminAuth,
  serviceError.asyncError(async (req, res, next) => {
    /**
       * #swagger.tags = ['Movie']
       * #swagger.summary = '修改電影資訊'
       * #swagger.description = '修改電影資訊',
       * #swagger.parameters['id'] = { description: '電影id' }
       * #swagger.security = [{
        "apiKeyAuth": []
       }]
       * #swagger.parameters['obj'] = {
          in: 'body',
          type: 'object',
          required: 'true',
          description: '編輯電影資訊用',
          schema:{
                  "$name": '星際大戰5',
                  "imgs": ['url'],
                  "$level": 1,
                  "$desc":'一個神隱少女的故事',
                  "$time": 180,
                  "actors": ["string"],
                  "videos": ["string"],
                  "status": 1,
                  "$releaseData": "2023-05-04"
          }
        }
      * #swagger.responses[200] = {
          description: '回傳更新成功',
          schema: {
            "status": true,
            "Result": {
            "_id": "64526fa3d4947558c2b2b138"
            "name": "捍衛任務4",
            "imgs": ["https://example.com/img1.jpg"],
            "level": 1,
            "desc": "一個沙贊的故事ddd",
            "time": 180,
            "actors": ["某某", "某某"],
            "videos": ["https://example.com/video1.mp4"],
            "status": 1,
            "releaseData": "2023-05-04T00:00:00.000Z",
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NTI2ZmEzZDQ5NDc1NThjMmIyYjEzOCIsImlhdCI6MTY4MzIwNjU0NiwiZXhwIjoxNjgzODExMzQ2fQ.Te_BJAoLIQIJ3Sbd5yswBvYkjULIqJ8jdTZvI2r0nLg"
          }
        }
      */
    const { id } = req.params
    const { name, level, desc, releaseData } = req.body

    const result = await controllerMovie.updateMovie(id, name, level, desc, releaseData)
    const token = serviceJWT.generateJWT(result)
    serviceResponse.success(res, {
      result,
      token
    })
  })
)

router.delete(
  '/:id',
  middlewareAdminAuth,
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Movie']
     * #swagger.summary = '刪除一則電影資訊'
     * #swagger.description = '刪除一則電影資訊'
     * #swagger.parameters['id'] = { description: '電影id' }
     * #swagger.security = [{
        "apiKeyAuth": []
       }]
     * #swagger.responses[200] = {
        description: '刪除成功',
        schema: {
          "status": true,
          "data": {
          "_id": "644c5f99474605096360548c",
          "name": "神隱少女",
          "imgs": [],
          "level": 1,
          "desc": "一個神隱少女的故事",
          "time": 125,
          "actors": [],
          "videos": [],
          "releaseData": "2023-05-01T12:00:00.000Z"
          }
        }
      }
      * #swagger.responses[404] = {
      description: 'id不存在',
      schema: {
        "status": false,
        "message": "找不到電影",
        "error": {
          "statusCode": 404,
          "isOperational": true
        },
      }
     */
    const { id } = req.params
    if (!mongoose.isObjectIdOrHexString(id)) {
      return serviceResponse.error(httpCode.BAD_REQUEST, '刪除失敗', next)
    }

    const movie = await Movie.findById(id)
    if (!movie) {
      return serviceResponse.error(httpCode.NOT_FOUND, '找不到電影', next)
    }
    const result = await controllerMovie.deleteOneMovie(id)
    serviceResponse.success(res, result)
  })
)
module.exports = router
