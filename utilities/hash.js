const bcrypt = require('bcryptjs')

const hash = {
  async password (password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  },
  async compaire (password, dbPassword) {
    const result = await bcrypt.compare(password, dbPassword)
    return result
  }
}

module.exports = hash
