import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
import Class from '../../../models/Class'
import User from '../../../models/User'
export default async function handler(req, res) {
  if (req.method !== 'GET') {
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
    const classes = await Class.find({ 
      attendees: user._id,
      isActive: true
    })
      .sort({ startTime: 1 })
      .lean()
    res.status(200).json({ 
      success: true, 
      classes
    })
  } catch (error) {
    console.error('Error fetching user classes:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}