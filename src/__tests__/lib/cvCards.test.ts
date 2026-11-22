import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData, type Job, type Project } from '@/lib/cv/content'
import { aboutBlock, jobCard, projectCard, ventureCard } from '@/lib/cv/cvView'
import { jobSpan } from '@/lib/cv/sectionText'

// His 11-10 rule: "We should have the same content across all worlds, only the template changes." Each
// card's view model carries every field of its entry whole, so no world slices or formats one itself.

const realCV = (): CVData =>
  cvDataFrom(
    Object.fromEntries(
      CV_CONTENT_FILES.map((name) => [name, JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8'))]),
    ) as CVContentFiles,
    'en',
  )

const cv = realCV()
const { years, links } = cv.labels

const realJob = (id: string): Job => {
  const job = cv.workExperience.find((entry) => entry.id === id)
  if (!job) throw new Error(`no job ${id} in content/cv/experience.json`)
  return job
}

const realProject = (id: string): Project => {
  const project = cv.projects.find((entry) => entry.id === id)
  if (!project) throw new Error(`no project ${id} in content/cv/projects.json`)
  return project
}

describe('jobSpan', () => {
  it('puts an ended job into the years.range label', () => {
    expect(jobSpan(realJob('clutchprep'), years)).toBe('2019 to 2022')
  })

  it('ends a running job in years.present', () => {
    expect(jobSpan(realJob('dba-staff'), years)).toBe('2023 to Present')
  })

  it('follows the locale label, so no world writes its own " - "', () => {
    expect(jobSpan(realJob('clutchprep'), { ...years, range: 'Dal {start} al {end}' })).toBe('Dal 2019 al 2022')
  })
})

describe('jobCard', () => {
  it('carries every field of the job whole, with the years from jobSpan', () => {
    const job = { ...realJob('pearson'), skills: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }
    expect(jobCard(job, years)).toEqual({
      id: job.id,
      title: job.title,
      company: job.company,
      years: '2022 to 2023',
      location: job.location,
      description: job.description,
      highlights: job.highlights,
      skills: job.skills,
    })
  })
})

describe('projectCard', () => {
  it('carries every field of the project whole: all five tags, every detail, its links', () => {
    const project = realProject('agency-rocket')
    const card = projectCard(project, { years, links })
    expect(card).toMatchObject({
      id: project.id,
      name: project.name,
      role: project.role,
      tagline: project.tagline,
      description: project.description,
      impact: project.impact,
      details: project.details,
      techStack: project.techStack,
    })
    expect(card.techStack).toHaveLength(5)
    expect(card.links.map((link) => link.href)).toContain(project.links.site)
  })

  it('gives the years in the shared span and no links when it has none', () => {
    const project = { ...realProject('agency-rocket'), startYear: 2016, endYear: 2018, current: false, links: { site: '', app: '', store: '', story: '' } }
    const card = projectCard(project, { years, links })
    expect(card.years).toBe('2016 to 2018')
    expect(card.links).toEqual([])
  })
})

describe('ventureCard', () => {
  it('carries every service, not the first two', () => {
    const company = cv.companies[0]
    const card = ventureCard(company)
    expect(card).toEqual({
      id: company.id,
      name: company.name,
      tagline: company.tagline,
      description: company.description,
      url: company.url,
      icon: company.icon,
      services: company.services,
      featured: Boolean(company.featured),
    })
    expect(card.services).toHaveLength(4)
  })
})

describe('aboutBlock', () => {
  it('carries the bio, education, languages and every summary highlight', () => {
    const summary = cv.professionalSummary
    expect(aboutBlock(summary)).toEqual({
      bio: summary.bio,
      education: summary.education,
      languages: summary.languages,
      highlights: summary.highlights,
    })
    expect(aboutBlock(summary).highlights).toHaveLength(summary.highlights.length)
  })
})
