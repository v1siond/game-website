#!/usr/bin/env node
// Fails when an English CV string in content/cv no longer matches the job history it was copied from,
// or when a project fact has no commit in the history's repo evidence behind it.
// Usage: node scripts/check-cv-text.mjs [path/to/HISTORY.md]   (or CV_HISTORY=path)
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_HISTORY =
  '/home/visiond/projects/insurance_apps/.claude-workspace/game-engine/specs/10-21-cv-site/HISTORY.md'
const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'cv')

// Files whose English comes from the history. companies, roles and tech-stack were first copied from the old hand written data files.
const HISTORY_FILES = ['summary', 'contact', 'experience', 'projects', 'bands', 'martial-arts', 'services']

// Keys that hold identifiers or machine values, never prose from the history. Project `details` are
// summaries of commits, checked through content/cv/_sources.json instead.
const SKIPPED_KEYS = new Set(['id', 'slug', 'startDate', 'endDate', 'status', 'icon', 'type', 'details'])

// Strings set outside the history, each with the decision that set it.
const APPROVED = new Map([
  ['Built PMX, InsurAdmin and GRCTechMe. Saved the SecureBancard launch. Led the Clutch Prep B2B product through its acquisition by Pearson. Insurance, payments, education and AI products, from Elixir backends to React apps.', 'C49, the hero tagline he approved on 10-23 (5ce1942e), restored on his 11-22 ask'],
  ['AI Architecture & Compliance: Successfully navigated compliance to launch GRCTechMe on the Google Cloud Marketplace. Expert in secure LLM orchestration (Gemini, Claude), secure enterprise AI portals, and custom audio TTS synthesis pipelines (e.g., edge-tts).', 'C49, his LinkedIn About highlight as of 90d92328^ (Google Cloud Marketplace, his 10-23 correction in 5ce1942e)'],
  ['Lima, Peru', 'HISTORY: "a dojo in lima peru", written as a place'],
  ['Remote, working US Eastern and Italian hours.', 'contact availability, the hours first and remote added to the cv-site.md Contract line (HISTORY line 144); HISTORY \'His answers to the content audit\' Remote line (line 329), changelog AllThemes item 30 ("yeah sure, remote")'],
  ['Full stack and mobile apps', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 33, 239, 240, 246, 250 (mobile kept, his 37)'],
  ['Your product built end to end, web or mobile, from the first commit to paying users.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 33, 239, 240, 246, 250 (mobile kept, his 37)'],
  ['AI features, agents and prototypes', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 171 to 172, 250, 299, 302'],
  ['Getting projects over the line', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 35, 75, 89, 249, 320'],
  ['A late launch or a stuck codebase: I learn the system, finish it and handle the legacy migration.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 35, 75, 89, 249, 320'],
  ['Backend, API and cloud development', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 234, 239, 240, 245, 246, 317'],
  ['Frontend development', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 106 to 107, 234, 239, 250, 301'],
  ['React, Next and Vue interfaces built pixel perfect to your design and to WCAG AA or AAA.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 106 to 107, 234, 239, 250, 301'],
  ['Architecture, technical leadership and PM', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 75, 92, 148, 193 (no roadmap or code reviews, his 38)'],
  ['Insurance, fintech and edtech software', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 52, 188, 194, 195, 200'],
  ['Document and data parsers', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 54, 235, 240'],
  ['PDFs, ACORD XML and CSV feeds turned into clean data your app can use.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 54, 235, 240'],
  ['App marketplace launches', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 92, 192, 202, 249, 301, 314'],
  ['Security and accessibility audits', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 301 to 303, 322 to 323'],
  ['PMX', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; full stack HISTORY lines 33, 239; frontend line 239 (Next client); marketplace lines 192, 301'],
  ['InsurAdmin', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; full stack HISTORY lines 52, 240; backend line 240; architecture line 193 (CTO); insurance lines 52, 193; parsers line 240 (ACORD feeds)'],
  ['Sillabo', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; full stack HISTORY line 250 (api, web, mobile); AI line 250 (Claude tutor and judge, STT and TTS); frontend line 250 (Next web)'],
  ['Datepal', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; full stack HISTORY line 246 (Phoenix backend, Flutter app); backend line 246; architecture lines 148, 199 (co PM and development lead)'],
  ['GRCTechMe', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; AI HISTORY lines 171 to 172; over the line line 249 (Firestore to PostgreSQL); architecture lines 92, 202 (CTO); marketplace lines 92, 202; audits lines 302 to 303 and his 36 ("we can add grctechme")'],
  ['SecureBancard', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; over the line HISTORY lines 35, 89, 320; fintech line 194'],
  ['Pearson Channels', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; over the line HISTORY lines 75, 100 (ClutchPrep data migration); architecture lines 75, 195 (co-architect); edtech line 195 (video learning)'],
  ['Agency Rocket', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; backend HISTORY lines 234, 317; frontend lines 234, 257 (Vue app, main frontend developer); insurance line 188; parsers lines 54, 235'],
  ['Firestorm', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; backend HISTORY line 245 (rebuilt in Ash)'],
  ['BCharitable', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; fintech HISTORY lines 200, 247 (ACH and Stripe)'],
  ['WJV', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; parsers HISTORY line 235 (wjv-parser)'],
  ['ProctorU', 'use case, changelog AllThemes 32, 36 to 38, C28 A3; audits HISTORY lines 322 to 323 (WCAG AAA updates)'],
  ['Send me the project and the date it has to ship.', 'C42 copy audit, his 11-09 words'],
  ['InsurAdmin: built it from scratch to manage carrier feeds and agency teams.', 'C42 copy audit, his 11-09 words'],
  ['Agency Rocket: built the annuity, IUL and whole life parsers and the Stripe billing for the suite (My New Retirement, Wealth United, Debt Action Plan).', 'C42 copy audit, his 11-09 words'],
  ['PMX Affiliate Marketplace: built and launched the whole stack and its native Shopify integration.', 'C42 copy audit, his 11-09 words'],
  ['Truth Social: backend engineer in the early stages. Scaled the Rails backend with Mastodon core developers.', 'C42 copy audit, his 11-09 words'],
  ['Planned and ran the migration of the legacy SQL data into Pearson\'s NoSQL stores.', 'C42 copy audit, his 11-09 words'],
  ['Built exam preps, video lessons and shared widgets.', 'C42 copy audit, his 11-09 words'],
  ['Engineering lead of the Clutch Prep B2B product through its acquisition by Pearson.', 'C42 copy audit, his 11-09 words'],
  ['Online courses for software developers. I built the platform and taught on it, mostly frontend.', 'C42 copy audit, his 11-09 words'],
  ['Pixel perfect builds from designs, before Figma existed.', 'C42 copy audit, his 11-09 words'],
  ['The marketing suite behind My New Retirement, Wealth United and Debt Action Plan.', 'C42 copy audit, his 11-09 words'],
  ['Built and launched the full stack', 'C42 copy audit, his 11-09 words'],
  ['A Rails and GraphQL API, a Next client and a native Shopify app.', 'C42 copy audit, his 11-09 words'],
  ['Carrier feeds, commission files and agency teams in one app.', 'C42 copy audit, his 11-09 words'],
  ['Payment processing for independent sales organizations and software vendors, on its Pioneer platform', 'C42 copy audit, his 11-09 words'],
  ['Built 80% of the Dual BIN support alone', 'C42 copy audit, his 11-09 words'],
  ['Moved all of Clutch Prep\'s data into it and built its exam preps, video lessons and shared widgets.', 'C42 copy audit, his 11-09 words'],
  ['B2B lead', 'C42 copy audit, his 11-09 words'],
  ['Acquired by Pearson', 'C42 copy audit, his 11-09 words'],
  ['Passed the marketplace review on the first try', 'C42 copy audit, his 11-09 words'],
  ['Started as assistant trainer, then certified as an instructor.', 'C42 copy audit, his 11-09 words'],
  ['Training for the national championship.', 'C42 copy audit, his 11-09 words'],
  ['I\'ve trained martial arts since I was 19: Siscomada, Choson Mu Sul, wrestling, jiu-jitsu, MMA and Muay Thai.', 'C42 copy audit, his 11-09 words'],
  ['The APIs, integrations and background jobs your product runs on. Elixir, Phoenix or Rails, deployed to Kubernetes through CI.', 'C42 copy audit, his 11-09 words'],
  ['Your app listed on the Shopify App Store or Google Cloud Marketplace. I handle the procurement setup, the webhooks and the review.', 'C42 copy audit, his 11-09 words'],
  ['A game engine and map editor for generated worlds. Launching soon.', 'C42 copy audit, his 11-09 words'],
  ['Exact and AI judged grading', 'C42 copy audit, his 11-09 words'],
  ['Speech to text and text to speech', 'C42 copy audit, his 11-09 words'],
  ['I\'m the core engineer and architect for enterprise clients and startups. I rewrite systems, ship launches against compliance deadlines and build new products.', 'C42 wording audit round 2 (score/C42/audit.md) finding 9, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Datepal: co PM and development lead of a dating app on Phoenix and Ash.', 'C42 wording audit round 2 (score/C42/audit.md) finding 11, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['SecureBancard: saved the launch by building most of the Dual BIN support alone, in time for the compliance deadline.', 'C42 wording audit round 2 (score/C42/audit.md) finding 10 (the 80% lives in the project impact), his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Co-architected Pearson Channels with the core team, nearly from the ground up.', 'C42 wording audit round 2 (score/C42/audit.md) finding 6, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['I led the B2B system that kept schools running through the pandemic.', 'C42 wording audit round 2 (score/C42/audit.md) finding 12, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['One of my most popular series: pixel art characters with shadows in pure CSS.', 'C42 wording audit round 2 (score/C42/audit.md) finding 14, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Lessons on Sass, Stylus, ITCSS, JavaScript and WCAG AAA audits.', 'C42 wording audit round 2 (score/C42/audit.md) finding 15, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Built its core: the policy parsers and the Stripe billing', 'C42 wording audit round 2 (score/C42/audit.md) finding 19, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Testimonials report 5x business and months over $50,000', 'C42 wording audit round 2 (score/C42/audit.md) finding 24, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Billing, inside the Agency Rocket suite', 'C42 wording audit round 2 (score/C42/audit.md) finding 20, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Set up inside the Agency Rocket suite', 'C42 wording audit round 2 (score/C42/audit.md) finding 20, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Top client grew affiliate ROAS from between 2x and 3x to 5.5x', 'C42 wording audit round 2 (score/C42/audit.md) finding 17, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Management software for insurance agencies and IMOs', 'C42 wording audit round 2 (score/C42/audit.md) finding 28, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['I learned the multi BIN domain and ported thousands of lines, with hundreds of queries and mutations, from Node.js to Elixir by hand.', 'C42 wording audit round 2 (score/C42/audit.md) finding 22, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Clutch Prep\'s B2B product for schools', 'C42 wording audit round 2 (score/C42/audit.md) finding 12, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['My game engine for generated worlds', 'C42 wording audit round 2 (score/C42/audit.md) finding 26, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['A dating app where coupled friends invite singles to events. Singles rank each other and get matched into small groups from those circles.', 'C42 wording audit round 2 (score/C42/audit.md) finding 11, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Early backend architecture and features, built while the company hired the full team', 'C42 wording audit round 2 (score/C42/audit.md) finding 18, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Governance, risk and compliance app for lawyers and agencies.', 'C42 wording audit round 2 (score/C42/audit.md) finding 23, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Italian lessons with an AI tutor that explains in Spanish', 'C42 wording audit round 2 (score/C42/audit.md) finding 27, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Party bands at bars and private events, including Retrogroove and Arpegio.', 'C42 wording audit round 2 (score/C42/audit.md) finding 37, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Fought in tournaments including Top Combat and the national championship.', 'C42 wording audit round 2 (score/C42/audit.md) finding 37, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['LLM features, agents, chat and voice on Claude or Gemini. I prototype them fast and take them to production.', 'C42 wording audit round 2 (score/C42/audit.md) finding 32, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['I design the system and lead your team to ship it, as CTO, tech lead or PM.', 'C42 wording audit round 2 (score/C42/audit.md) finding 35, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['I already know your market: carrier feeds and commissions, payment platforms, video learning.', 'C42 wording audit round 2 (score/C42/audit.md) finding 33, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['I audit your app for security and WCAG and fix what I find. I also do the process work for ISO 9001 and ISO 27001.', 'C42 wording audit round 2 (score/C42/audit.md) finding 34, his 11-21 ask to remove the AI patterns, facts unchanged'],
  ['Sillabo turns a course written by people into an AI course. Italian for Spanish speakers.', 'C42 wording audit round 2 (score/C42/audit.md) finding 31, his 11-21 ask to remove the AI patterns, facts unchanged'],
])

const normalise = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase()
const withoutScheme = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '')
const isUrl = (text) => /^https?:\/\//.test(text)

// A string of several sentences matches when every sentence is a span of the history.
const sentences = (text) =>
  text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((sentence) => sentence.replace(/\.$/, ''))
    .filter(Boolean)

const strings = (value, path) => {
  if (typeof value === 'string') return value === '' ? [] : [{ path, text: value }]
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${path}[${index}]`))
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([key]) => !SKIPPED_KEYS.has(key))
      .flatMap(([key, item]) => strings(item, `${path}.${key}`))
  }
  return []
}

const matches = (history) => (text) => {
  if (APPROVED.has(text)) return true
  if (isUrl(text)) return history.includes(normalise(withoutScheme(text)))
  return sentences(text).every((sentence) => history.includes(normalise(sentence)))
}

const historyPath = process.argv[2] ?? process.env.CV_HISTORY ?? DEFAULT_HISTORY
const history = normalise(readFileSync(historyPath, 'utf8').replace(/\*\*/g, ''))
const inHistory = matches(history)

const englishOf = (file) => JSON.parse(readFileSync(join(CONTENT_DIR, `${file}.json`), 'utf8')).en

// His own products (featured ventures) were written from the history, so their English is checked like the history files.
const featuredVentures = englishOf('companies')
  .companies.filter(({ featured }) => featured)
  .flatMap((company) => strings(company, `companies.${company.id}`))

const checked = [...HISTORY_FILES.flatMap((file) => strings(englishOf(file), file)), ...featuredVentures]
const mismatches = checked.filter(({ text }) => !inHistory(text))

// A fact passes when _sources.json holds it word for word with at least one sha, and every sha is in the history.
const sources = JSON.parse(readFileSync(join(CONTENT_DIR, '_sources.json'), 'utf8'))
const { en: projectsEn } = JSON.parse(readFileSync(join(CONTENT_DIR, 'projects.json'), 'utf8'))
const facts = projectsEn.projects.flatMap(({ slug, details }) =>
  details.map((text, index) => ({ path: `projects.${slug}.details[${index}]`, text, source: sources[slug]?.details[index] })),
)
const factIsBacked = ({ text, source }) =>
  source?.fact === text && source.shas.length > 0 && source.shas.every((sha) => history.includes(sha.toLowerCase()))
const unbacked = facts.filter((fact) => !factIsBacked(fact))

mismatches.forEach(({ path, text }) => console.log(`MISMATCH ${path}: ${text}`))
unbacked.forEach(({ path, text }) => console.log(`UNBACKED ${path}: ${text}`))
console.log(`${checked.length} English strings checked against ${historyPath}, ${mismatches.length} mismatches`)
console.log(`${facts.length} project facts checked against their shas, ${unbacked.length} unbacked`)
process.exit(mismatches.length + unbacked.length === 0 ? 0 : 1)
