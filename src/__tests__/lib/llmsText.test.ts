import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles } from '@/lib/cv/content'
import { llmsText } from '@/lib/llmsText'
import { siteDescription } from '@/lib/seo'

// The real Decap files, so the text is checked against what the pages read.
const files = Object.fromEntries(
  CV_CONTENT_FILES.map((name) => [name, JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))]),
) as CVContentFiles
const cv = cvDataFrom(files, 'en')
const text = llmsText(cv, [])
const lines = text.split('\n')

describe('llmsText', () => {
  it('opens with his name as the one H1 and the site summary as a blockquote', () => {
    expect(lines[0]).toBe(`# ${cv.fullName}`)
    expect(lines.filter((line) => line.startsWith('# '))).toHaveLength(1)
    expect(text).toContain(`\n> ${siteDescription(cv)}\n`)
  })

  it('links the CV at its address in every language', () => {
    expect(text).toContain(`- [${cv.labels.actions.cv} (English)](https://alexanderpulido.dev/cv)`)
    expect(text).toContain(`- [${cv.labels.actions.cv} (Español)](https://alexanderpulido.dev/es/cv)`)
    expect(text).toContain(`- [${cv.labels.actions.cv} (Italiano)](https://alexanderpulido.dev/it/cv)`)
  })

  it('lists every service by its title under its own heading', () => {
    expect(text).toContain(`\n## ${cv.labels.sections.services}\n`)
    for (const service of cv.services) expect(text).toContain(`- ${service.title}: ${service.line}`)
  })
})

describe('llmsText posts', () => {
  const post = {
    title: 'CSS page transition: four portals between my 17 CV worlds',
    slug: 'css-page-transition-portals',
    date: '2026-10-26',
    description: 'Four CSS portal effects.',
    keyword: 'css page transition',
    tags: [],
    draft: false,
  }

  it('lists each post it is given by its title and address under its own heading', () => {
    const withPosts = llmsText(cv, [post])
    expect(withPosts).toContain(`\n## ${cv.labels.sections.posts}\n`)
    expect(withPosts).toContain(`- [${post.title}](https://alexanderpulido.dev/blog/css-page-transition-portals): ${post.description}`)
  })

  it('has no posts heading when there is no post', () => {
    expect(text).not.toContain(`## ${cv.labels.sections.posts}`)
    expect(text).toContain(`## ${cv.labels.sections.services}`)
  })
})
