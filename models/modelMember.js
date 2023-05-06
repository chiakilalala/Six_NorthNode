const { Schema, model } = require('mongoose')

const memberSchema = new Schema(
  {
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, select: false },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    nickName: { type: String, trim: true },
    phoneNumber: { type: String },
    birthday: { type: Date },
    profilePic: { type: String, default: '' },
    order: { type: Schema.Types.ObjectId, ref: 'Order' }
  },
  { timestamps: true }
)

const member = model('member', memberSchema)
module.exports = member
