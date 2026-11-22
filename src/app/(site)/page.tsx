import type { Metadata } from 'next'
import { getAllCVData } from '@/lib/cv-data'
import { latestPosts } from '@/lib/blog/posts'
import { pageMetadata } from '@/lib/seo'
import { ProfilePageJsonLd } from '@/components/seo/ProfilePageJsonLd'
import { CVDataProvider } from '@/components/cv/CVDataProvider'
import { yearOf } from '@/lib/cv/cvView'
import { BlogProvider } from '@/components/blog/BlogProvider'
import { WORLD_PENDING_SCRIPT } from '@/themes/worldPending'
import { WorldRenderer } from './WorldRenderer'

// How many posts a world's posts section links.
const LATEST_POSTS = 3

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(await getAllCVData('en'), '/')
}

// The worlds are written in English only (see the site layout), so the site loads the English CV once
// and every world reads it from the provider, and the latest posts beside it (drafts only on the dev
// server). The server renders the default world in full, so its CV text is in the HTML crawlers read;
// the inline script hides it only for a visitor who picked another one. The page is built once per deploy,
// so the year it renders with is the build's; the client moves to its own clock after hydration.
export default async function Home() {
  const [cv, posts] = await Promise.all([getAllCVData('en'), latestPosts(LATEST_POSTS, { env: process.env.NODE_ENV })])

  return (
    <CVDataProvider cv={cv} year={yearOf(new Date())}>
      <BlogProvider posts={posts}>
        <ProfilePageJsonLd cv={cv} path={'/'} />
        <script dangerouslySetInnerHTML={{ __html: WORLD_PENDING_SCRIPT }} />
        <WorldRenderer />
      </BlogProvider>
    </CVDataProvider>
  )
}
