import mongoose from 'mongoose'

const Schema = mongoose.Schema

/**
 * User Schema
 */
const User = new Schema ({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    default: '',
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

User.set ('toJSON', {getters: true, virtuals: false})

const UserModel = mongoose.model ('User', User)

export default UserModel