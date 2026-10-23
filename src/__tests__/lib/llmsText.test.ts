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
const text = llmsText(cv)
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
