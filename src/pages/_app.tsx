import type { AppProps } from 'next/app'
import '../styles/globals.css'

// The Pages Router serves only the error pages; each sets its own head, so the shell adds the shared styles alone.
export default function GameWebsite({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
