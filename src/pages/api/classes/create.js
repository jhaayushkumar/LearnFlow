import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
import Class from '../../../models/Class'
import User from '../../../models/User'
const generateMeetLink = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  const part1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  const part3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `https:
}
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
    if (!user || user.role !== 'mentor') {
      return res.status(403).json({ success: false, message: 'Only mentors can create classes' })
    }
    const { title, description, startTime, endTime, maxAttendees } = req.body
    if (!title || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Title, start time, and end time are required' })
    }
    const start = new Date(startTime)
    const end = new Date(endTime)
    const now = new Date()
    if (start <= now) {
      return res.status(400).json({ success: false, message: 'Start time must be in the future' })
    }
    if (end <= start) {
      return res.status(400).json({ success: false, message: 'End time must be after start time' })
    }
    const durationHours = (end - start) / (1000 * 60 * 60)
    if (durationHours > 4) {
      return res.status(400).json({ success: false, message: 'Class duration cannot exceed 4 hours' })
    }
    const meetLink = generateMeetLink()
    const newClass = await Class.create({
      title: title.trim(),
      description: description?.trim(),
      mentorId: user._id,
      mentorName: user.name,
      mentorEmail: user.email,
      startTime: start,
      endTime: end,
      meetLink,
      googleEventId: null, 
      maxAttendees: maxAttendees || 50,
      attendees: []
    })
    res.status(201).json({ 
      success: true, 
      message: 'Class created successfully',
      class: newClass,
      googleCalendarIntegrated: false 
    })
  } catch (error) {
    console.error('Error creating class:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}