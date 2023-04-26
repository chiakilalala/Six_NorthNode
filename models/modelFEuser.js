const { Schema, model } = require('mongoose')

const FSuserSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    nickName: { type: String, trim: true },
    phoneNumber: { type: String },
    birthday: { type: Date },
    profilePic: { type: String, default: '/images/profilePic.jpeg' },
    order: { type: Schema.Types.ObjectId, ref: 'Order' }
  },
  { timestamps: true }
)

const FSuser = model('FSuser', FSuserSchema)
module.exports = FSuser
