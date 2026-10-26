'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PostSummary } from '@/lib/blog/post'

// The latest posts the home page loaded on the server (latestPosts in src/lib/blog/posts.ts), handed to
// every world beside the CV. A world reads them with usePosts and turns them into links with postLinks.
// Outside a provider (a world rendered on its own) there are no posts, so no posts section shows.

const PostsContext = createContext<readonly PostSummary[]>([])

export function BlogProvider({ posts, children }: { posts: readonly PostSummary[]; children: ReactNode }) {
  return <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
}

/** The latest posts, newest first; empty when the build lists none. */
export function usePosts(): readonly PostSummary[] {
  return useContext(PostsContext)
}
