import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { X, Calendar, Clock, Users, AlertCircle } from 'lucide-react'
export default function CreateClassModal({ onClose, onClassCreated }) {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()
  const startTime = watch('startTime')
  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const start = new Date(data.startTime)
      const end = new Date(data.endTime)
      const now = new Date()
      if (start <= now) {
        toast.error('Start time must be in the future')
        setLoading(false)
        return
      }
      if (end <= start) {
        toast.error('End time must be after start time')
        setLoading(false)
        return
      }
      const durationHours = (end - start) / (1000 * 60 * 60)
      if (durationHours > 4) {
        toast.error('Class duration cannot exceed 4 hours')
        setLoading(false)
        return
      }
      if (durationHours < 0.25) {
        toast.error('Class must be at least 15 minutes long')
        setLoading(false)
        return
      }
      const response = await fetch('/api/classes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          startTime: start,
          endTime: end,
          maxAttendees: parseInt(data.maxAttendees) || 50
        }),
      })
      const result = await response.json()
      if (result.success) {
        toast.success(
          result.googleCalendarIntegrated 
            ? 'Class scheduled with Google Calendar!' 
            : 'Class scheduled successfully!'
        )
        onClassCreated(result.class)
        reset()
      } else {
        toast.error(result.message || 'Failed to create class')
      }
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }
  const getMinEndTime = () => {
    if (!startTime) return ''
    const start = new Date(startTime)
    start.setMinutes(start.getMinutes() + 15)
    return start.toISOString().slice(0, 16)
  }
  const getSuggestedEndTime = () => {
    if (!startTime) return ''
    const start = new Date(startTime)
    start.setHours(start.getHours() + 1)
    return start.toISOString().slice(0, 16)
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
            Schedule New Class
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Title *
            </label>
            <input
              type="text"
              {...register('title', { 
                required: 'Title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' },
                maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
              })}
              className="input-field"
              placeholder="e.g., React Basics, JavaScript Fundamentals"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.title.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description', {
                maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
              })}
              rows={3}
              className="input-field"
              placeholder="Brief description of what you'll cover in this class..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 inline mr-1" />
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('startTime', { required: 'Start time is required' })}
                className="input-field"
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="h-4 w-4 inline mr-1" />
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                {...register('endTime', { required: 'End time is required' })}
                className="input-field"
                min={getMinEndTime()}
                defaultValue={getSuggestedEndTime()}
              />
              {errors.endTime && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.endTime.message}
                </p>
              )}
              {startTime && (
                <p className="text-xs text-gray-500 mt-1">
                  Suggested: {getSuggestedEndTime() && new Date(getSuggestedEndTime()).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="h-4 w-4 inline mr-1" />
              Maximum Attendees
            </label>
            <select
              {...register('maxAttendees')}
              className="input-field"
            >
              <option value="10">10 students</option>
              <option value="25">25 students</option>
              <option value="50">50 students (default)</option>
              <option value="100">100 students</option>
            </select>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Instant Google Meet Link</p>
                <p>A professional Google Meet link will be generated instantly for your class, accessible by all your students.</p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}