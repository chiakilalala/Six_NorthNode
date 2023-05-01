const Admin = require('../models/modelAdmin')
const serviceResponse = require('@/services/serviceResponse.js')
const bcrypt = require('bcryptjs')
const httpCode = require('@/utilities/httpCode')

const controllerAdmin = {
  async signUp (name, email, password) {
    const Passwordbcrypt = await bcrypt.hash(password, 12) // 密碼加密
    const findAdmin = await Admin.findOne({ email })
    if (findAdmin) {
      throw serviceResponse.error(httpCode.BAD_REQUEST, '此E-mail已經註冊')
    }

    const newAdmin = await Admin.create({
      name, email, password: Passwordbcrypt, role: 'admin' // 預設設定為管理員角色

    })

    return newAdmin
  },
  async Login (email, password) {
    const NewAdmin = await Admin.findOne({ email }).select('+password') // 密碼補顯示
    const auth = await bcrypt.compare(password, NewAdmin.password)

    if (!auth) {
      throw serviceResponse.error(httpCode.BAD_REQUEST, '密碼錯誤')
    }
    return {
      _id: NewAdmin._id,
      name: NewAdmin.name,
      email: NewAdmin.email,
      role: NewAdmin.role

    }
  }
}

module.exports = controllerAdmin
