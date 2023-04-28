const hash = require('@/utilities/hash')
const modelMember = require('@/models/modelMember')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

const serviceJWT = require('@/services/serviceJWT')

const controllerMember = {
  // 註冊
  async signup (req, res, next) {
    const { password, email, nickName } = req.body
    const newPassword = await hash.password(password)
    const data = {
      email,
      password: newPassword,
      nickName
    }
    const checkUser = await modelMember.findOne({ email: data.email })
    if (checkUser !== null) {
      return next(serviceResponse.error(httpCode.NOT_ACCEPTABLE, '帳號已被使用'))
    }
    const createRes = await modelMember.create(data)
    const signinToken = serviceJWT.generateJWT(createRes)
    const result = { token: `Bearer ${signinToken}`, createRes }
    return result
  },
  // 登入
  async signin (req, res, next) {
    const { email, password } = req.body
    const userData = {
      email, password
    }
    if (!userData.email || !userData.password) {
      return next(serviceResponse.error(httpCode.PAYMENT_REQUIRED, '帳號密碼必填'))
    }
    const signinRes = await modelMember.findOne({ email: userData.email }).select('+password')
    if (signinRes === null) {
      return next(serviceResponse.error(httpCode.NOT_FOUND, '帳號不存在'))
    }
    const compaire = await hash.compaire(userData.password, signinRes.password)
    if (!compaire) {
      return next(serviceResponse.error(httpCode.NOT_FOUND, '密碼錯誤'))
    }

    const signinToken = serviceJWT.generateJWT(signinRes)
    signinRes.password = null
    const authData = {
      token: `Bearer ${signinToken}`,
      signinRes
    }

    return authData
  },
  // 單純修改密碼
  async changePassword (req, res, next) {
    // 從jwt取得使用者id
    const { user } = req
    const { password, confirmPassword } = req.body
    if (!password || !confirmPassword) {
      next(serviceResponse.error(httpCode.PAYMENT_REQUIRED, '密碼不能為空'))
    }
    if (password !== confirmPassword) {
      next(serviceResponse.error(httpCode.NOT_ACCEPTABLE, '密碼不一致'))
    }
    const newPassword = await hash.password(password)
    const editUser = await modelMember.findByIdAndUpdate(user, { password: newPassword }, { returnDocument: 'after', runValidators: true })

    return editUser
  },
  // 確認信箱是否重複
  async checkEmail (req, res, next) {
    const { email } = req.body
    const data = { email }
    const checkUser = await modelMember.findOne({ email: data.email })
    if (checkUser !== null) {
      return next(serviceResponse.error(httpCode.NOT_ACCEPTABLE, '信箱重複'))
    }

    const result = {
      message: `${email} 可以使用`
    }

    return result
  },
  // 取得會員資料
  async getUser (req, res, next) {
    // 從jwt取得使用者id
    const { user } = req
    const UserData = await modelMember.findById({ _id: user })
    return UserData
  },
  // 修改會員資料
  async updateUser (data) {
    const { user, nickName, phoneNumber, birthday, profilePic } = data
    const result = await modelMember.findByIdAndUpdate(user, { nickName, phoneNumber, birthday, profilePic }, { returnDocument: 'after', runValidators: true, new: true })
    return result
  }
}

module.exports = controllerMember
