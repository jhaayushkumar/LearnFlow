import mongoose from 'mongoose'
const ClassSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mentorName: {
    type: String,
    required: true
  },
  mentorEmail: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    index: true
  },
  endTime: {
    type: Date,
    required: true
  },
  meetLink: {
    type: String,
    required: true
  },
  googleEventId: {
    type: String
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxAttendees: {
    type: Number,
    default: 50
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
})
ClassSchema.index({ mentorId: 1, startTime: -1 })
ClassSchema.index({ isActive: 1, startTime: 1 })
ClassSchema.index({ startTime: 1, endTime: 1 })
ClassSchema.virtual('isLive').get(function() {
  const now = new Date()
  return now >= this.startTime && now <= this.endTime
})
ClassSchema.virtual('isUpcoming').get(function() {
  const now = new Date()
  return now < this.startTime
})
export default mongoose.models.Class || mongoose.model('Class', ClassSchema)