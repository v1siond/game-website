import type { ReactNode } from 'react'

// The posts section a world closes on. The CV content (content/cv, read by src/lib/cv-data.ts) holds no
// posts collection, so there is nothing to list and the section stays hidden rather than showing an empty
// box. A world wraps its posts section in this gate; when a posts collection is added to the content, the
// gate reads it here and the section shows wherever it is wrapped.
const POST_COUNT = 0

export function PostsGate({ children }: { children: ReactNode }) {
  if (POST_COUNT === 0) return null
  return <>{children}</>
}
