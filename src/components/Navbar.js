import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, BookOpen, Play } from 'lucide-react'

export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [liveClassCount, setLiveClassCount] = useState(0)

  // Fetch live class count for learners
  useEffect(() => {
    if (session?.user?.role === 'learner') {
      const fetchLiveCount = async () => {
        try {
          const response = await fetch('/api/classes/live')
          const data = await response.json()
          if (data.success) {
            setLiveClassCount(data.count)
          }
        } catch (error) {
          console.error('Error fetching live class count:', error)
        }
      }

      fetchLiveCount()
      // Update every 30 seconds
      const interval = setInterval(fetchLiveCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">LearnFlow</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {/* Navigation Links */}
                {session.user.role === 'learner' && (
                  <div className="flex items-center space-x-4 mr-4">
                    <Link
                      href="/learner/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/learner/live-classes"
                      className="flex items-center space-x-1 text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors relative"
                    >
                      <Play className="h-4 w-4" />
                      <span>Live Classes</span>
                      {liveClassCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {liveClassCount}
                        </span>
                      )}
                    </Link>
                  </div>
                )}

                {session.user.role === 'mentor' && (
                  <div className="flex items-center space-x-4 mr-4">
                    <Link
                      href="/mentor/dashboard"
                      className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="btn-secondary"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="btn-primary"
              >
                Sign In with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {session ? (
              <div className="space-y-3">
                {/* Mobile Navigation Links */}
                {session.user.role === 'learner' && (
                  <div className="space-y-2 mb-4">
                    <Link
                      href="/learner/dashboard"
                      className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/learner/live-classes"
                      className="flex items-center justify-between px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      <div className="flex items-center space-x-2">
                        <Play className="h-4 w-4" />
                        <span>Live Classes</span>
                      </div>
                      {liveClassCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {liveClassCount}
                        </span>
                      )}
                    </Link>
                  </div>
                )}

                {session.user.role === 'mentor' && (
                  <div className="space-y-2 mb-4">
                    <Link
                      href="/mentor/dashboard"
                      className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      Dashboard
                    </Link>
                  </div>
                )}

                <div className="flex items-center space-x-3 px-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="w-full btn-primary"
              >
                Sign In with Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}