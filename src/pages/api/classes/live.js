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

    const now = new Date()
    
    const liveClasses = await Class.find({ 
      isActive: true,
      startTime: { $lte: now },
      endTime: { $gte: now }
    })
      .sort({ startTime: 1 })
      .lean()

    res.status(200).json({ 
      success: true, 
      classes: liveClasses,
      count: liveClasses.length,
      timestamp: now.toISOString()
    })
  } catch (error) {
    console.error('Error fetching live classes:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}