import { CheckCircle } from 'lucide-react'
const features = [
  'Google Authentication for secure login',
  'Role-based access control',
  'Integrated Google Calendar scheduling',
  'Automatic Google Meet link generation',
  'Real-time class management',
  'Responsive design for all devices'
]
export default function Features() {
  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with modern technologies and best practices for a seamless learning experience.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              <span className="text-lg text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Sign In & Choose Role</h4>
              <p className="text-gray-600 text-sm">Login with Google and select if you're a mentor or learner</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Schedule or Browse</h4>
              <p className="text-gray-600 text-sm">Mentors schedule classes, learners browse available sessions</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Join & Learn</h4>
              <p className="text-gray-600 text-sm">Click to join Google Meet and start learning together</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}