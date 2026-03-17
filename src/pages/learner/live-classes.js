import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import ClassCard from '../../components/ClassCard'
import { Play, Clock, Users, ArrowLeft, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
export default function LiveClasses() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [liveClasses, setLiveClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
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
    fetchLiveClasses()
    const interval = setInterval(fetchLiveClasses, 30000)
    return () => clearInterval(interval)
  }, [session, status, router])
  const fetchLiveClasses = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    try {
      const response = await fetch('/api/classes/live')
      const data = await response.json()
      if (data.success) {
        setLiveClasses(data.classes)
      } else {
        toast.error('Failed to load live classes')
      }
    } catch (error) {
      console.error('Error fetching live classes:', error)
      toast.error('Failed to load live classes')
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
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
        fetchLiveClasses()
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
  return (
    <Layout title="Live Classes - LearnFlow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/learner/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                  Live Classes
                </h1>
                <p className="text-gray-600">Join classes happening right now</p>
              </div>
            </div>
            <button
              onClick={() => fetchLiveClasses(true)}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
          {}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
              <div>
                <h3 className="text-lg font-semibold text-red-800">
                  {liveClasses.length} Class{liveClasses.length !== 1 ? 'es' : ''} Live Now
                </h3>
                <p className="text-red-700">
                  {liveClasses.length > 0 
                    ? "Don't miss out! These classes are happening right now."
                    : "No classes are currently live. Check back later or browse upcoming classes."
                  }
                </p>
              </div>
            </div>
          </div>
          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <Play className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Live Classes</p>
                  <p className="text-2xl font-bold text-gray-900">{liveClasses.length}</p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {liveClasses.reduce((sum, cls) => sum + (cls.attendees?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Auto Refresh</p>
                  <p className="text-2xl font-bold text-gray-900">30s</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {}
        <div className="mb-8">
          {liveClasses.length > 0 ? (
            <>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Classes Happening Now
                </h2>
                <p className="text-sm text-gray-600">
                  Click "Join Live Class" to enter the Google Meet session
                </p>
              </div>
              <div className="grid gap-6">
                {liveClasses.map(cls => (
                  <ClassCard
                    key={cls._id}
                    classData={cls}
                    onJoin={handleJoinClass}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="card text-center py-16">
              <div className="mb-6">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Live Classes</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  There are no classes happening right now. Check back later or browse upcoming classes to join.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/learner/dashboard"
                  className="btn-primary"
                >
                  Browse All Classes
                </Link>
                <button
                  onClick={() => fetchLiveClasses(true)}
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Check Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
        {}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Tips for Live Classes
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-1">Before Joining:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Test your microphone and camera</li>
                <li>• Find a quiet space</li>
                <li>• Have a notebook ready</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">During Class:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Mute yourself when not speaking</li>
                <li>• Use chat for questions</li>
                <li>• Be respectful to others</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}