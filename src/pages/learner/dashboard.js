import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import ClassCard from '../../components/ClassCard'
import { BookOpen, Calendar, Users, Search, Filter, Clock, Play, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
export default function LearnerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [classes, setClasses] = useState([])
  const [myClasses, setMyClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('startTime')
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/')
      return
    }
    if (session.user.role !== 'learner') {
      router.push('/mentor/dashboard')
      return
    }
    fetchClasses()
    const interval = setInterval(fetchClasses, 30000)
    return () => clearInterval(interval)
  }, [session, status, router])
  const fetchClasses = async () => {
    try {
      const [allClassesRes, myClassesRes] = await Promise.all([
        fetch('/api/classes/all'),
        fetch('/api/classes/my-classes')
      ])
      const allClassesData = await allClassesRes.json()
      const myClassesData = await myClassesRes.json()
      if (allClassesData.success) {
        setClasses(allClassesData.classes)
      }
      if (myClassesData.success) {
        setMyClasses(myClassesData.classes)
      }
    } catch (error) {
      console.error('Error fetching classes:', error)
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }
  const handleJoinClass = async (classId) => {
    try {
      const response = await fetch('/api/classes/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ classId }),
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Successfully joined the class!')
        fetchClasses()
      } else {
        toast.error(data.message || 'Failed to join class')
      }
    } catch (error) {
      console.error('Error joining class:', error)
      toast.error('Something went wrong')
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
  const liveClasses = classes.filter(cls => {
    const start = new Date(cls.startTime)
    const end = new Date(cls.endTime)
    return now >= start && now <= end
  })
  const upcomingClasses = classes.filter(cls => new Date(cls.startTime) > now)
  const joinedClassIds = myClasses.map(cls => cls._id)
  const getFilteredClasses = () => {
    let filtered = classes
    switch (filter) {
      case 'live':
        filtered = liveClasses
        break
      case 'upcoming':
        filtered = upcomingClasses
        break
      case 'joined':
        filtered = myClasses
        break
      default:
        filtered = classes
    }
    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'mentor':
          return a.mentorName.localeCompare(b.mentorName)
        case 'startTime':
        default:
          return new Date(a.startTime) - new Date(b.startTime)
      }
    })
    return filtered
  }
  const filteredClasses = getFilteredClasses()
  return (
    <Layout title="Learner Dashboard - LearnFlow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session?.user?.name}
            </h1>
            <p className="text-gray-600">Discover and join live classes from amazing mentors</p>
          </div>
          {}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{classes.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">My Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{myClasses.length}</p>
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
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingClasses.length}</p>
                </div>
              </div>
            </div>
          </div>
          {}
          {liveClasses.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">
                      {liveClasses.length} Class{liveClasses.length > 1 ? 'es' : ''} Live Now!
                    </h3>
                    <p className="text-red-700">Don't miss out! Join the live sessions happening right now.</p>
                  </div>
                </div>
                <button
                  onClick={() => setFilter('live')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
                >
                  <Play className="h-4 w-4 mr-2" />
                  View Live Classes
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Search and Filter Controls */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Browse Classes</h2>
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes, mentors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Classes ({classes.length})</option>
                <option value="live">Live Now ({liveClasses.length})</option>
                <option value="upcoming">Upcoming ({upcomingClasses.length})</option>
                <option value="joined">My Classes ({myClasses.length})</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="startTime">Start Time</option>
                <option value="title">Class Title</option>
                <option value="mentor">Mentor Name</option>
              </select>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
        {/* Classes List */}
        <div className="mb-8">
          {filteredClasses.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </div>
              <div className="grid gap-6">
                {filteredClasses.map(cls => {
                  const isJoined = joinedClassIds.includes(cls._id)
                  return (
                    <div key={cls._id} className="relative">
                      {isJoined && (
                        <div className="absolute top-2 right-2 z-10">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            Joined
                          </span>
                        </div>
                      )}
                      <ClassCard
                        classData={cls}
                        onJoin={handleJoinClass}
                        isJoined={isJoined}
                      />
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="card text-center py-12">
              {searchTerm ? (
                <>
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                  <p className="text-gray-600 mb-4">
                    No classes match your search for "{searchTerm}"
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="btn-primary"
                  >
                    Clear Search
                  </button>
                </>
              ) : filter === 'live' ? (
                <>
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No live classes</h3>
                  <p className="text-gray-600">No classes are currently live. Check back later!</p>
                </>
              ) : filter === 'joined' ? (
                <>
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No joined classes</h3>
                  <p className="text-gray-600 mb-4">You haven't joined any classes yet</p>
                  <button
                    onClick={() => setFilter('all')}
                    className="btn-primary"
                  >
                    Browse All Classes
                  </button>
                </>
              ) : (
                <>
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No classes available</h3>
                  <p className="text-gray-600">Check back later for new classes from mentors</p>
                </>
              )}
            </div>
          )}
        </div>
        {}
        {myClasses.length > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-green-600" />
              Your Learning Journey
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setFilter('joined')}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Star className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">My Classes</h4>
                <p className="text-sm text-gray-600">View your joined classes</p>
              </button>
              <button
                onClick={() => setFilter('live')}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Play className="h-6 w-6 text-red-600 mb-2" />
                <h4 className="font-medium text-gray-900">Live Classes</h4>
                <p className="text-sm text-gray-600">Join classes happening now</p>
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className="text-left p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Upcoming Classes</h4>
                <p className="text-sm text-gray-600">Discover new learning opportunities</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}