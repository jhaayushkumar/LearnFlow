import Head from 'next/head'
import Navbar from './Navbar'
import { DotPattern } from './ui/dot-pattern'

export default function Layout({ children, title = 'LearnFlow' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="relative min-h-screen font-sans selection:bg-primary-500/30">
        <DotPattern 
          dotSize={2}
          gap={32}
          baseColor="#333333"
          glowColor="#3b82f6"
          proximity={180}
          glowIntensity={0.8}
        />
        <div className="relative z-10">
          <Navbar />
          <main>{children}</main>
        </div>
      </div>
    </>
  )
}