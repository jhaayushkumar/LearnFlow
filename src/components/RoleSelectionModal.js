import { useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { UserCheck, GraduationCap, ArrowRight } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function RoleSelectionModal({ isOpen, onClose }) {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)

  if (!isOpen) return null

  const handleRoleSelection = async (role) => {
    setSelectedRole(role)
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
        toast.success(`Welcome to LearnFlow, ${role}!`)
        if (role === 'mentor') {
          router.push('/mentor/dashboard')
        } else {
          router.push('/learner/dashboard')
        }
        onClose()
      } else {
        toast.error(data.message || 'Failed to update role')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Visual/Context */}
          <div className="w-full md:w-5/12 bg-primary-600 p-8 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold leading-tight mb-4 text-white">Join the Community</h2>
              <p className="text-primary-100 text-sm opacity-90">
                Choose your learning journey. Whether you're here to share knowledge or gain it, we've got a place for you.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary-500 rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Right Side: Options */}
          <div className="w-full md:w-7/12 p-8 bg-gray-50/50">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Who are you?</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => handleRoleSelection('mentor')}
                disabled={loading}
                className={`w-full group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedRole === 'mentor' 
                    ? 'border-primary-600 bg-primary-50 ring-4 ring-primary-100' 
                    : 'border-white bg-white hover:border-primary-200 hover:shadow-lg shadow-sm'
                } disabled:opacity-50`}
              >
                <div className="flex-shrink-0 bg-primary-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <UserCheck className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-primary-700 transition-colors">I'm a Mentor</h4>
                  <p className="text-xs text-gray-500 italic">Schedule & conduct live classes</p>
                </div>
                <ArrowRight className={`h-5 w-5 ${selectedRole === 'mentor' ? 'text-primary-600 translate-x-1' : 'text-gray-300 opacity-0 group-hover:opacity-100'} transition-all`} />
              </button>

              <button
                onClick={() => handleRoleSelection('learner')}
                disabled={loading}
                className={`w-full group relative flex items-center p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                  selectedRole === 'learner' 
                    ? 'border-green-600 bg-green-50 ring-4 ring-green-100' 
                    : 'border-white bg-white hover:border-green-200 hover:shadow-lg shadow-sm'
                } disabled:opacity-50`}
              >
                <div className="flex-shrink-0 bg-green-100 p-3 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4 flex-grow">
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors">I'm a Learner</h4>
                  <p className="text-xs text-gray-500 italic">Browse & join live sessions</p>
                </div>
                <ArrowRight className={`h-5 w-5 ${selectedRole === 'learner' ? 'text-green-600 translate-x-1' : 'text-gray-300 opacity-0 group-hover:opacity-100'} transition-all`} />
              </button>
            </div>

            {loading && (
              <div className="mt-6 flex items-center justify-center space-x-2 text-primary-600 animate-pulse">
                <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                <div className="h-2 w-2 bg-primary-600 rounded-full delay-75"></div>
                <div className="h-2 w-2 bg-primary-600 rounded-full delay-150"></div>
                <span className="text-xs font-medium ml-2 uppercase tracking-widest italic">Setting up...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
