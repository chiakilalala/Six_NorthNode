const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerMovie = require('@/controllers/controllerMovie')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')
const middlewareAdminAuth = require('@/middlewares/middlewareAdminAuth')

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
        description: '會員註冊用',
        schema:{
                "$name": '鋼鐵人',
                "$imgs": ['url'],
                "$level": 1,
                "$desc":'一個神隱少女的故事',
                "time": 180,
                "actors": ["string"],
                "videos": ["string"],
                "status": 1,
                "releaseData": "2023-05-01"
        }
      }
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "name": "捍衛任務4",
          "imgs": ["https://example.com/img1.jpg"],
          "level": 1,
          "desc": "一個神隱少女的故事",
          "time": 180,
          "actors": ["某某", "某某"],
          "videos": ["https://example.com/video1.mp4"],
          "status": 1,
          "releaseData": "2023-05-01T12:00:00Z"
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
module.exports = router
