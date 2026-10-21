'use client'

import Link from 'next/link'
import { LanguageSwitcher } from '@/components/cv/LanguageSwitcher'
import { DownloadPdfButton } from '@/components/cv/DownloadPdfButton'
import { useCVData } from '@/components/cv/CVDataProvider'
import { jobYears } from '@/components/cv/sectionText'
import { NameWords } from '@/components/cv/NameWords'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'

// A link's text without its scheme: https://www.linkedin.com/in/x/ reads www.linkedin.com/in/x.
const shownUrl = (url: string): string => url.replace(/^https?:\/\//, '').replace(/\/$/, '')

export function CVContent() {
  const { fullName, contact, professionalSummary, currentRoles, companies, featuredProjects, techStack, workExperience, labels } =
    useCVData()
  const { cvPage } = labels

  // A running job has no end date, so it ends in the label for now.
  const yearRange = (job: (typeof workExperience)[number]): string => {
    const { start, end } = jobYears(job, labels.years.present)
    return `${start} - ${end}`
  }

  // Find company URL by slug matching role slug
  const getCompanyUrl = (roleSlug: string): string | undefined => {
    const company = companies.find((c) => c.slug === roleSlug)
    return company?.url
  }

  return (
    <>
      {/* Toolbar - hidden in print, pinned to the top at every width. Leaving the CV on the left, the CV's own
          controls together on the right. A client side link keeps the world and the profession picked before
          opening the CV. */}
      <nav
        aria-label={labels.navigation.primaryNavigation}
        className="sticky top-0 z-40 border-b border-gray-200 bg-white print:hidden"
      >
        <div className="max-w-[850px] mx-auto px-4 py-3 sm:px-8 flex flex-wrap justify-between items-center gap-x-4 gap-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-700 rounded px-1 py-1 hover:text-black hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span aria-hidden="true">&larr;</span>
            {cvPage.backToSite}
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <LanguageSwitcher />
            <DownloadPdfButton label={cvPage.downloadPdf} />
          </div>
        </div>
      </nav>

      {/* CV Content - this is what gets converted to PDF */}
      <main
        id="cv-content"
        className="max-w-[850px] mx-auto px-4 py-8 sm:px-8 bg-white text-black font-sans scroll-mt-32 sm:scroll-mt-20 [&_header]:scroll-mt-32 [&_section]:scroll-mt-32 sm:[&_header]:scroll-mt-20 sm:[&_section]:scroll-mt-20 print:px-0 print:py-0"
      >
        {/* Header / Contact */}
        <header className="border-b-2 border-black pb-4 mb-6">
          <h1 className="text-[clamp(1.75rem,8vw,1.875rem)] font-bold mb-1">
            <NameWords name={fullName} />
          </h1>
          {professionalSummary && (
            <p className="text-lg text-gray-700 mb-2">{professionalSummary.headline}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
            <span>{contact.email}</span>
            <span aria-hidden="true">|</span>
            <a href={contact.linkedin} className="text-blue-700 underline">
              {shownUrl(contact.linkedin)}
            </a>
          </div>
        </header>

        {/* Professional Summary */}
        {professionalSummary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {cvPage.professionalSummary}
            </h2>
            <p className="text-sm leading-relaxed">{professionalSummary.bio}</p>
          </section>
        )}

        {/* Core Competencies */}
        {professionalSummary && professionalSummary.highlights.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {cvPage.coreCompetencies}
            </h2>
            <ul className="text-sm list-disc list-inside columns-1 sm:columns-2 gap-8">
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
              {cvPage.currentPositions}
            </h2>
            {currentRoles.map((role) => {
              const companyUrl = getCompanyUrl(role.slug)
              return (
                <div key={role.id} className="mb-4">
                  <div className="flex flex-wrap justify-between items-baseline gap-x-4">
                    <h3 className="text-base font-semibold">{role.title}</h3>
                    <span className="text-sm text-gray-600">{labels.years.present}</span>
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
              {cvPage.keyProjects}
            </h2>
            {featuredProjects.map((project) => (
              <div key={project.id} className="mb-4">
                <h3 className="text-base font-semibold">{project.name}</h3>
                <p className="text-sm italic text-gray-700">{project.tagline}</p>
                <p className="text-sm mt-1">{project.description}</p>
                {project.impact && (
                  <p className="text-sm mt-1 font-medium">
                    {labels.cards.impact}: {project.impact}
                  </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  {labels.cards.tech}: {project.techStack.join(', ')}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* Technical Skills */}
        {techStack.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {cvPage.technicalSkills}
            </h2>
            <ul className={`text-sm ${MASONRY_LIST}`}>
              {techStack.map((category) => (
                <li key={category.id} className={MASONRY_ITEM}>
                  <span className="font-semibold">{category.name}:</span>{' '}
                  <span>{category.items.join(', ')}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Professional Experience */}
        {workExperience.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {cvPage.professionalExperience}
            </h2>
            {workExperience.map((exp) => (
              <div key={exp.id} className="mb-4">
                <div className="flex flex-wrap justify-between items-baseline gap-x-4">
                  <h3 className="text-base font-semibold">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {yearRange(exp)}
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

        {/* Education and the languages he speaks */}
        {professionalSummary && (
          <section className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">
              {cvPage.education}
            </h2>
            <p className="text-sm">{professionalSummary.education}</p>
            <p className="text-sm">{professionalSummary.languages}</p>
          </section>
        )}

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
