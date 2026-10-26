'use client'

import type { ReactNode } from 'react'
import { usePosts } from '@/components/blog/BlogProvider'
import { postLinks } from '@/lib/blog/links'

// The posts section a world closes on shows only when there is a post to link (the home page loads the
// latest ones into BlogProvider). A world wraps its posts section in this gate, so with no post the
// section and the space around it are not drawn at all.
export function PostsGate({ children }: { children: ReactNode }) {
  if (!postLinks(usePosts())) return null
  return <>{children}</>
}
