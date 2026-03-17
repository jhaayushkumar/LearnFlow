import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import Features from '../components/Features'
export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  useEffect(() => {
    if (session?.user) {
      if (!session.user.role) {
        router.push('/setup-role')
      } else if (session.user.role === 'mentor') {
        router.push('/mentor/dashboard')
      } else {
        router.push('/learner/dashboard')
      }
    }
  }, [session, router])
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
    </Layout>
  )
}