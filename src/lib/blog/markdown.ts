import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypePrismPlus from 'rehype-prism-plus/common'
import rehypeStringify from 'rehype-stringify'

// A post's Markdown to HTML, on the server at build time. GitHub flavoured Markdown (tables, task lists,
// autolinks), an id on every heading, and Prism token spans on fenced code (coloured by
// src/styles/blog.css). remark-rehype leaves raw HTML out of the tree (no allowDangerousHtml), so a post
// can hold no script or markup of its own. A fence in a language Prism does not know stays plain text.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePrismPlus, { ignoreMissing: true })
  .use(rehypeStringify)

/** The HTML of a post's body. */
export async function renderMarkdown(body: string): Promise<string> {
  return String(await processor.process(body))
}
