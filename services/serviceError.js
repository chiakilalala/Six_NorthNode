const serviceError = {
  // 捕捉 async fun 錯誤
  // 將 async fun 帶入參數儲存
  asyncError (func) {
    // middleware 先接住 router 資料
    return (req, res, next) => {
      // 再執行函式，async 可再用 catch 統一捕捉
      func(req, res, next).catch((error) => next(error))
    }
  }
}

module.exports = serviceError
