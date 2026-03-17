import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['mentor', 'learner'],
    default: null
  }
}, {
  timestamps: true
})

UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

export default mongoose.models.User || mongoose.model('User', UserSchema)