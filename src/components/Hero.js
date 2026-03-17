import { signIn } from 'next-auth/react'
import { Video, Calendar, Users } from 'lucide-react'

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Schedule & Join
            <span className="text-primary-600 block">Live Classes</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A streamlined platform for mentors to schedule live Google Meet classes 
            and learners to join them seamlessly.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => signIn('google')}
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started with Google
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">Schedule classes with integrated Google Calendar</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Google Meet Integration</h3>
              <p className="text-gray-600">Automatic Google Meet links for all classes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">Separate dashboards for mentors and learners</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}