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
  ['AI Architecture & Compliance: Successfully navigated compliance to launch GRCTechMe on the Google Cloud Marketplace. Expert in secure LLM orchestration (Gemini, Claude), secure enterprise AI portals, and custom audio TTS synthesis pipelines (e.g., edge-tts).', 'LinkedIn About, his paste 2026-10-21 (HISTORY line 171), with the listing named Google Cloud Marketplace: HISTORY line 314, changelog item 26 point 3, C17 audit section 2 Hero finding 5'],
  ['Built PMX, InsurAdmin and GRCTechMe. Saved the SecureBancard launch. Led the Clutch Prep B2B product through its acquisition by Pearson. Insurance, payments, education and AI products, from Elixir backends to React apps.', 'C17 audit section 4 tagline and markets line, facts from HISTORY lines 33, 52, 92, 35, 81 and census lines 40, 281, 254; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Always interested in hearing new ideas and proposals. Send the project and the date it has to ship.', 'contact line from cv-site.md Contract (HISTORY line 144), the rest of the line once the availability sentence moved to its own key'],
  ['Remote, working US Eastern and Italian hours.', 'contact availability, the hours first and remote added to the cv-site.md Contract line (HISTORY line 144); HISTORY \'His answers to the content audit\' Remote line (line 329), changelog AllThemes item 30 ("yeah sure, remote")'],
  ['Full stack and mobile apps', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 33, 239, 240, 246, 250 (mobile kept, his 37)'],
  ['Your product built end to end, web or mobile, from the first commit to paying users.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 33, 239, 240, 246, 250 (mobile kept, his 37)'],
  ['AI features, agents and prototypes', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 171 to 172, 250, 299, 302'],
  ['LLM features, agents, chat and voice on Claude or Gemini, prototyped fast and taken to production.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 171 to 172, 250, 299, 302'],
  ['Getting projects over the line', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 35, 75, 89, 249, 320'],
  ['A late launch or a stuck codebase: I learn the system, finish it and handle the legacy migration.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 35, 75, 89, 249, 320'],
  ['Backend, API and cloud development', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 234, 239, 240, 245, 246, 317'],
  ['The APIs, integrations and background jobs your product runs on, in Elixir, Phoenix or Rails, on Kubernetes with CI.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 234, 239, 240, 245, 246, 317'],
  ['Frontend development', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 106 to 107, 234, 239, 250, 301'],
  ['React, Next and Vue interfaces built pixel perfect to your design and to WCAG AA or AAA.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 106 to 107, 234, 239, 250, 301'],
  ['Architecture, technical leadership and PM', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 75, 92, 148, 193 (no roadmap or code reviews, his 38)'],
  ['System design and delivery for your team, as CTO, tech lead or PM.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 75, 92, 148, 193 (no roadmap or code reviews, his 38)'],
  ['Insurance, fintech and edtech software', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 52, 188, 194, 195, 200'],
  ['Someone who already knows your market: carrier feeds and commissions, payment platforms, video learning.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 52, 188, 194, 195, 200'],
  ['Document and data parsers', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 54, 235, 240'],
  ['PDFs, ACORD XML and CSV feeds turned into clean data your app can use.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 54, 235, 240'],
  ['App marketplace launches', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 92, 192, 202, 249, 301, 314'],
  ['Your app on the Shopify App Store or Google Cloud Marketplace, procurement, webhooks and review included.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 92, 192, 202, 249, 301, 314'],
  ['Security and accessibility audits', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 301 to 303, 322 to 323'],
  ['Security and WCAG AA or AAA audits with the fixes, and the process work for ISO 9001 and ISO 27001.', 'changelog AllThemes 32, 36 to 38, C28 A3; HISTORY lines 301 to 303, 322 to 323'],
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
