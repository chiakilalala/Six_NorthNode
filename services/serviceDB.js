const config = require('@/utilities/config')
const serviceDB = {
  connections () {
    const mongoose = require('mongoose')
    const DB = config.DATABASE.replace('<password>', config.DATABASE_PASSWORD)

    mongoose.connect(DB).then(() => console.log('資料庫連接成功'))
  }
}

module.exports = serviceDB
