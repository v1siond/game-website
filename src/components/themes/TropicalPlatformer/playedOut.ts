import { useCallback, useState, type AnimationEvent } from 'react'

// A figure that plays one moment and is done (his roll in the air, his flight into the yard): `over` turns
// true when the element's own animation ends, so the caller unmounts it instead of keeping it, and its
// infinite pose loops, at opacity 0. The animations of its children bubble up and are ignored. Under
// reduced motion nothing animates, so it stays as the CSS stills it.

export function usePlayedOut() {
  const [over, setOver] = useState(false)
  const onOwnEnd = useCallback((event: AnimationEvent<Element>) => {
    if (event.target !== event.currentTarget) return
    setOver(true)
  }, [])
  return { over, onOwnEnd }
}
