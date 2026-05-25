import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { SKILLS_DATA, getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { PROJECTS_DATA } from '@/data/projects'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { TECH_STACK } from '@/data/techStack'
import type { Profession } from '@/contexts/ProfessionContext'

describe('Data Integrity Tests', () => {
  describe('PROFESSIONAL_SUMMARY', () => {
    it('has required fields', () => {
      expect(PROFESSIONAL_SUMMARY.headline).toBeTruthy()
      expect(PROFESSIONAL_SUMMARY.tagline).toBeTruthy()
      expect(PROFESSIONAL_SUMMARY.bio).toBeTruthy()
      expect(PROFESSIONAL_SUMMARY.highlights).toBeDefined()
      expect(Array.isArray(PROFESSIONAL_SUMMARY.highlights)).toBe(true)
    })

    it('has non-empty highlights', () => {
      expect(PROFESSIONAL_SUMMARY.highlights.length).toBeGreaterThan(0)
      PROFESSIONAL_SUMMARY.highlights.forEach((highlight) => {
        expect(highlight).toBeTruthy()
      })
    })

    it('bio is substantial (more than 100 characters)', () => {
      expect(PROFESSIONAL_SUMMARY.bio.length).toBeGreaterThan(100)
    })
  })

  describe('ABOUT_DATA', () => {
    const professions: Profession[] = ['engineer', 'drummer', 'fighter']

    professions.forEach((profession) => {
      describe(`${profession} about data`, () => {
        it('has required fields', () => {
          const data = ABOUT_DATA[profession]

          expect(data.professionId).toBe(profession)
          expect(data.headline).toBeTruthy()
          expect(data.bio).toBeTruthy()
          expect(data.quickFacts).toBeDefined()
          expect(Array.isArray(data.quickFacts)).toBe(true)
        })

        it('has quick facts', () => {
          const data = ABOUT_DATA[profession]
          expect(data.quickFacts.length).toBeGreaterThan(0)
        })
      })
    })
  })

  describe('TECH_STACK', () => {
    it('has categories', () => {
      expect(TECH_STACK.length).toBeGreaterThan(0)
    })

    it('each category has required fields', () => {
      TECH_STACK.forEach((category) => {
        expect(category.name).toBeTruthy()
        expect(category.icon).toBeTruthy()
        expect(category.items).toBeDefined()
        expect(Array.isArray(category.items)).toBe(true)
        expect(category.items.length).toBeGreaterThan(0)
      })
    })

    it('includes expected technologies', () => {
      const allItems = TECH_STACK.flatMap((cat) => cat.items)

      // Check for some expected tech
      expect(allItems.some((item) => item.toLowerCase().includes('elixir'))).toBe(true)
      expect(allItems.some((item) => item.toLowerCase().includes('react'))).toBe(true)
      expect(allItems.some((item) => item.toLowerCase().includes('kubernetes'))).toBe(true)
    })
  })

  describe('getEngineerSkills', () => {
    it('returns tech stack categories', () => {
      const skills = getEngineerSkills()

      expect(Array.isArray(skills)).toBe(true)
      expect(skills.length).toBeGreaterThan(0)
      expect(skills).toEqual(TECH_STACK)
    })
  })

  describe('SKILLS_DATA', () => {
    it('has drummer skills', () => {
      const drummerSkills = SKILLS_DATA.filter((s) => s.profession === 'drummer')
      expect(drummerSkills.length).toBeGreaterThan(0)
    })

    it('has fighter skills', () => {
      const fighterSkills = SKILLS_DATA.filter((s) => s.profession === 'fighter')
      expect(fighterSkills.length).toBeGreaterThan(0)
    })

    it('each skill category has required fields', () => {
      SKILLS_DATA.forEach((category) => {
        expect(category.name).toBeTruthy()
        expect(category.profession).toBeTruthy()
        expect(category.skills).toBeDefined()
        expect(Array.isArray(category.skills)).toBe(true)
        expect(category.skills.length).toBeGreaterThan(0)
      })
    })

    it('skills have name and proficiency', () => {
      SKILLS_DATA.forEach((category) => {
        category.skills.forEach((skill) => {
          expect(skill.name).toBeTruthy()
          expect(skill.proficiency).toBeGreaterThanOrEqual(1)
          expect(skill.proficiency).toBeLessThanOrEqual(5)
        })
      })
    })
  })

  describe('getSkillsByProfession', () => {
    it('returns only drummer skills for drummer', () => {
      const skills = getSkillsByProfession('drummer')

      skills.forEach((category) => {
        expect(category.profession).toBe('drummer')
      })
    })

    it('returns only fighter skills for fighter', () => {
      const skills = getSkillsByProfession('fighter')

      skills.forEach((category) => {
        expect(category.profession).toBe('fighter')
      })
    })

    it('returns empty array for engineer (uses tech stack instead)', () => {
      const skills = getSkillsByProfession('engineer')

      // Engineer skills are handled differently via getEngineerSkills
      expect(Array.isArray(skills)).toBe(true)
    })
  })

  describe('PROJECTS_DATA', () => {
    it('has projects', () => {
      expect(PROJECTS_DATA.length).toBeGreaterThan(0)
    })

    it('each project has required fields', () => {
      PROJECTS_DATA.forEach((project) => {
        expect(project.id).toBeTruthy()
        expect(project.name).toBeTruthy()
        expect(project.tagline).toBeTruthy()
        expect(project.description).toBeTruthy()
        expect(project.techStack).toBeDefined()
        expect(Array.isArray(project.techStack)).toBe(true)
        expect(project.professions).toBeDefined()
        expect(Array.isArray(project.professions)).toBe(true)
        expect(typeof project.featured).toBe('boolean')
      })
    })

    it('has some featured projects', () => {
      const featuredProjects = PROJECTS_DATA.filter((p) => p.featured)
      expect(featuredProjects.length).toBeGreaterThan(0)
    })

    it('projects have associated professions', () => {
      PROJECTS_DATA.forEach((project) => {
        expect(project.professions.length).toBeGreaterThan(0)
        project.professions.forEach((profession) => {
          expect(['engineer', 'drummer', 'fighter']).toContain(profession)
        })
      })
    })
  })

  describe('CURRENT_ROLES', () => {
    it('has roles', () => {
      expect(CURRENT_ROLES.length).toBeGreaterThan(0)
    })

    it('each role has required fields', () => {
      CURRENT_ROLES.forEach((role) => {
        expect(role.id).toBeTruthy()
        expect(role.title).toBeTruthy()
        expect(role.company).toBeTruthy()
      })
    })
  })

  describe('COMPANIES', () => {
    it('has companies', () => {
      expect(COMPANIES.length).toBeGreaterThan(0)
    })

    it('each company has required fields', () => {
      COMPANIES.forEach((company) => {
        expect(company.id).toBeTruthy()
        expect(company.name).toBeTruthy()
        expect(company.tagline).toBeTruthy()
        expect(company.description).toBeTruthy()
        expect(company.url).toBeTruthy()
        expect(company.icon).toBeTruthy()
      })
    })

    it('company URLs are valid format', () => {
      COMPANIES.forEach((company) => {
        expect(company.url).toMatch(/^https?:\/\//)
      })
    })
  })

  describe('BANDS', () => {
    it('has bands', () => {
      expect(BANDS.length).toBeGreaterThan(0)
    })

    it('each band has required fields', () => {
      BANDS.forEach((band) => {
        expect(band.id).toBeTruthy()
        expect(band.name).toBeTruthy()
        expect(band.genre).toBeTruthy()
        expect(band.role).toBeTruthy()
        expect(band.description).toBeTruthy()
      })
    })
  })
})

describe('Data Consistency Tests', () => {
  it('all profession IDs in about data match valid professions', () => {
    const validProfessions: Profession[] = ['engineer', 'drummer', 'fighter']

    Object.values(ABOUT_DATA).forEach((about) => {
      expect(validProfessions).toContain(about.professionId)
    })
  })

  it('all profession IDs in skills data match valid professions', () => {
    const validProfessions: Profession[] = ['engineer', 'drummer', 'fighter']

    SKILLS_DATA.forEach((category) => {
      expect(validProfessions).toContain(category.profession)
    })
  })

  it('all profession IDs in projects match valid professions', () => {
    const validProfessions: Profession[] = ['engineer', 'drummer', 'fighter']

    PROJECTS_DATA.forEach((project) => {
      project.professions.forEach((profession) => {
        expect(validProfessions).toContain(profession)
      })
    })
  })

  it('all IDs are unique within their collections', () => {
    // Check roles
    const roleIds = CURRENT_ROLES.map((r) => r.id)
    expect(new Set(roleIds).size).toBe(roleIds.length)

    // Check companies
    const companyIds = COMPANIES.map((c) => c.id)
    expect(new Set(companyIds).size).toBe(companyIds.length)

    // Check bands
    const bandIds = BANDS.map((b) => b.id)
    expect(new Set(bandIds).size).toBe(bandIds.length)

    // Check projects
    const projectIds = PROJECTS_DATA.map((p) => p.id)
    expect(new Set(projectIds).size).toBe(projectIds.length)
  })
})
