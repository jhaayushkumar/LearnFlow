import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Hero from '../components/Hero'
import Features from '../components/Features'
import RoleSelectionModal from '../components/RoleSelectionModal'
import RoleSelectionModal from '../components/RoleSelectionModal'
import { useState } from 'react'
export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session?.user?.role) {
      if (session.user.role === 'mentor') {
        router.push('/mentor/dashboard')
      } else {
        router.push('/learner/dashboard')
      }
    }
  }, [session, router])

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(true)
  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    )
  }
  if (session) {
    return null 
  }
  return (
    <Layout>
      <Hero />
      <Features />
      {session && !session.user.role && (
        <RoleSelectionModal 
          isOpen={isRoleModalOpen} 
          onClose={() => setIsRoleModalOpen(false)} 
        />
      )}
    </Layout>
  )
}