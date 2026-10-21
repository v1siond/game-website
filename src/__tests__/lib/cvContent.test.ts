import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles } from '@/lib/cv/content'

// The real Decap files, so the test reads what the page reads.
const readFiles = (): CVContentFiles =>
  Object.fromEntries(
    CV_CONTENT_FILES.map((name) => [
      name,
      JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8')),
    ]),
  ) as CVContentFiles

describe('cvDataFrom', () => {
  it('picks the fields of the asked locale', () => {
    const files = readFiles()

    expect(cvDataFrom(files, 'es').contact.line).toBe(files.contact.es?.contact?.line)
    expect(cvDataFrom(files, 'it').martialArts.primary.title).toBe(
      files['martial-arts'].it?.martialArts?.primary.title,
    )
    expect(cvDataFrom(files, 'es').contact.line).not.toBe(cvDataFrom(files, 'en').contact.line)
  })

  it('reads his degree and languages from the summary file in each locale', () => {
    const files = readFiles()
    const english = cvDataFrom(files, 'en').professionalSummary
    const spanish = cvDataFrom(files, 'es').professionalSummary

    expect(english.education).toBe('Ingeniero en Sistemas, UNEFA, 2008 to 2014')
    expect(english.languages).toBe('Spanish and English native, Italian basic')
    expect(spanish.education).toBe(files.summary.es?.professionalSummary?.education)
    expect(spanish.languages).not.toBe(english.languages)
  })

  it('falls back to English when a file has no block for the locale', () => {
    const files = readFiles()
    const withoutItalian = { en: files.summary.en, es: files.summary.es }
    const cv = cvDataFrom({ ...files, summary: withoutItalian }, 'it')

    expect(cv.professionalSummary.headline).toBe(files.summary.en.professionalSummary.headline)
    expect(cv.contact.line).toBe(files.contact.it?.contact?.line)
  })

  it('falls back to English for a key the locale block lacks', () => {
    const files = readFiles()
    const cv = cvDataFrom({ ...files, bands: { ...files.bands, es: { bands: files.bands.es?.bands } } }, 'es')

    expect(cv.musician).toEqual(files.bands.en.musician)
    expect(cv.bands).toEqual(files.bands.es?.bands)
  })

  it('gives the page dates and the featured projects', () => {
    const cv = cvDataFrom(readFiles(), 'en')
    const current = cv.workExperience.find((job) => job.current)
    const past = cv.workExperience.find((job) => !job.current)

    expect(current?.startDate).toBeInstanceOf(Date)
    expect(current?.endDate).toBeNull()
    expect(past?.endDate).toBeInstanceOf(Date)
    expect(cv.featuredProjects.length).toBeGreaterThan(0)
    expect(cv.featuredProjects.every((project) => project.featured)).toBe(true)
  })
})
