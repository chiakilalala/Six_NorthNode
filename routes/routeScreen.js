const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const controllerScreens = require('@/controllers/controllerScreens')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

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

module.exports = router
