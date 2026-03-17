import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import Layout from '../components/Layout'
import { UserCheck, GraduationCap } from 'lucide-react'

export default function SetupRole() {
  const { data: session, update, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/')
      return
    }

    if (session.user?.role) {
      if (session.user.role === 'mentor') {
        router.push('/mentor/dashboard')
      } else {
        router.push('/learner/dashboard')
      }
    }
  }, [session, status, router])

  const handleRoleSelection = async (role) => {
    if (!session?.user?.email) return

    setLoading(true)
    try {
      const response = await fetch('/api/user/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      const data = await response.json()

      if (data.success) {
        await update({ role })
        toast.success(`Welcome ${role}!`)
        
        if (role === 'mentor') {
          router.push('/mentor/dashboard')
        } else {
          router.push('/learner/dashboard')
        }
      } else {
        toast.error(data.message || 'Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <Layout title="Loading - LearnFlow">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return null
  }

  if (session.user?.role) {
    return null
  }

  return (
    <Layout title="Choose Your Role - LearnFlow">
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Choose Your Role
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Select how you'd like to use LearnFlow
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection('mentor')}
              disabled={loading}
              className="w-full card hover:shadow-md transition-shadow duration-200 text-left disabled:opacity-50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <UserCheck className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">I'm a Mentor</h3>
                  <p className="text-sm text-gray-600">
                    Schedule and conduct live classes for learners
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelection('learner')}
              disabled={loading}
              className="w-full card hover:shadow-md transition-shadow duration-200 text-left disabled:opacity-50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">I'm a Learner</h3>
                  <p className="text-sm text-gray-600">
                    Browse and join live classes from mentors
                  </p>
                </div>
              </div>
            </button>
          </div>

          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}