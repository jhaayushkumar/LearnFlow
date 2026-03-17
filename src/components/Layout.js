import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'

export default function Layout({ children, title = 'LearnFlow' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Toaster position="top-center" reverseOrder={false} />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </>
  )
}