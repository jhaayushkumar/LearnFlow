import { google } from 'googleapis'

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
}

export function getGoogleCalendar(accessToken) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getBaseUrl() + '/api/auth/callback/google'
  )

  oauth2Client.setCredentials({
    access_token: accessToken
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function createCalendarEvent(accessToken, eventData) {
  try {
    const calendar = getGoogleCalendar(accessToken)

    const event = {
      summary: eventData.title,
      description: eventData.description || 'LearnFlow class session',
      start: {
        dateTime: eventData.startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: eventData.endTime,
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: `learnflow-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      },
      attendees: eventData.attendees || [],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 },
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all'
    })

    return {
      success: true,
      eventId: response.data.id,
      meetLink: response.data.conferenceData?.entryPoints?.[0]?.uri || response.data.hangoutLink,
      event: response.data
    }
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

export async function deleteCalendarEvent(accessToken, eventId) {
  try {
    const calendar = getGoogleCalendar(accessToken)
    
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
      sendUpdates: 'all'
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    return { success: false, error: error.message }
  }
}