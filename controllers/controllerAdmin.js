const Admin = require('../models/modelAdmin')
const serviceResponse = require('@/services/serviceResponse.js')
const bcrypt = require('bcryptjs')

const controllerAdmin = {
  async signUp (name, email, password) {
    const Passwordbcrypt = await bcrypt.hash(password, 12) // 密碼加密

    const newUser = await Admin.create({
      name, email, password: Passwordbcrypt

    })
    console.log(newUser)
    return newUser
  },
  async Login (email, password, role) {
    const OneAdmin = await Admin.findOne({ email }).select('+password') // 密碼補顯示
    const auth = await bcrypt.compare(password, OneAdmin.password)
    if (!auth) {
      throw serviceResponse.error(400, '密碼錯誤')
    }
    return {
      _id: OneAdmin._id,
      user: OneAdmin.name,
      email: OneAdmin.email

    }
  }
}

module.exports = controllerAdmin
