'use client'

import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { DownloadPdfButton } from '@/components/cv/DownloadPdfButton'
import type { Locale } from '@/i18n/config'

interface CVData {
  professionalSummary: {
    headline: string
    tagline: string
    bio: string
    highlights: string[]
  } | null
  currentRoles: Array<{
    id: string
    slug: string
    title: string
    company: string
    type: string
    description: string
  }>
  companies: Array<{
    id: string
    slug: string
    name: string
    tagline: string
    description: string
    url: string
    services: string[]
    icon: string
  }>
  featuredProjects: Array<{
    id: string
    slug: string
    name: string
    tagline: string
    description: string
    impact: string | null
    techStack: string[]
    status: string
    links: { demo?: string; github?: string; site?: string } | null
  }>
  techStack: Array<{
    id: string
    name: string
    icon: string
    items: string[]
  }>
  workExperience: Array<{
    id: string
    title: string
    company: string
    description: string
    startDate: Date
    endDate: Date | null
    current: boolean
    highlights: string[] | null
    skills: string[]
  }>
}

interface Translations {
  downloadPdf: string
  professionalSummary: string
  coreCompetencies: string
  currentPositions: string
  keyProjects: string
  technicalSkills: string
  professionalExperience: string
  education: string
  educationText: string
  present: string
  impact: string
  tech: string
}

interface CVContentProps {
  cvData: CVData
  translations: Translations
  locale: Locale
}

function formatDateRange(
  startDate: Date,
  endDate: Date | null,
  current: boolean,
  presentLabel: string
): string {
  const start = new Date(startDate)
  const startYear = start.getFullYear()

  if (current || !endDate) {
    return `${startYear} - ${presentLabel}`
  }

  const end = new Date(endDate)
  const endYear = end.getFullYear()

  return `${startYear} - ${endYear}`
}

export function CVContent({ cvData, translations, locale }: CVContentProps) {
  const { professionalSummary, currentRoles, companies, featuredProjects, techStack, workExperience } = cvData

  // Find company URL by slug matching role slug
  const getCompanyUrl = (roleSlug: string): string | undefined => {
    const company = companies.find((c) => c.slug === roleSlug)
    return company?.url
  }

  return (
    <>
      {/* Toolbar - hidden in print */}
      <div className="max-w-[850px] mx-auto px-8 pt-6 pb-4 flex justify-between items-center print:hidden">
        <LanguageSwitcher />
        <DownloadPdfButton label={translations.downloadPdf} />
      </div>

      {/* CV Content - this is what gets converted to PDF */}
      <main
        id="cv-content"
        className="max-w-[850px] mx-auto px-8 py-8 bg-white text-black font-sans print:px-0 print:py-0"
      >
        {/* Header / Contact */}
        <header className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-3xl font-bold mb-1">Alexander Pulido</h1>
          {professionalSummary && (
            <p className="text-lg text-gray-700 mb-2">{professionalSummary.headline}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>alexanderpulido81@gmail.com</span>
            <span>|</span>
            <a href="https://dbadbadba.com" className="text-blue-700 underline">
              dbadbadba.com
            </a>
            <span>|</span>
            <a
              href="https://github.com/alexanderpulido"
              className="text-blue-700 underline"
            >
              github.com/alexanderpulido
            </a>
            <span>|</span>
            <a
              href="https://linkedin.com/in/alexanderpulido"
              className="text-blue-700 underline"
            >
              linkedin.com/in/alexanderpulido
            </a>
          </div>
        </header>

        {/* Professional Summary */}
        {professionalSummary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {translations.professionalSummary}
            </h2>
            <p className="text-sm leading-relaxed">{professionalSummary.bio}</p>
          </section>
        )}

        {/* Core Competencies */}
        {professionalSummary && professionalSummary.highlights.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {translations.coreCompetencies}
            </h2>
            <ul className="text-sm list-disc list-inside columns-2 gap-8">
              {professionalSummary.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Current Positions */}
        {currentRoles.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {translations.currentPositions}
            </h2>
            {currentRoles.map((role) => {
              const companyUrl = getCompanyUrl(role.slug)
              return (
                <div key={role.id} className="mb-4">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-semibold">{role.title}</h3>
                    <span className="text-sm text-gray-600">{translations.present}</span>
                  </div>
                  <p className="text-sm italic text-gray-700">
                    {role.company}
                    {companyUrl && ` - ${companyUrl}`}
                  </p>
                  <p className="text-sm mt-1">{role.description}</p>
                </div>
              )
            })}
          </section>
        )}

        {/* Key Projects & Achievements */}
        {featuredProjects.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {translations.keyProjects}
            </h2>
            {featuredProjects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="text-base font-semibold">{project.name}</h3>
                <p className="text-sm italic text-gray-700">{project.tagline}</p>
                <p className="text-sm mt-1">{project.description}</p>
                {project.impact && (
                  <p className="text-sm mt-1 font-medium">
                    {translations.impact}: {project.impact}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {translations.tech}: {project.techStack.join(', ')}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills */}
        {techStack.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {translations.technicalSkills}
            </h2>
            <div className="text-sm space-y-2">
              {techStack.map((category) => (
                <div key={category.id}>
                  <span className="font-semibold">{category.name}:</span>{' '}
                  <span>{category.items.join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {translations.professionalExperience}
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-semibold">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {formatDateRange(exp.startDate, exp.endDate, exp.current, translations.present)}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700">{exp.company}</p>
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="text-sm list-disc list-inside mt-1 space-y-1">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Education & Certifications */}
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
            {translations.education}
          </h2>
          <p className="text-sm">{translations.educationText}</p>
        </section>

        {/* Print styles */}
        <style jsx global>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:px-0 {
              padding-left: 0;
              padding-right: 0;
            }
            .print\\:py-0 {
              padding-top: 0;
              padding-bottom: 0;
            }
            a {
              text-decoration: none !important;
            }
          }
          @page {
            margin: 0.5in;
          }
        `}</style>
      </main>
    </>
  )
}
