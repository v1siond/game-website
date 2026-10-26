import { renderMarkdown } from '@/lib/blog/markdown'

describe('renderMarkdown', () => {
  it('turns a ts fence into Prism token spans', async () => {
    const html = await renderMarkdown('```ts\nconst cover = window.setTimeout(() => swap(), COVER_MS)\n```')
    expect(html).toContain('class="token keyword"')
    expect(html).toContain('<code class="language-ts code-highlight">')
  })

  it('drops raw HTML and keeps the Markdown around it', async () => {
    const html = await renderMarkdown('Before\n\n<script>alert(1)</script>\n\n<div onclick="x()">raw</div>\n\nAfter')
    expect(html).not.toMatch(/<script|<div|onclick/)
    expect(html).toContain('<p>Before</p>')
    expect(html).toContain('<p>After</p>')
  })

  it('gives each heading an id and renders images with their alt', async () => {
    const html = await renderMarkdown('## Cover, swap, reveal\n\n![Timeline of the transition](/blog/x/cover.svg)')
    expect(html).toContain('<h2 id="cover-swap-reveal">Cover, swap, reveal</h2>')
    expect(html).toContain('<img src="/blog/x/cover.svg" alt="Timeline of the transition">')
  })

  it('reads GitHub flavoured tables', async () => {
    expect(await renderMarkdown('| a | b |\n|---|---|\n| 1 | 2 |')).toContain('<table>')
  })
})
