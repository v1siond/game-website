import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CV_CONTENT_FILES, cvDataFrom, type CVContentFiles, type CVData, type Job, type Project } from '@/lib/cv/content'
import { viewFor } from '@/lib/cv/cvView'

// The real Decap files, so every fixture has the shape and the strings the page reads.
const realCV = (): CVData =>
  cvDataFrom(
    Object.fromEntries(
      CV_CONTENT_FILES.map((name) => [
        name,
        JSON.parse(readFileSync(join(process.cwd(), 'content', 'cv', `${name}.json`), 'utf8')),
      ]),
    ) as CVContentFiles,
    'en',
  )

const NOW = new Date('2026-10-21T12:00:00Z')

const realJob = (cv: CVData, id: string): Job => {
  const job = cv.workExperience.find((entry) => entry.id === id)
  if (!job) throw new Error(`no job ${id} in content/cv/experience.json`)
  return job
}

const realProject = (cv: CVData, id: string): Project => {
  const project = cv.projects.find((entry) => entry.id === id)
  if (!project) throw new Error(`no project ${id} in content/cv/projects.json`)
  return project
}

// A small CV: a current job, one that ended inside the window, one just outside it, an old highlight
// and an old plain job, each built from a real entry.
const smallCV = (): CVData => {
  const cv = realCV()
  const plain = realJob(cv, 'solutionrus')
  return {
    ...cv,
    workExperience: [
      realJob(cv, 'dba-staff'),
      { ...plain, id: 'ended-2021', startDate: new Date('2019-01-01'), endDate: new Date('2021-03-01') },
      { ...plain, id: 'ended-2020', startDate: new Date('2018-01-01'), endDate: new Date('2020-12-01') },
      realJob(cv, 'smoothterminal'),
      plain,
    ],
    projects: [
      realProject(cv, 'agency-rocket'),
      realProject(cv, 'truth-social'),
      { ...realProject(cv, 'truth-social'), id: 'old-project', startYear: 2015, endYear: 2016, position: 20 },
      { ...realProject(cv, 'truth-social'), id: 'old-highlight', startYear: 2015, endYear: 2016, highlight: true, position: 21 },
      realProject(cv, 'pearson-channels'),
    ],
  }
}

const engineerOf = (view: ReturnType<typeof viewFor>) => {
  if (view.sections.profession !== 'engineer') throw new Error(`expected engineer, got ${view.sections.profession}`)
  return view.sections
}

const ids = (entries: Array<{ id: string }>) => entries.map((entry) => entry.id)

describe('viewFor: the recruiter hero', () => {
  it('takes name, headline, tagline, the contact line and both actions from the content', () => {
    const cv = realCV()
    const { hero } = viewFor(cv, 'engineer', 'world', NOW)

    expect(hero.name).toBe('Alexander Pulido')
    expect(hero.headline).toBe(cv.professionalSummary.headline)
    expect(hero.tagline).toBe(cv.professionalSummary.tagline)
    expect(hero.line).toBe(cv.contact.line)
    expect(hero.actions).toEqual({
      email: { href: `mailto:${cv.contact.email}`, value: cv.contact.email },
      linkedin: { href: cv.contact.linkedin, value: cv.contact.linkedin },
    })
  })

  it.each(['drummer', 'fighter'] as const)('is the same hero for %s', (profession) => {
    const cv = realCV()
    expect(viewFor(cv, profession, 'world', NOW).hero).toEqual(viewFor(cv, 'engineer', 'world', NOW).hero)
  })
})

describe('viewFor: System Engineer', () => {
  it('lists jobs, projects, the tech stack and the companies, and nothing of the other professions', () => {
    const cv = realCV()
    const view = viewFor(cv, 'engineer', 'full', NOW)
    const sections = engineerOf(view)

    expect(sections.jobs.length).toBe(cv.workExperience.length)
    expect(ids(sections.projects).sort()).toEqual(ids(cv.projects).sort())
    expect(sections.techStack).toEqual(cv.techStack)
    expect(sections.companies).toEqual(cv.companies)
    expect(Object.keys(sections).sort()).toEqual(['companies', 'jobs', 'profession', 'projects', 'techStack'])
  })

  it('orders jobs by recency: current first, then by end date', () => {
    const { jobs } = engineerOf(viewFor(smallCV(), 'engineer', 'full', NOW))
    expect(ids(jobs)).toEqual(['dba-staff', 'ended-2021', 'ended-2020', 'smoothterminal', 'solutionrus'])
  })

  it('keeps the projects in the order he set in Decap (position)', () => {
    const cv = realCV()
    const shuffled = { ...cv, projects: [...cv.projects].reverse() }
    const { projects } = engineerOf(viewFor(shuffled, 'engineer', 'full', NOW))
    expect(projects.map((project) => project.position)).toEqual(cv.projects.map((p) => p.position).sort((a, b) => a - b))
  })
})

describe('viewFor: the five year cut in a world', () => {
  it('keeps a job that ended in 2021 and drops one that ended in 2020', () => {
    const { jobs } = engineerOf(viewFor(smallCV(), 'engineer', 'world', NOW))
    expect(ids(jobs)).toContain('ended-2021')
    expect(ids(jobs)).not.toContain('ended-2020')
  })

  it('moves the boundary with the clock', () => {
    const { jobs } = engineerOf(viewFor(smallCV(), 'engineer', 'world', new Date('2027-01-15T12:00:00Z')))
    expect(ids(jobs)).not.toContain('ended-2021')
    expect(ids(jobs)).toContain('dba-staff')
  })

  it('keeps an old job marked highlight', () => {
    const { jobs } = engineerOf(viewFor(smallCV(), 'engineer', 'world', NOW))
    expect(ids(jobs)).toContain('smoothterminal')
  })

  it('drops an old job that is no highlight in a world and keeps it on the full CV', () => {
    const cv = smallCV()
    expect(ids(engineerOf(viewFor(cv, 'engineer', 'world', NOW)).jobs)).not.toContain('solutionrus')
    expect(ids(engineerOf(viewFor(cv, 'engineer', 'full', NOW)).jobs)).toContain('solutionrus')
  })

  it('cuts the projects the same way, keeping a project with no years', () => {
    const cv = smallCV()
    const world = ids(engineerOf(viewFor(cv, 'engineer', 'world', NOW)).projects)
    const full = ids(engineerOf(viewFor(cv, 'engineer', 'full', NOW)).projects)

    expect(world).toEqual(['agency-rocket', 'pearson-channels', 'truth-social', 'old-highlight'])
    expect(full).toEqual(['agency-rocket', 'pearson-channels', 'truth-social', 'old-project', 'old-highlight'])
  })

  it('on the real content drops the 2014 to 2017 jobs and keeps the highlights', () => {
    const { jobs } = engineerOf(viewFor(realCV(), 'engineer', 'world', NOW))
    expect(ids(jobs)).toEqual(['dba-staff', 'pearson', 'clutchprep', 'smoothterminal', 'dba-frontend'])
  })
})

describe('viewFor: Musician', () => {
  it('lists his bands by recency, with the musician line, and no engineer or fighter content', () => {
    const cv = realCV()
    const { sections } = viewFor(cv, 'drummer', 'world', NOW)

    expect(sections.profession).toBe('drummer')
    if (sections.profession !== 'drummer') return
    expect(ids(sections.bands)).toEqual(['zero-nexus', 'eon', 'en-carne-muerta', 'behated-reign'])
    expect(sections.musician).toEqual(cv.musician)
    expect(Object.keys(sections).sort()).toEqual(['bands', 'musician', 'profession'])
  })
})

describe('viewFor: Martial Artist', () => {
  it('shows the Muay Thai record and nothing else', () => {
    const cv = realCV()
    const { sections } = viewFor(cv, 'fighter', 'world', NOW)

    expect(sections.profession).toBe('fighter')
    if (sections.profession !== 'fighter') return
    expect(sections.martialArts).toEqual(cv.martialArts)
    expect(sections.martialArts.primary.title).toBe('Muay Thai Practitioner and Instructor')
    expect(Object.keys(sections).sort()).toEqual(['martialArts', 'profession'])
  })
})

describe('viewFor: an unknown profession', () => {
  it.each(['musician', '', 'ENGINEER', 'constructor'])('%p falls back to System Engineer', (profession) => {
    const cv = realCV()
    const view = viewFor(cv, profession, 'world', NOW)

    expect(view.profession).toBe('engineer')
    expect(view).toEqual(viewFor(cv, 'engineer', 'world', NOW))
  })
})
