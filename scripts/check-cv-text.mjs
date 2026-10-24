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
const SKIPPED_KEYS = new Set(['id', 'slug', 'startDate', 'endDate', 'status', 'icon', 'type', 'group', 'details'])

// Strings set outside the history, each with the decision that set it.
const APPROVED = new Map([
  ['Lima, Peru', 'HISTORY: "a dojo in lima peru", written as a place'],
  ['AI Architecture & Compliance: Successfully navigated compliance to launch GRCTechMe on the Google Cloud Marketplace. Expert in secure LLM orchestration (Gemini, Claude), secure enterprise AI portals, and custom audio TTS synthesis pipelines (e.g., edge-tts).', 'LinkedIn About, his paste 2026-10-21 (HISTORY line 171), with the listing named Google Cloud Marketplace: HISTORY line 314, changelog item 26 point 3, C17 audit section 2 Hero finding 5'],
  ['Built PMX, InsurAdmin and GRCTechMe. Saved the SecureBancard launch. Led the Clutch Prep B2B product through its acquisition by Pearson. Insurance, payments, education and AI products, from Elixir backends to React apps.', 'C17 audit section 4 tagline and markets line, facts from HISTORY lines 33, 52, 92, 35, 81 and census lines 40, 281, 254; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Always interested in hearing new ideas and proposals. Send the project and the date it has to ship.', 'contact line from cv-site.md Contract (HISTORY line 144), the rest of the line once the availability sentence moved to its own key'],
  ['Remote, working US Eastern and Italian hours.', 'contact availability, the hours first and remote added to the cv-site.md Contract line (HISTORY line 144); HISTORY \'His answers to the content audit\' Remote line (line 329), changelog AllThemes item 30 ("yeah sure, remote")'],
  ['Full stack products, idea to launch', 'C17 audit section 3 Build row 1; census lines 245, 63, 64, 74; HISTORY lines 239, 240; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['One engineer who takes your product from the first commit to paying users, web and mobile. PMX (2022), InsurAdmin (2024), Sillabo (2026), Datepal web and Flutter app (2026).', 'C17 audit section 3 Build row 1; census lines 245, 63, 64, 74; HISTORY lines 239, 240; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Elixir and Phoenix backends', 'C17 audit section 3 Build row 2; census lines 41, 69; HISTORY lines 234, 240, 245, 246; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['APIs, background jobs and real time features in Elixir, Phoenix, Ash and GraphQL that stay up as you grow. Agency Rocket API since 2018, InsurAdmin (2024), Datepal on Ash (2026), Firestorm rebuilt in Ash and published on Hex (2026).', 'C17 audit section 3 Build row 2; census lines 41, 69; HISTORY lines 234, 240, 245, 246; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Frontends that pass accessibility audits', 'C17 audit section 3 Build row 3; census lines 40, 64, 275; HISTORY line 106; ProctorU AAA from HISTORY line 322 to 323; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['React, Next and Vue interfaces built pixel perfect and to WCAG AA and AAA. Agency Rocket Vue app, largest author since 2018; PMX Next client (2022); Sillabo built to WCAG AAA (2026); AAA accessibility updates for ProctorU; taught WCAG AAA audits at DailyDrip (2017 to 2019).', 'C17 audit section 3 Build row 3; census lines 40, 64, 275; HISTORY line 106; ProctorU AAA from HISTORY line 322 to 323; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Getting a late project over the line', 'C17 audit section 3 Rescue and lead row 1; HISTORY lines 35, 89, 163; SecureBancard 2023 and brought in after 2 months as main backend dev from HISTORY lines 320 to 321; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['You have a launch date and a stuck codebase: I learn the system and ship the missing part. SecureBancard (2023), a DBA client: I came in as main backend developer after 2 months of slow progress and moved the multi BIN launch from Node.js to Elixir.', 'C17 audit section 3 Rescue and lead row 1; HISTORY lines 35, 89, 163; SecureBancard 2023 and brought in after 2 months as main backend dev from HISTORY lines 320 to 321; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Legacy migrations', 'C17 audit section 3 Rescue and lead row 2; HISTORY lines 75, 167, 320; census line 249; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Moving live data and code to a new platform while the business keeps running. Pearson Channels data migration from ClutchPrep (2022 to 2023), SecureBancard Node.js to Elixir (2023), GRCTechMe Firestore to PostgreSQL (2026).', 'C17 audit section 3 Rescue and lead row 2; HISTORY lines 75, 167, 320; census line 249; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Architecture and technical leadership', 'C17 audit section 3 Rescue and lead row 3; HISTORY lines 92, 193, 148, 75, 81; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['A CTO or lead engineer for your team: architecture, roadmap, reviews and delivery. CTO at GRCTechMe and InsurAdmin (since 2024), co PM and development lead at Datepal (2026), co architect of Pearson Channels, leader of the Clutch Prep B2B system.', 'C17 audit section 3 Rescue and lead row 3; HISTORY lines 92, 193, 148, 75, 81; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['AI built into your product', 'C17 audit section 3 AI row 1 and section 4; census line 254; C9c row 1; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Agents, RAG and LLM features on Claude and Gemini, voice in and out with STT and TTS, wired into the app you already run. Sillabo tutor and judge on Claude (2026), GRCTechMe on Gemini (2025).', 'C17 audit section 3 AI row 1 and section 4; census line 254; C9c row 1; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['AI prototype to production', 'C17 audit section 3 AI row 2 and section 4; HISTORY line 302; C9c row 2; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Quality prototypes in hours, live with you if needed, then the tests, guardrails and cost limits that get them to production. Sillabo LLM judge (2026).', 'C17 audit section 3 AI row 2 and section 4; HISTORY line 302; C9c row 2; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Insurance software', 'C17 audit section 3 Domains row 1; HISTORY lines 52 to 56, 193, 234; census lines 40 to 52; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Agency management, carrier feeds, commissions and sales tools for agencies and IMOs. InsurAdmin (2024), Agency Rocket suite with My New Retirement, Wealth United and Debt Action Plan (since 2018).', 'C17 audit section 3 Domains row 1; HISTORY lines 52 to 56, 193, 234; census lines 40 to 52; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Payments, billing and money platforms', 'C17 audit section 3 Domains row 2; census line 281; HISTORY lines 194, 234, 239, 247, SecureBancard 2023 line 320; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Payment processing, Stripe subscriptions, commissions and payouts. SecureBancard\'s Pioneer platform for ISOs and ISVs (2023), Agency Rocket Stripe billing (since 2018), PMX commissions and plans (2022), BCharitable ACH and Stripe (2021, 2026).', 'C17 audit section 3 Domains row 2; census line 281; HISTORY lines 194, 234, 239, 247, SecureBancard 2023 line 320; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Document and data parsers', 'C17 audit section 3 Domains row 3; census line 286; HISTORY lines 235, 240; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['PDFs, ACORD XML and CSV feeds turned into clean data your app can use. IUL parser for 20+ carriers (2023), whole life (2022) and annuity (2026) parsers, InsurAdmin ACORD feeds (2025), WJV commission parser (2023).', 'C17 audit section 3 Domains row 3; census line 286; HISTORY lines 235, 240; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Marketplace launches', 'C17 audit section 3 Launch and platform row 1 and section 4; HISTORY lines 92, 192, 202, Google Cloud Marketplace line 314; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Your app listed on the Google Cloud Marketplace or the Shopify App Store, with the procurement, webhooks and compliance reviews they ask for. Done for GRCTechMe and PMX.', 'C17 audit section 3 Launch and platform row 1 and section 4; HISTORY lines 92, 192, 202, Google Cloud Marketplace line 314; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Security and compliance', 'C17 audit section 3 Launch and platform row 2; census line 266; HISTORY lines 301, 302; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Security audits with the fixes, and process work for ISO 9001 (certified) and ISO 27001 (in preparation). GRCTechMe audit (2026), InsurAdmin security release (2026), PMX authorization with tests (2022), ISO 9001 at GRCTechMe.', 'C17 audit section 3 Launch and platform row 2; census line 266; HISTORY lines 301, 302; HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Cloud and deploys', 'C17 audit section 3 Launch and platform row 3; census lines 43, 67, 290; GKE, ArgoCD, Netlify and Sentry from HISTORY lines 315 to 319 (Azure AKS stays off: its client is on HISTORY line 307); HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
  ['Kubernetes on Google Cloud, CI and releases that ship on every push. Agency Rocket on GKE with ArgoCD (since 2021), InsurAdmin infrastructure (2025), Nebulith on Railway with CI (2026), PMX and my own sites on Netlify, Sentry on every project.', 'C17 audit section 3 Launch and platform row 3; census lines 43, 67, 290; GKE, ArgoCD, Netlify and Sentry from HISTORY lines 315 to 319 (Azure AKS stays off: its client is on HISTORY line 307); HISTORY \'His answers to the content audit\' (approved 10-23, changelog item 26 point 1)'],
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
