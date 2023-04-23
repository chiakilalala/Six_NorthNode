const express = require('express')
const router = express.Router()
const serviceError = require('@/services/serviceError')
const middlewareUpload = require('@/middlewares/middlewareUpload')
const serviceFireBase = require('@/services/serviceFireBase')
router.post(
  '/image',
  middlewareUpload,
  serviceError.asyncError(async (req, res, next) => {
    /**
     * #swagger.tags = ['Upload']
     * #swagger.summary = '上傳圖片'
     * #swagger.description = '上傳圖片'
     * #swagger.parameters['image'] = {
        in: 'formData',
        type: 'file',
        required: 'false',
        description: 'Some description...',
      }
     * #swagger.responses[200] = {
        description: '回傳URL',
        schema: {
          "status": true,
          "data": "{
            fileUrl:'xxx'
          }",
        }
      }
     */
    await serviceFireBase.uploadFile(req, res, next)
  })
)

module.exports = router
