import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
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

    const { role } = req.body

    if (!role || !['mentor', 'learner'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' })
    }

    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { role },
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({ 
      success: true, 
      message: 'Role updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}