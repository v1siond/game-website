// One post as Decap writes it: content/blog/<slug>.md, a JSON front matter block (the collection's
// `format: json-frontmatter`, so the site parses it with JSON.parse and needs no YAML package) and the
// Markdown body under it.

export type PostSeries = { id: string; part: number }

export type PostMeta = {
  title: string
  slug: string
  /** YYYY-MM-DD, read in UTC. */
  date: string
  description: string
  keyword: string
  /** A path under /public, e.g. /blog/<slug>/cover.png; a post may have none. */
  cover?: string
  coverAlt?: string
  tags: string[]
  series?: PostSeries
  draft: boolean
}

export type Post = PostMeta & { body: string }

/** What a world's posts section needs of a post: no body, so the page hands the client little. */
export type PostSummary = Pick<PostMeta, 'slug' | 'title' | 'date' | 'description' | 'draft'>

// Decap's json-frontmatter writes the object's braces on their own lines at column 0 ("{" first, "}"
// closing); a nested object closes indented, so the first "}" alone on a line ends the block.
const FRONT_MATTER = /^\{[ \t]*\r?\n([\s\S]*?)\r?\n\}[ \t]*(?:\r?\n|$)/

const DATE = /^\d{4}-\d{2}-\d{2}$/

const REQUIRED_TEXT = ['title', 'slug', 'date', 'description', 'keyword'] as const

type FrontMatter = Record<string, unknown>

const missingText = (data: FrontMatter): string[] =>
  REQUIRED_TEXT.filter((key) => typeof data[key] !== 'string' || (data[key] as string).trim() === '')

const tagsOf = (data: FrontMatter): string[] => (Array.isArray(data.tags) ? data.tags.map(String) : [])

const textOf = (value: unknown): string | undefined => (typeof value === 'string' && value !== '' ? value : undefined)

const seriesOf = (value: unknown): PostSeries | undefined => {
  if (!value || typeof value !== 'object') return undefined
  const { id, part } = value as Record<string, unknown>
  if (typeof id !== 'string' || id === '') return undefined
  return { id, part: Number(part) }
}

const frontMatterOf = (source: string, file: string): { data: FrontMatter; body: string } => {
  const match = FRONT_MATTER.exec(source)
  if (!match) throw new Error(`${file}: no JSON front matter (the file must open with "{" on its own line)`)
  return { data: JSON.parse(`{${match[1]}}`) as FrontMatter, body: source.slice(match[0].length) }
}

/** The post one file holds. Throws, naming the file, when the front matter is missing, is not JSON, or
 *  lacks a title, slug, date (YYYY-MM-DD), description or keyword. */
export function postFrom(source: string, file: string): Post {
  const { data, body } = frontMatterOf(source, file)
  const missing = missingText(data)
  if (missing.length > 0) throw new Error(`${file}: missing ${missing.join(', ')}`)
  if (!DATE.test(data.date as string)) throw new Error(`${file}: date must be YYYY-MM-DD, got ${String(data.date)}`)

  return {
    title: data.title as string,
    slug: data.slug as string,
    date: data.date as string,
    description: data.description as string,
    keyword: data.keyword as string,
    cover: textOf(data.cover),
    coverAlt: textOf(data.coverAlt),
    tags: tagsOf(data),
    series: seriesOf(data.series),
    // Decap's default for a new post is a draft; a file without the flag is treated the same way.
    draft: data.draft !== false,
    body: body.replace(/^\s*\n/, ''),
  }
}

/** The post without its body. */
export const summaryOf = ({ slug, title, date, description, draft }: PostMeta): PostSummary => ({ slug, title, date, description, draft })

const SHOWN_DATE = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: 'numeric' })

/** A post's YYYY-MM-DD date as the instant that day starts in UTC. */
export const postDay = (date: string): Date => new Date(`${date}T00:00:00Z`)

/** "2026-10-26" as "Oct 26, 2026", read in UTC so the day never shifts with the server's zone. */
export const shownDate = (date: string): string => SHOWN_DATE.format(postDay(date))
