const httpCode = require('@/utilities/httpCode')

const middlewareError = (err, req, res, next) => {
  // dev
  err.statusCode = err.statusCode || httpCode.INTERNAL_SERVER_ERROR
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      status: false,
      message: err.message,
      error: err,
      stack: err.stack
    })
  }

  // production
  if (err.name === 'ValidationError') {
    err.message = '資料欄位未填寫正確，請重新輸入！'
    err.isOperational = true
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: false,
      error: err,
      message: err.message
    })
  }
  // log 紀錄
  console.error('出現重大錯誤', err)
  // 送出罐頭預設訊息
  res.status(httpCode.INTERNAL_SERVER_ERROR).json({
    status: false,
    error: err,
    message: '系統錯誤，請恰系統管理員'
  })
}

module.exports = middlewareError
