import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from './mongodb'
import User from '../models/User'

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      
      if (session?.user?.email) {
        try {
          await connectDB()
          const dbUser = await User.findOne({ email: session.user.email })
          if (dbUser) {
            session.user.id = dbUser._id.toString()
            session.user.role = dbUser.role
          }
        } catch (error) {
          console.error('Error fetching user session:', error)
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (account.provider === 'google') {
        try {
          await connectDB()
          
          const existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              role: null
            })
          }
          
          return true
        } catch (error) {
          console.error('Error saving user:', error)
          return false
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)