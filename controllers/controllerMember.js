const hash = require('@/utilities/hash')
const modelMember = require('@/models/modelMember')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

const serviceJWT = require('@/services/serviceJWT')

const controllerMember = {
  // 註冊
  async signup ({ password, email, nickName }, next) {
    const newPassword = await hash.password(password)
    const data = {
      email,
      password: newPassword,
      nickName
    }
    const checkUser = await modelMember.findOne({ email: data.email })
    if (checkUser !== null) {
      throw serviceResponse.error(httpCode.NOT_ACCEPTABLE, '帳號已被使用')
    }
    const createRes = await modelMember.create(data)
    const signinToken = serviceJWT.generateJWT(createRes)
    const result = { token: signinToken, createRes }
    return result
  },
  // 登入
  async signin (email, password, next) {
    const signinRes = await modelMember.findOne({ email }).select('+password')

    if (signinRes === null) {
      throw serviceResponse.error(httpCode.NOT_FOUND, '帳號不存在')
    }

    const compare = await hash.compare(password, signinRes.password)

    if (!compare) {
      throw serviceResponse.error(httpCode.NOT_FOUND, '密碼錯誤')
    }

    const signinToken = serviceJWT.generateJWT(signinRes)

    signinRes.password = null

    const authData = {
      token: signinToken,
      signinRes
    }

    return authData
  },
  // 單純修改密碼
  async changePassword (user, password) {
    const newPassword = await hash.password(password)
    const editPassword = await modelMember.findByIdAndUpdate(user, { password: newPassword }, { returnDocument: 'after', runValidators: true })

    return editPassword
  },
  // 確認信箱是否重複
  async checkEmail (email, next) {
    const checkUser = await modelMember.findOne({ email })
    if (checkUser !== null) {
      throw serviceResponse.error(httpCode.NOT_ACCEPTABLE, '該信箱已被註冊')
    }

    const result = {
      message: `${email} 可以使用`
    }

    return result
  },
  // 取得會員資料
  async getUser (user) {
    const UserData = await modelMember.findById({ _id: user })
    return UserData
  },
  // 修改會員資料
  async updateUser ({ user, nickName, phoneNumber, birthday, profilePic }) {
    const result = await modelMember.findByIdAndUpdate(user, { nickName, phoneNumber, birthday, profilePic }, { returnDocument: 'after', runValidators: true, new: true })
    return result
  }
}

module.exports = controllerMember
