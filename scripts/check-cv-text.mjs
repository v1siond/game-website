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
  ['Lima, Peru', 'HISTORY: "a dojo in lima peru", written as a place'],
  ['Built PMX, InsurAdmin and GRCTechMe. Saved the SecureBancard launch. Led the Clutch Prep B2B product through its acquisition by Pearson. Insurance, payments, education and AI products, from Elixir backends to React apps.', 'C17 audit section 4 tagline and markets line, facts from HISTORY lines 33, 52, 92, 35, 81 and census lines 40, 281, 254; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Remote, working US Eastern and Italian hours.', 'contact availability, the hours first and remote added to the cv-site.md Contract line (HISTORY line 144); HISTORY \'His answers to the content audit\' Remote line (line 329), changelog AllThemes item 30 ("yeah sure, remote")'],
  ['Full stack and mobile apps', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 33, 239, 240, 246, 250 (mobile kept, his 37)'],
  ['Your product built end to end, web or mobile, from the first commit to paying users.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 33, 239, 240, 246, 250 (mobile kept, his 37)'],
  ['AI features, agents and prototypes', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 171 to 172, 250, 299, 302'],
  ['LLM features, agents, chat and voice on Claude or Gemini, prototyped fast and taken to production.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 171 to 172, 250, 299, 302'],
  ['Getting projects over the line', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 35, 75, 89, 249, 320'],
  ['A late launch or a stuck codebase: I learn the system, finish it and handle the legacy migration.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 35, 75, 89, 249, 320'],
  ['Backend, API and cloud development', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 234, 239, 240, 245, 246, 317'],
  ['Frontend development', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 106 to 107, 234, 239, 250, 301'],
  ['React, Next and Vue interfaces built pixel perfect to your design and to WCAG AA or AAA.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 106 to 107, 234, 239, 250, 301'],
  ['Architecture, technical leadership and PM', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 75, 92, 148, 193 (no roadmap or code reviews, his 38)'],
  ['System design and delivery for your team, as CTO, tech lead or PM.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 75, 92, 148, 193 (no roadmap or code reviews, his 38)'],
  ['Insurance, fintech and edtech software', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 52, 188, 194, 195, 200'],
  ['Someone who already knows your market: carrier feeds and commissions, payment platforms, video learning.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 52, 188, 194, 195, 200'],
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
  ['Senior Staff Full-Stack and AI Systems Engineer with 10+ years of experience', 'C42 copy audit, his 11-09 words'],
  ['I design and build fintech and insurance platforms and AI integrations. Teams bring me in when a launch is at risk or a system has to start from zero, and I take it to production. I work in concurrent functional backends like Elixir as easily as in enterprise stacks.', 'C42 copy audit, his 11-09 words'],
  ['Co-architected Pearson Channels nearly from the ground up and moved the relational data into Pearson\'s NoSQL stores with zero downtime.', 'C42 copy audit, his 11-09 words'],
  ['Built the PMX Affiliate Marketplace and its native Shopify integration.', 'C42 copy audit, his 11-09 words'],
  ['Launched GRCTechMe on the Google Cloud Marketplace through its compliance review. I build secure LLM features on Gemini and Claude, enterprise AI portals and text to speech pipelines with edge-tts.', 'C42 copy audit, his 11-09 words'],
  ['Built InsurAdmin from scratch for carrier feeds and agency teams. Built the core of Agency Rocket: its policy parsers and its Stripe billing.', 'C42 copy audit, his 11-09 words'],
  ['Nebulith: my own game engine and map editor, launching soon.', 'C42 copy audit, his 11-09 words'],
  ['Building neural networks from scratch to connect backend systems with AI agents.', 'C42 copy audit, his 11-09 words'],
  ['Backend developer in the early stages of Truth Social. Tuned the Rails backend with Mastodon core developers.', 'C42 copy audit, his 11-09 words'],
  ['Send me the project and the date it has to ship.', 'C42 copy audit, his 11-09 words'],
  ['Core engineer and architect for enterprise clients and startups: system rewrites, launches under compliance deadlines and new products from zero.', 'C42 copy audit, his 11-09 words'],
  ['InsurAdmin: built it from scratch to manage carrier feeds and agency teams.', 'C42 copy audit, his 11-09 words'],
  ['Agency Rocket: built the annuity, IUL and whole life parsers and the Stripe billing for the suite (My New Retirement, Wealth United, Debt Action Plan).', 'C42 copy audit, his 11-09 words'],
  ['Datepal: co PM and development lead of a dating app where coupled friends invite singles to events. Built Veriff age checks, ranking APIs with card stacks, SMS notifications and Stripe checkout on Phoenix and Ash.', 'C42 copy audit, his 11-09 words'],
  ['PMX Affiliate Marketplace: built and launched the whole stack and its native Shopify integration.', 'C42 copy audit, his 11-09 words'],
  ['SecureBancard: saved the launch by building 80% of the Dual BIN support alone, in time for the compliance deadline.', 'C42 copy audit, his 11-09 words'],
  ['Truth Social: backend engineer in the early stages. Scaled the Rails backend with Mastodon core developers.', 'C42 copy audit, his 11-09 words'],
  ['Planned and ran the migration of the legacy SQL data into Pearson\'s NoSQL stores.', 'C42 copy audit, his 11-09 words'],
  ['Built exam preps, video lessons and shared widgets.', 'C42 copy audit, his 11-09 words'],
  ['Engineering lead of the Clutch Prep B2B product through its acquisition by Pearson.', 'C42 copy audit, his 11-09 words'],
  ['Online courses for software developers. I built the platform and taught on it, mostly frontend.', 'C42 copy audit, his 11-09 words'],
  ['One of my most popular series: pixel art characters with shadows in pure CSS, when CSS was still very limited.', 'C42 copy audit, his 11-09 words'],
  ['Lessons on moving CSS to Sass and Stylus, ITCSS, JavaScript and WCAG AAA audits.', 'C42 copy audit, his 11-09 words'],
  ['Pixel perfect builds from designs, before Figma existed.', 'C42 copy audit, his 11-09 words'],
  ['The marketing suite behind My New Retirement, Wealth United and Debt Action Plan.', 'C42 copy audit, his 11-09 words'],
  ['Built and launched the full stack', 'C42 copy audit, his 11-09 words'],
  ['A Rails and GraphQL API, a Next client and a native Shopify app.', 'C42 copy audit, his 11-09 words'],
  ['Carrier feeds, commission files and agency teams in one app.', 'C42 copy audit, his 11-09 words'],
  ['Payment processing for independent sales organizations and software vendors, on its Pioneer platform', 'C42 copy audit, his 11-09 words'],
  ['Learned the multi BIN domain and ported thousands of lines and hundreds of queries and mutations from Node.js to Elixir by hand.', 'C42 copy audit, his 11-09 words'],
  ['Built 80% of the Dual BIN support alone', 'C42 copy audit, his 11-09 words'],
  ['Moved all of Clutch Prep\'s data into it and built its exam preps, video lessons and shared widgets.', 'C42 copy audit, his 11-09 words'],
  ['B2B lead', 'C42 copy audit, his 11-09 words'],
  ['Acquired by Pearson', 'C42 copy audit, his 11-09 words'],
  ['Got it listed on the Google Cloud Marketplace', 'C42 copy audit, his 11-09 words'],
  ['Passed the marketplace review on the first try', 'C42 copy audit, his 11-09 words'],
  ['Party bands at bars and private events, Retrogroove and Arpegio among them.', 'C42 copy audit, his 11-09 words'],
  ['Fought in many tournaments, Top Combat and the national championship among them.', 'C42 copy audit, his 11-09 words'],
  ['Started as assistant trainer, then certified as an instructor.', 'C42 copy audit, his 11-09 words'],
  ['Training for the national championship.', 'C42 copy audit, his 11-09 words'],
  ['I\'ve trained martial arts since I was 19: Siscomada, Choson Mu Sul, wrestling, jiu-jitsu, MMA and Muay Thai.', 'C42 copy audit, his 11-09 words'],
  ['The APIs, integrations and background jobs your product runs on. Elixir, Phoenix or Rails, deployed to Kubernetes through CI.', 'C42 copy audit, his 11-09 words'],
  ['Your app listed on the Shopify App Store or Google Cloud Marketplace. I handle the procurement setup, the webhooks and the review.', 'C42 copy audit, his 11-09 words'],
  ['Security and WCAG AA or AAA audits, and I fix what they find. I also do the process work for ISO 9001 and ISO 27001.', 'C42 copy audit, his 11-09 words'],
  ['A game engine and map editor for generated worlds. Launching soon.', 'C42 copy audit, his 11-09 words'],
  ['Exact and AI judged grading', 'C42 copy audit, his 11-09 words'],
  ['Speech to text and text to speech', 'C42 copy audit, his 11-09 words'],
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
