import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
import Class from '../../../models/Class'
import User from '../../../models/User'
export default async function handler(req, res) {
  const { id } = req.query
  if (req.method === 'DELETE') {
    try {
      const session = await getServerSession(req, res, authOptions)
      if (!session?.user?.email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
      }
      await connectDB()
      const user = await User.findOne({ email: session.user.email })
      if (!user || user.role !== 'mentor') {
        return res.status(403).json({ success: false, message: 'Only mentors can delete classes' })
      }
      const classToDelete = await Class.findById(id)
      if (!classToDelete) {
        return res.status(404).json({ success: false, message: 'Class not found' })
      }
      if (classToDelete.mentorId.toString() !== user._id.toString()) {
        return res.status(403).json({ success: false, message: 'You can only delete your own classes' })
      }
      await Class.findByIdAndDelete(id)
      res.status(200).json({ 
        success: true, 
        message: 'Class deleted successfully'
      })
    } catch (error) {
      console.error('Error deleting class:', error)
      res.status(500).json({ success: false, message: 'Internal server error' })
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
}