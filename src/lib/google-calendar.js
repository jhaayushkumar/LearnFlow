import { google } from 'googleapis'
const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:3000`
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
    console.log('Inserting event with conference data...')
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
    })
    
    console.log('Calendar API Response status:', response.status)
    
    // Check various places for the meet link
    const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.find(ep => ep.entryPointType === 'video')?.uri;

    if (!meetLink) {
      console.warn('Event created but NO MEET LINK was generated. Check if Google Calendar API has "Manage your own events and conference data" enabled.')
      return {
        success: false,
        error: 'Event created but Google failed to generate a Meet link. Please ensure your Google app has conference support enabled or try again.',
        eventId: response.data.id
      }
    }

    console.log('Meet Link successfully generated:', meetLink)

    return {
      success: true,
      eventId: response.data.id,
      meetLink: meetLink,
      event: response.data
    }
  } catch (error) {
    console.error('CRITICAL: Error creating calendar event:', error)
    // Extract actual error message from Google API
    const errorMsg = error.response?.data?.error?.message || error.message;
    return {
      success: false,
      error: errorMsg
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