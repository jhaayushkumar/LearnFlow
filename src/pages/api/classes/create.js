import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../../lib/auth'
import connectDB from '../../../lib/mongodb'
import Class from '../../../models/Class'
import User from '../../../models/User'
import { createCalendarEvent } from '../../../lib/google-calendar'
// Google Meet link generation is now handled via Google Calendar API
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
    const { title, description, startTime, endTime, maxAttendees, customMeetLink } = req.body
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
    let meetLink = customMeetLink
    let googleEventId = null
    let googleCalendarIntegrated = false

    let calendarError = null
    if (!meetLink && session.accessToken) {
      const calendarResult = await createCalendarEvent(session.accessToken, {
        title,
        description,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      })

      if (calendarResult.success) {
        meetLink = calendarResult.meetLink
        googleEventId = calendarResult.eventId
        googleCalendarIntegrated = true
      } else {
        calendarError = calendarResult.error
      }
    }

    // Require a meet link
    if (!meetLink) {
        return res.status(400).json({ 
            success: false, 
            message: `Could not generate a Google Meet link. ${calendarError || 'No access token available. Please re-login.'}`,
            error: calendarError
        })
    }
    console.log('Class will be created with Meet Link:', meetLink)

    const newClass = await Class.create({
      title: title.trim(),
      description: description?.trim(),
      mentorId: user._id,
      mentorName: user.name,
      mentorEmail: user.email,
      startTime: start,
      endTime: end,
      meetLink,
      googleEventId, 
      maxAttendees: maxAttendees || 50,
      attendees: []
    })

    res.status(201).json({ 
      success: true, 
      message: googleCalendarIntegrated ? 'Class scheduled with Google Calendar!' : `Class scheduled (Meet Link Generation failed: ${calendarError || 'No access token'})`,
      class: newClass,
      googleCalendarIntegrated,
      error: calendarError
    })
  } catch (error) {
    console.error('Error creating class:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}