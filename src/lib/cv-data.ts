import { prisma } from './prisma'
import type { Locale } from '@/i18n/config'

// Helper to get localized field
function getLocalizedField<T>(
  item: T,
  field: keyof T,
  locale: Locale
): string {
  if (locale === 'en') {
    return item[field] as string
  }

  const localizedKey = `${String(field)}_${locale}` as keyof T
  const localizedValue = item[localizedKey]

  return (localizedValue as string) || (item[field] as string)
}

// Helper to get localized JSON array
function getLocalizedJsonArray<T>(
  item: T,
  field: keyof T,
  locale: Locale
): string[] {
  if (locale === 'en') {
    return item[field] as string[]
  }

  const localizedKey = `${String(field)}_${locale}` as keyof T
  const localizedValue = item[localizedKey]

  return (localizedValue as string[]) || (item[field] as string[])
}

export async function getProfessionalSummary(locale: Locale) {
  const summary = await prisma.professionalSummary.findFirst()

  if (!summary) return null

  return {
    headline: getLocalizedField(summary, 'headline', locale),
    tagline: getLocalizedField(summary, 'tagline', locale),
    bio: getLocalizedField(summary, 'bio', locale),
    highlights: getLocalizedJsonArray(summary, 'highlights', locale),
  }
}

export async function getCurrentRoles(locale: Locale) {
  const roles = await prisma.role.findMany({
    where: { current: true },
    orderBy: { order: 'asc' },
  })

  return roles.map((role) => ({
    id: role.id,
    slug: role.slug,
    title: getLocalizedField(role, 'title', locale),
    company: role.company,
    type: role.type,
    description: getLocalizedField(role, 'description', locale),
  }))
}

export async function getCompanies(locale: Locale) {
  const companies = await prisma.company.findMany({
    orderBy: { order: 'asc' },
  })

  return companies.map((company) => ({
    id: company.id,
    slug: company.slug,
    name: company.name,
    tagline: getLocalizedField(company, 'tagline', locale),
    description: getLocalizedField(company, 'description', locale),
    url: company.url,
    services: getLocalizedJsonArray(company, 'services', locale),
    icon: company.icon,
  }))
}

export async function getFeaturedProjects(locale: Locale) {
  const projects = await prisma.project.findMany({
    where: {
      featured: true,
      professions: { has: 'engineer' },
    },
    orderBy: { order: 'asc' },
  })

  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: getLocalizedField(project, 'name', locale),
    tagline: getLocalizedField(project, 'tagline', locale),
    description: getLocalizedField(project, 'description', locale),
    impact: project.impact
      ? getLocalizedField(project, 'impact', locale)
      : null,
    techStack: project.techStack as string[],
    status: project.status,
    links: project.links as { demo?: string; github?: string; site?: string } | null,
  }))
}

export async function getTechStack(locale: Locale) {
  const categories = await prisma.techCategory.findMany({
    include: {
      technologies: {
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { order: 'asc' },
  })

  return categories.map((category) => ({
    id: category.id,
    name: getLocalizedField(category, 'name', locale),
    icon: category.icon,
    items: category.technologies.map((t) => t.name),
  }))
}

export async function getWorkExperience(locale: Locale) {
  const experiences = await prisma.workExperience.findMany({
    orderBy: { order: 'asc' },
  })

  return experiences.map((exp) => ({
    id: exp.id,
    title: getLocalizedField(exp, 'title', locale),
    company: exp.company,
    description: getLocalizedField(exp, 'description', locale),
    startDate: exp.startDate,
    endDate: exp.endDate,
    current: exp.current,
    highlights: exp.highlights
      ? getLocalizedJsonArray(exp, 'highlights', locale)
      : null,
    skills: exp.skills,
  }))
}

export async function getBands(locale: Locale) {
  const bands = await prisma.band.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })

  return bands.map((band) => ({
    id: band.id,
    slug: band.slug,
    name: band.name,
    genre: band.genre,
    role: band.role,
    description: getLocalizedField(band, 'description', locale),
    url: band.url,
  }))
}

export async function getAboutMe(professionId: string, locale: Locale) {
  const about = await prisma.aboutMe.findUnique({
    where: { professionId },
  })

  if (!about) return null

  return {
    professionId: about.professionId,
    headline: getLocalizedField(about, 'headline', locale),
    bio: getLocalizedField(about, 'bio', locale),
    quickFacts: getLocalizedJsonArray(about, 'quickFacts', locale),
  }
}

// Combined function to fetch all CV data at once
export async function getAllCVData(locale: Locale) {
  const [
    professionalSummary,
    currentRoles,
    companies,
    featuredProjects,
    techStack,
    workExperience,
  ] = await Promise.all([
    getProfessionalSummary(locale),
    getCurrentRoles(locale),
    getCompanies(locale),
    getFeaturedProjects(locale),
    getTechStack(locale),
    getWorkExperience(locale),
  ])

  return {
    professionalSummary,
    currentRoles,
    companies,
    featuredProjects,
    techStack,
    workExperience,
  }
}
