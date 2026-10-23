import { getAllCVData } from '@/lib/cv-data'
import { llmsText } from '@/lib/llmsText'

// Rendered once at build time from the English CV, like the pages it points to.
export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  return new Response(llmsText(await getAllCVData('en')), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
