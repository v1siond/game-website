import { getAllCVData } from '@/lib/cv-data'
import { listPosts } from '@/lib/blog/posts'
import { llmsText } from '@/lib/llmsText'

// Rendered once at build time from the English CV and the posts the build shows, like the pages it
// points to.
export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  const [cv, posts] = await Promise.all([getAllCVData('en'), listPosts({ env: process.env.NODE_ENV })])
  return new Response(llmsText(cv, posts), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
