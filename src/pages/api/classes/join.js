import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
import Class from '../../../models/Class'
import User from '../../../models/User'
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }
    const { classId } = req.body
    if (!classId) {
      return res.status(400).json({ success: false, message: 'Class ID is required' })
    }
    const classToJoin = await Class.findById(classId)
    if (!classToJoin) {
      return res.status(404).json({ success: false, message: 'Class not found' })
    }
    if (!classToJoin.isActive) {
      return res.status(400).json({ success: false, message: 'Class is not active' })
    }
    if (classToJoin.attendees.includes(user._id)) {
      return res.status(200).json({ 
        success: true, 
        message: 'Already joined this class'
      })
    }
    if (classToJoin.attendees.length >= classToJoin.maxAttendees) {
      return res.status(400).json({ success: false, message: 'Class is full' })
    }
    await Class.findByIdAndUpdate(classId, {
      $addToSet: { attendees: user._id }
    })
    res.status(200).json({ 
      success: true, 
      message: 'Successfully joined the class'
    })
  } catch (error) {
    console.error('Error joining class:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}