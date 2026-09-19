import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef } from 'react'

import { ENGINE_URL } from '@/lib/engineUrl'

/**
 * Nebulith, framed, at whatever route you asked for.
 *
 * *"game-engine/games/<some_id> should load that in the iframe, same wit /games alone ... all the previous
 * game-engine routes should work, but passing it to the iframe instead of directly loading stuff"*.
 *
 * So this is a catch-all. Everything after `/personal-projects/game-engine` is handed to the frame as the
 * engine's own path, which makes every engine route reachable by URL and, more to the point, shareable: a
 * link to one level is a link somebody can send.
 *
 * AND THE ADDRESS BAR FOLLOWS THE FRAME. *"when clicking 'open' on the iframe I want to chain the link to
 * the url"*. A framed page cannot write the address bar, so the engine announces its route and this mirrors
 * it, shallow, so the frame is never torn down and reloaded by the very navigation it just reported.
 *
 * The frame takes the WHOLE viewport deliberately. The editor measures the viewport to size its panels and
 * canvas, so a header, a wrapper or a max-width container makes every one of them wrong. `fixed inset-0`
 * keeps that true regardless of what `_app` puts around the page.
 */
export default function GameEnginePage() {
  const router = useRouter()

  /**
   * The path to frame, taken from the URL once.
   *
   * ONCE, on purpose. The src is what LOADS the frame, so letting it track the URL would reload the engine
   * every time the engine told us it had navigated, which is a loop that throws away the map you are looking
   * at. The first value wins and the frame owns its own history from there.
   */
  const initial = useRef<string | null>(null)
  const src = useMemo(() => {
    if (initial.current !== null) return initial.current
    if (!router.isReady) return null
    const parts = router.query.path
    const path = Array.isArray(parts) ? parts.join('/') : (parts ?? '')
    // `/games` is where the engine opens when nothing more is asked for, which is what this page framed
    // before it could frame anything else.
    initial.current = `${ENGINE_URL}/${path || 'games'}`
    return initial.current
  }, [router.isReady, router.query.path])

  // THE ADDRESS BAR MIRRORS THE FRAME. Shallow, so Next does not re-run data fetching or remount the page,
  // and `replace` so a walk through five levels does not leave five entries to back out through.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (new URL(ENGINE_URL).origin !== event.origin) return // only the engine we framed
      const data = event.data as { type?: string; path?: string } | null
      if (!data || data.type !== 'nebulith:route' || typeof data.path !== 'string') return
      const inner = data.path.replace(/^\//, '')
      void router.replace(`/personal-projects/game-engine/${inner}`, undefined, { shallow: true })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [router])

  return (
    <>
      <Head>
        <title>Nebulith - Alexander Pulido</title>
        <meta name="description" content="Nebulith, an ASCII tile-based game engine and editor." />
      </Head>
      {src && (
        <iframe
          src={src}
          title="Nebulith game engine"
          allow="fullscreen; gamepad; clipboard-write"
          className="fixed inset-0 h-full w-full border-0"
        />
      )}
    </>
  )
}
