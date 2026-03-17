import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900">LearnFlow</span>
          </div>
          
          <div className="flex space-x-6 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary-600 transition-colors">Terms of Service</Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            © {new Date().getFullYear()} LearnFlow. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
