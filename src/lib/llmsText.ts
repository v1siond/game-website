import { CV_PATHS, locales } from '@/i18n/config'
import type { CVData } from './cv/content'
import { absoluteUrl, siteDescription } from './seo'
import type { PostMeta } from './blog/post'
import { postPath } from './blog/links'

type LlmsFacts = Pick<CVData, 'fullName' | 'professionalSummary' | 'contact' | 'techStack' | 'services' | 'labels'>

// /llms.txt in the llmstxt.org shape: one H1, a summary blockquote, then H2 sections of Markdown lists,
// built from the CV content so an edit at /admin changes it too.

const cvLinks = ({ labels }: LlmsFacts): string[] =>
  locales.map((locale) => `- [${labels.actions.cv} (${labels.languages[locale]})](${absoluteUrl(CV_PATHS[locale])})`)

const serviceLines = ({ services }: LlmsFacts): string[] => services.map((service) => `- ${service.title}: ${service.line}`)

// The posts the build lists (drafts never reach a production build), or no section with none.
const postSection = ({ labels }: LlmsFacts, posts: readonly PostMeta[]): string[] => {
  if (posts.length === 0) return []
  return [`## ${labels.sections.posts}`, '', ...posts.map((post) => `- [${post.title}](${absoluteUrl(postPath(post.slug))}): ${post.description}`), '']
}

/** The text AI crawlers read at /llms.txt: who he is, where his CV is in each language, what he offers,
 *  and the posts it is given. */
export function llmsText(cv: LlmsFacts, posts: readonly PostMeta[]): string {
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
    ...postSection(cv, posts),
  ].join('\n')
}
