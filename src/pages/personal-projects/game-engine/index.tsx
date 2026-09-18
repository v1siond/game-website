import Head from 'next/head'
import { ENGINE_URL } from '@/lib/engineUrl'

/**
 * Nebulith, framed. The engine moved to its own deployment, where Phoenix bundles and serves it, so
 * this page is the window it plays in and nothing else.
 *
 * The frame takes the WHOLE viewport deliberately. The editor measures the viewport to size its
 * panels and canvas, so a header, a wrapper or a max-width container makes every one of them wrong.
 * `fixed inset-0` keeps that true regardless of what _app puts around the page.
 */
export default function GameEnginePage() {
  return (
    <>
      <Head>
        <title>Nebulith - Alexander Pulido</title>
        <meta name="description" content="Nebulith, an ASCII tile-based game engine and editor." />
      </Head>
      <iframe
        src={`${ENGINE_URL}/games`}
        title="Nebulith game engine"
        allow="fullscreen; gamepad; clipboard-write"
        className="fixed inset-0 h-full w-full border-0"
      />
    </>
  )
}
