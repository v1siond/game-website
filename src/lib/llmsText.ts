import { CV_PATHS, locales } from '@/i18n/config'
import type { CVData } from './cv/content'
import { absoluteUrl, siteDescription } from './seo'

type LlmsFacts = Pick<CVData, 'fullName' | 'professionalSummary' | 'contact' | 'techStack' | 'services' | 'labels'>

// /llms.txt in the llmstxt.org shape: one H1, a summary blockquote, then H2 sections of Markdown lists,
// built from the CV content so an edit at /admin changes it too.

const cvLinks = ({ labels }: LlmsFacts): string[] =>
  locales.map((locale) => `- [${labels.actions.cv} (${labels.languages[locale]})](${absoluteUrl(CV_PATHS[locale])})`)

const serviceLines = ({ services }: LlmsFacts): string[] => services.map((service) => `- ${service.title}: ${service.line}`)

/** The text AI crawlers read at /llms.txt: who he is, where his CV is in each language, what he offers. */
export function llmsText(cv: LlmsFacts): string {
  return [
    `# ${cv.fullName}`,
    '',
    `> ${siteDescription(cv)}`,
    '',
    cv.professionalSummary.bio,
    '',
    `## ${cv.labels.actions.cv}`,
    '',
    ...cvLinks(cv),
    '',
    `## ${cv.labels.sections.services}`,
    '',
    ...serviceLines(cv),
    '',
  ].join('\n')
}
