import Head from 'next/head'
import '../styles/globals.css'
import { ToastProvider } from '../components/Toast'
import FPSTracker from '../components/FPSTracker'
import localFont from "next/font/local";

const silkScreen = localFont({
  src: [
    {
      path: "../assets/fonts/Silkscreen-Regular.ttf",
      weight: '400',
      style: 'normal'
    },
    {
      path: "../assets/fonts/Silkscreen-Bold.ttf",
      weight: '700',
      style: 'normal'
    },
  ],
});

const permanentMarker = localFont({
  src: [
    {
      path: "../assets/fonts/PermanentMarker-Regular.ttf",
      weight: '400',
      style: 'normal'
    }
  ],
});

function GameWebsite({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Alexander Pulido - System Engineer, Musician, Martial Artist</title>
        <meta name="description" content="Portfolio of Alexander Pulido - Senior Full-Stack Developer specializing in Elixir, Phoenix, Vue.js, and Kubernetes. Also a drummer and martial artist." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
      </Head>
      <ToastProvider>
        <FPSTracker position="top-right" showGraph={true} defaultVisible={false} />
        <Component className={`${silkScreen.className} ${permanentMarker.className}`} {...pageProps} />
      </ToastProvider>
    </>
  )
}

export default GameWebsite