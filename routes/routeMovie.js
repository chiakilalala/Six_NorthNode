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
     * #swagger.tags = ['Post']
     * #swagger.summary = '新增電影資訊'
     * #swagger.description = '新增電影資訊'
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

module.exports = router
