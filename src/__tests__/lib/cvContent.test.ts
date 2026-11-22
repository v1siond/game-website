import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, worldCV, type CVContentFiles } from '@/lib/cv/content'

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

describe('worldCV', () => {
  it('leaves out what only /cv prints and keeps the rest of the CV as loaded', () => {
    const cv = cvDataFrom(readFiles(), 'en')
    const world = worldCV(cv)

    expect(world).not.toHaveProperty('featuredProjects')
    expect(world).not.toHaveProperty('currentRoles')
    expect(world.contact).not.toHaveProperty('website')
    world.services.forEach((service) => expect(service).not.toHaveProperty('useCases'))
    expect(world.services.map((service) => service.id)).toEqual(cv.services.map((service) => service.id))
    expect(world.projects).toBe(cv.projects)
    expect(world.labels).toBe(cv.labels)
  })
})

describe('services.json', () => {
  type RawService = { id: string; title: string; line: string; group?: string; useCases?: string[] }
  const servicesOf = (locale: 'en' | 'es' | 'it'): RawService[] =>
    (readFiles().services[locale]?.services ?? []) as RawService[]
  const byId = (services: RawService[]) => new Map(services.map((service) => [service.id, service]))

  // Services whose use cases no HISTORY.md line backs, so the list is left empty. None today: every
  // service keeps at least one name.
  const EMPTIED: string[] = []
  const AUDITS = 'security-accessibility-audits'

  it.each(['en', 'es', 'it'] as const)('lists the ten services with no group in %s', (locale) => {
    const services = servicesOf(locale)

    expect(services).toHaveLength(10)
    expect(services.filter((service) => 'group' in service)).toEqual([])
  })

  it('keeps every use case name out of every description', () => {
    const names = [...new Set(servicesOf('en').flatMap((service) => service.useCases ?? []))]
    expect(names.length).toBeGreaterThan(0)
    ;(['en', 'es', 'it'] as const).forEach((locale) =>
      servicesOf(locale).forEach((service) =>
        expect([service.id, names.filter((name) => service.line.includes(name))]).toEqual([service.id, []]),
      ),
    )
  })

  // Equal to English per id, and non empty unless emptied, so a service missing its use cases in
  // both English and the translation still fails.
  const expectSameUseCasesAsEnglish = (englishServices: RawService[], translated: RawService[]) => {
    const english = byId(englishServices)

    expect(translated.map((service) => service.id)).toEqual([...english.keys()])
    translated.forEach((service) =>
      expect([service.id, service.useCases]).toEqual([service.id, english.get(service.id)?.useCases]),
    )
    translated
      .filter((service) => !EMPTIED.includes(service.id))
      .forEach((service) => expect([service.id, (service.useCases ?? []).length > 0]).toEqual([service.id, true]))
  }

  it.each(['es', 'it'] as const)('names the same use cases as English for each service in %s', (locale) => {
    expectSameUseCasesAsEnglish(servicesOf('en'), servicesOf(locale))
  })

  it('gives every English service a use case, except the emptied ones', () => {
    const withoutUseCases = servicesOf('en')
      .filter((service) => (service.useCases ?? []).length === 0)
      .map((service) => service.id)

    expect(withoutUseCases).toEqual(EMPTIED)
  })

  it.each(['en', 'es', 'it'] as const)('lists GRCTechMe as a use case of the audits service in %s', (locale) => {
    expect(EMPTIED).not.toContain(AUDITS)
    expect(byId(servicesOf(locale)).get(AUDITS)?.useCases).toContain('GRCTechMe')
  })
})
