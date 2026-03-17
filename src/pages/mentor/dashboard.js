import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import CreateClassModal from '../../components/CreateClassModal'
import ClassCard from '../../components/ClassCard'
import { Plus, Calendar, Users, Clock, TrendingUp, Filter } from 'lucide-react'
export default function MentorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState('all') 
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }
    if (session.user.role !== 'mentor') {
      router.push('/learner/dashboard')
      return
    }
    fetchClasses()
  }, [session, status, router])
  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes/mentor')
      const data = await response.json()
      if (data.success) {
        setClasses(data.classes)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }
  const handleClassCreated = (newClass) => {
    setClasses(prev => [newClass, ...prev])
    setShowCreateModal(false)
  }
  const handleDeleteClass = async (classId) => {
    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success) {
        setClasses(prev => prev.filter(cls => cls._id !== classId))
      }
    } catch (error) {
      console.error('Error deleting class:', error)
    }
  }
  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }
  const now = new Date()
  const upcomingClasses = classes.filter(cls => new Date(cls.startTime) > now)
  const liveClasses = classes.filter(cls => {
    const start = new Date(cls.startTime)
    const end = new Date(cls.endTime)
    return now >= start && now <= end
  })
  const pastClasses = classes.filter(cls => new Date(cls.endTime) < now)
  const totalAttendees = classes.reduce((sum, cls) => sum + (cls.attendees?.length || 0), 0)
  const getFilteredClasses = () => {
    switch (filter) {
      case 'upcoming': return upcomingClasses
      case 'live': return liveClasses
      case 'past': return pastClasses
      default: return classes
    }
  }
  const filteredClasses = getFilteredClasses()
  return (
    <Layout title="Mentor Dashboard - LearnFlow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name}
              </h1>
              <p className="text-gray-600">Manage your classes and schedule new sessions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
            >
              <Plus className="h-5 w-5" />
              <span>Schedule Class</span>
            </button>
          </div>
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Live Now</p>
                  <p className="text-2xl font-bold text-gray-900">{liveClasses.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{totalAttendees}</p>
                </div>
              </div>
            </div>
          </div>
          {}
          {liveClasses.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                <div>
                  <h3 className="text-lg font-semibold text-red-800">
                    {liveClasses.length} Class{liveClasses.length > 1 ? 'es' : ''} Live Now!
                  </h3>
                  <p className="text-red-700">Your students are waiting. Join your live classes.</p>
                </div>
              </div>
            </div>
          )}
        </div>
        {}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Classes ({classes.length})</option>
                <option value="live">Live Now ({liveClasses.length})</option>
                <option value="upcoming">Upcoming ({upcomingClasses.length})</option>
                <option value="past">Past ({pastClasses.length})</option>
              </select>
            </div>
          </div>
          {}
          {filteredClasses.length > 0 ? (
            <div className="grid gap-6">
              {filteredClasses.map(cls => (
                <ClassCard
                  key={cls._id}
                  classData={cls}
                  isMentor={true}
                  onDelete={handleDeleteClass}
                  isPast={filter === 'past'}
                />
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              {filter === 'all' ? (
                <>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
                  <p className="text-gray-600 mb-4">Schedule your first class to get started</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                  >
                    Schedule Your First Class
                  </button>
                </>
              ) : (
                <>
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No {filter} classes
                  </h3>
                  <p className="text-gray-600">
                    {filter === 'upcoming' && 'Schedule new classes to see them here'}
                    {filter === 'live' && 'No classes are currently live'}
                    {filter === 'past' && 'Your completed classes will appear here'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
        {}
        {classes.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Plus className="h-6 w-6 text-primary-600 mb-2" />
                <h4 className="font-medium text-gray-900">Schedule New Class</h4>
                <p className="text-sm text-gray-600">Create another learning session</p>
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Clock className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">View Upcoming</h4>
                <p className="text-sm text-gray-600">Check your scheduled classes</p>
              </button>
              <button
                onClick={() => setFilter('past')}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Calendar className="h-6 w-6 text-gray-600 mb-2" />
                <h4 className="font-medium text-gray-900">View History</h4>
                <p className="text-sm text-gray-600">See your completed classes</p>
              </button>
            </div>
          </div>
        )}
      </div>
      {showCreateModal && (
        <CreateClassModal
          onClose={() => setShowCreateModal(false)}
          onClassCreated={handleClassCreated}
        />
      )}
    </Layout>
  )
}