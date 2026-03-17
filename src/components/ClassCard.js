import { format } from 'date-fns'
import { Calendar, Clock, Users, ExternalLink, Trash2, Star, Play, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
export default function ClassCard({ classData, isMentor = false, isPast = false, onDelete, onJoin, isJoined = false }) {
  const startTime = new Date(classData.startTime)
  const endTime = new Date(classData.endTime)
  const now = new Date()
  const isLive = now >= startTime && now <= endTime
  const isUpcoming = now < startTime
  const timeUntilStart = startTime - now
  const minutesUntilStart = Math.floor(timeUntilStart / (1000 * 60))
  const handleJoinClass = () => {
    if (classData.meetLink) {
      window.open(classData.meetLink, '_blank')
      if (onJoin && !isJoined) {
        onJoin(classData._id)
      }
    } else {
      toast.error('Meeting link not available')
    }
  }
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      onDelete(classData._id)
    }
  }
  const getTimeStatus = () => {
    if (isLive) {
      return { text: 'LIVE NOW', color: 'bg-red-500 text-white animate-pulse' }
    } else if (isUpcoming && minutesUntilStart <= 60) {
      return { text: `Starts in ${minutesUntilStart}m`, color: 'bg-orange-500 text-white' }
    } else if (isUpcoming) {
      return { text: 'Upcoming', color: 'bg-blue-500 text-white' }
    } else {
      return { text: 'Completed', color: 'bg-gray-500 text-white' }
    }
  }
  const timeStatus = getTimeStatus()
  return (
    <div className={`card transition-all duration-200 hover:shadow-lg ${
      isLive ? 'border-red-500 bg-red-50' : 
      isJoined ? 'border-green-500 bg-green-50' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-4">
              {classData.title}
            </h3>
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${timeStatus.color}`}>
              {timeStatus.text}
            </span>
          </div>
          {classData.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{classData.description}</p>
          )}
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{format(startTime, 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>
            {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')}
            {isUpcoming && minutesUntilStart <= 60 && minutesUntilStart > 0 && (
              <span className="ml-2 text-orange-600 font-medium">
                (Starts in {minutesUntilStart} minutes)
              </span>
            )}
          </span>
        </div>
        {!isMentor && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Mentor: {classData.mentorName}</span>
          </div>
        )}
        {isMentor && (
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>
              {classData.attendees?.length || 0} / {classData.maxAttendees} students
              {classData.attendees?.length >= classData.maxAttendees && (
                <span className="ml-2 text-red-600 font-medium">(Full)</span>
              )}
            </span>
          </div>
        )}
      </div>
      {}
      <div className="flex space-x-2">
        {!isPast && (
          <>
            {!isMentor && !isJoined && !isLive && (
              <button
                onClick={() => onJoin && onJoin(classData._id)}
                className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-700 text-white"
                disabled={classData.attendees?.length >= classData.maxAttendees}
              >
                <Star className="h-4 w-4" />
                <span>
                  {classData.attendees?.length >= classData.maxAttendees ? 'Class Full' : 'Join Class'}
                </span>
              </button>
            )}
            {(isMentor || isJoined || isLive) && (
              <button
                onClick={handleJoinClass}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isLive
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
                disabled={!isMentor && !isJoined && isLive && classData.attendees?.length >= classData.maxAttendees}
              >
                {isLive ? (
                  <>
                    <Play className="h-4 w-4" />
                    <span>Join Live Class</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4" />
                    <span>Go to Class</span>
                  </>
                )}
              </button>
            )}
          </>
        )}
        {isMentor && onDelete && !isPast && (
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete class"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {}
      {isPast && (
        <div className="mt-3 text-center">
          <span className="text-sm text-gray-500 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Class completed
          </span>
        </div>
      )}
      {!isMentor && isJoined && !isPast && (
        <div className="mt-3 text-center">
          <span className="text-sm text-green-600 flex items-center justify-center font-medium">
            <Star className="h-4 w-4 mr-1" />
            You've joined this class
          </span>
        </div>
      )}
      {!isMentor && classData.attendees?.length >= classData.maxAttendees && !isJoined && (
        <div className="mt-3 text-center">
          <span className="text-sm text-red-600 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            Class is full
          </span>
        </div>
      )}
    </div>
  )
}