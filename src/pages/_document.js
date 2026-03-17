import { Html, Head, Main, NextScript } from 'next/document'
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="A streamlined platform for mentors to schedule live Google Meet classes and learners to join them." />
        <meta name="keywords" content="online learning, live classes, google meet, mentoring, education" />
        <meta name="author" content="LearnFlow Team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}