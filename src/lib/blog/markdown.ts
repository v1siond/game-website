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

export type MarkdownOptions = {
  /** The accessible name of every code block (labels.json blog.codeExample). */
  codeLabel: string
}

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] }

const isPre = (node: HastNode): boolean => node.type === 'element' && node.tagName === 'pre'

// A code block wider than the column scrolls sideways, so each one is a tab stop (WCAG 2.1.1) with a name.
const focusCodeBlocks = (node: HastNode, codeLabel: string): void => {
  if (isPre(node)) node.properties = { ...node.properties, tabIndex: 0, role: 'group', ariaLabel: codeLabel }
  node.children?.forEach((child) => focusCodeBlocks(child, codeLabel))
}

function rehypeFocusableCode() {
  return (tree: HastNode, file: { data: Record<string, unknown> }) => focusCodeBlocks(tree, String(file.data.codeLabel))
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypePrismPlus, { ignoreMissing: true })
  .use(rehypeFocusableCode)
  .use(rehypeStringify)

/** The HTML of a post's body. */
export async function renderMarkdown(body: string, { codeLabel }: MarkdownOptions): Promise<string> {
  return String(await processor.process({ value: body, data: { codeLabel } }))
}
