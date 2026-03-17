import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
import Class from '../../../models/Class'
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
    const classes = await Class.find({ 
      isActive: true,
      startTime: { $gte: new Date(Date.now() - 2 * 60 * 60 * 1000) }
    })
      .sort({ startTime: 1 })
      .lean()
    res.status(200).json({ 
      success: true, 
      classes
    })
  } catch (error) {
    console.error('Error fetching all classes:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}