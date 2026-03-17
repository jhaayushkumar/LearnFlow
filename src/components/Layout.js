import Head from 'next/head'
import Navbar from './Navbar'

export default function Layout({ children, title = 'LearnFlow' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>{children}</main>
      </div>
    </>
  )
}