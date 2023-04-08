require('module-alias/register') // alias 別名 @ 為根目錄
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const serviceDB = require('@/services/serviceDB') // 引入自訂的 serviceDB
const swaggerUi = require('swagger-ui-express') // 引入 swagger-ui-express
const swaggerFile = require('@/swagger_output.json')

// 引入 swagger 的 json 檔案
const app = express() // 建立 express 的實體
serviceDB.connections() // 建立資料庫連線

// Load middleware
const middlewareError = require('@/middlewares/middlewareError')

// Load routes 請使用 ./ 引入不然 swagger 會找不到
const routeExample = require('./routes/routeExample') // 引入自訂的 routeExample

// Set up middleware
app.use(logger('dev')) // 設定 morgan 的 logger，可以在 server 端看到請求的細節
app.use(express.json()) // 設定 express 可以解析 json
app.use(express.urlencoded({ extended: false })) // 設定 express 可以解析 urlencoded
app.use(cookieParser()) // 設定 cookieParser
app.use(express.static(path.join(__dirname, 'public'))) // 設定 express 可以讀取 public 資料夾內的檔案
app.use(cors({
  origin: ['*'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization']
})) // 設定 cors

// Set up routes
app.use('/example', routeExample)
app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile)) // 設定 swagger 的路由

// Set up error handling
app.use(middlewareError) // 設定錯誤處理

// 程式出現重大錯誤時
process.on('uncaughtException', (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')
  console.error(err)
  process.exit(1)
})

// 未捕捉到的 catch
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err)
})

module.exports = app
