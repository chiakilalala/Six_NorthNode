const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const serviceResponse = require('@/services/serviceResponse')
router.get(
  '/',
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['自行填寫']
     * #swagger.summary = '自行填寫'
     * #swagger.description = '自行填寫'
     * #swagger.responses[200] = {
        description: '回傳範例資料',
        schema: {
          "status": "自行填寫",
          "data": "自行填寫",
        }
      }
     */
    const result = await '請引入 controller'
    serviceResponse.success(res, result)
  })
)

module.exports = router
