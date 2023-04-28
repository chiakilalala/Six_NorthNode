const hash = require('@/utilities/hash')
const modelFEuser = require('@/models/modelFEuser')
const serviceResponse = require('@/services/serviceResponse')
const httpCode = require('@/utilities/httpCode')

const serviceJWT = require('@/services/serviceJWT')

const controllerFrontSideUser = {
  // 註冊
  async signup (req, res, next) {
    const { password, email } = req.body
    const newPassword = await hash.password(password)
    const data = {
      email,
      password: newPassword
    }
    const checkUser = await modelFEuser.findOne({ email: data.email })
    if (checkUser !== null) {
      return next(serviceResponse.error(httpCode.NOT_ACCEPTABLE, '帳號已被使用'))
    }
    const result = await modelFEuser.create(data)
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
    const dbRes = await modelFEuser.findOne({ email: userData.email }).select('+password')
    if (dbRes === null) {
      return next(serviceResponse.error(httpCode.NOT_FOUND, '帳號不存在'))
    }
    const compaire = await hash.compaire(userData.password, dbRes.password)
    if (!compaire) {
      return next(serviceResponse.error(httpCode.NOT_FOUND, '密碼錯誤'))
    }

    const signinToken = serviceJWT.generateJWT(dbRes)

    const authData = {
      token: `Bearer ${signinToken}`,
      id: dbRes.id,
      email: dbRes.email
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
    const editUser = await modelFEuser.findByIdAndUpdate(user, { password: newPassword }, { returnDocument: 'after', runValidators: true })

    return editUser
  },
  // 確認信箱是否重複
  async checkEmail (req, res, next) {
    const { email } = req.body
    const data = { email }
    const checkUser = await modelFEuser.findOne({ email: data.email })
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
    const UserData = await modelFEuser.findById({ _id: user })
    return UserData
  }
}

module.exports = controllerFrontSideUser
