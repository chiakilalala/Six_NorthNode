const admin = require('firebase-admin')
const config = require('../utilities/config')
const { v4: uuidv4 } = require('uuid')
const serviceResponse = require('@/services/serviceResponse')
admin.initializeApp({
  credential: admin.credential.cert({
    type: config.FIRE_BASE.TYPE,
    project_id: config.FIRE_BASE.PROJECT_ID,
    private_key_id: config.FIRE_BASE.PRIVATE_KEY_ID,
    private_key: config.FIRE_BASE.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: config.FIRE_BASE.CLIENT_EMAIL,
    client_id: config.FIRE_BASE.CLIENT_ID,
    auth_uri: config.FIRE_BASE.AUTH_URI,
    token_uri: config.FIRE_BASE.TOKEN_URI,
    auth_provider_X509_cert_url: config.FIRE_BASE.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: config.FIRE_BASE.CLIENT_X509_CERT_URL
  }),
  storageBucket: `${config.FIRE_BASE.PROJECT_ID}.appspot.com`
})
const bucket = admin.storage().bucket()
const serviceFireBase = {
  uploadFile: async (req, res) => {
    if (!req.files.length) {
      throw serviceResponse.error(400, '尚未上傳檔案')
    }
    // 取得上傳的檔案資訊列表裡面的第一個檔案
    const file = req.files[0]
    // 基於檔案的原始名稱建立一個 blob 物件
    const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`)
    // 建立一個可以寫入 blob 的物件
    const blobStream = blob.createWriteStream()

    // 將檔案的 buffer 寫入 blobStream
    blobStream.end(file.buffer)

    // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
    blobStream.on('finish', () => {
      // 設定檔案的存取權限
      const config = {
        action: 'read', // 權限
        expires: '12-31-2500' // 網址的有效期限
      }
      // 取得檔案的網址
      blob.getSignedUrl(config, (err, fileUrl) => {
        if (err) {
          throw serviceResponse.error(500, '取得檔案網址失敗')
        }
        serviceResponse.success(res, { fileUrl })
      })
    })

    // 如果上傳過程中發生錯誤，會觸發 error 事件
    blobStream.on('error', (err) => {
      if (err) {
        throw serviceResponse.error(500, '上傳失敗')
      }
    })
  }
}
module.exports = serviceFireBase
