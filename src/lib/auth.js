import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from './mongodb'
import User from '../models/User'
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/calendar.events',
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
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
        return true 
      }
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at * 1000
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
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  }
}
export default NextAuth(authOptions)