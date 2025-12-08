import ValtoriMVP from '../components/ValtoriMVP'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Valtori - AI-Powered Sales Training</title>
        <meta name="description" content="Practice sales calls with AI-powered customer simulation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ValtoriMVP />
    </>
  )
}
