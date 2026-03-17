import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, BookOpen, Play, Sun, Moon } from 'lucide-react'
export default function Navbar() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [liveClassCount, setLiveClassCount] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }
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
          {}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {}
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
                  <button
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Toggle Theme"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
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
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors mr-2"
                  title="Toggle Theme"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => signIn('google')}
                  className="btn-primary"
                >
                  Sign In with Google
                </button>
              </>
            )}
          </div>
          {}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {session ? (
              <div className="space-y-3">
                {}
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
                <div className="flex items-center justify-between px-2 mb-2">
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
                    onClick={toggleTheme}
                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-full"
                  >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </button>
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center w-full px-2 py-2">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:bg-gray-100 rounded p-2 flex-1"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </button>
                </div>
                <button
                  onClick={() => signIn('google')}
                  className="w-full btn-primary"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}