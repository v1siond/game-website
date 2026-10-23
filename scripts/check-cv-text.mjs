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
  ['Always interested in hearing new ideas and proposals', 'contact line fixed in cv-site.md Contract'],
  ['Lima, Peru', 'HISTORY: "a dojo in lima peru", written as a place'],
  ['AI built into your product', 'services: his words 10-23 and Sillabo e36529d, f4e9f5f; GRCTechMe 904559a5, 396e9bd7 (C9c, approved 10-23)'],
  ['Agents, RAG and LLM features on Claude and Gemini, voice in and out with STT and TTS, wired into the app you already run. Training models since before 2023, starting with personal games.', 'services: his words 10-23 and Sillabo e36529d, f4e9f5f; GRCTechMe 904559a5, 396e9bd7 (C9c, approved 10-23)'],
  ['AI prototype to production', 'services: his words 10-23 "crazy quality prototypes in hours", "do it live if needed"; Sillabo LLM judge e36529d (C9c, approved 10-23)'],
  ['Quality prototypes in hours, live with you if needed, then the tests, guardrails and costs that take them to production instead of leaving them as a pilot.', 'services: his words 10-23 "crazy quality prototypes in hours", "do it live if needed"; Sillabo LLM judge e36529d (C9c, approved 10-23)'],
  ['Security, accessibility and compliance', 'services: his words 10-23 audits, ISO 9001 certified, ISO 27001 preparing; GRCTechMe audit 2026-09-23, InsurAdmin 2c4f7d2b, Sillabo AAA 133ee3b (C9c, approved 10-23)'],
  ['Security audits and fixes, WCAG AA and AAA, ISO 9001 certified processes at GRCTechMe and ISO 27001 in preparation.', 'services: his words 10-23 audits, ISO 9001 certified, ISO 27001 preparing; GRCTechMe audit 2026-09-23, InsurAdmin 2c4f7d2b, Sillabo AAA 133ee3b (C9c, approved 10-23)'],
  ['Marketplace launches', 'services: his words 10-23 "grctechme in google marketplace", "pmx into shopify"; GRCTechMe 29ed221c, PMX GDPR webhooks 2022-09-19 (C9c, approved 10-23)'],
  ['Your app listed on Google Marketplace or the Shopify App Store, with the procurement, webhooks and compliance reviews they ask for. Done for GRCTechMe and PMX.', 'services: his words 10-23 "grctechme in google marketplace", "pmx into shopify"; GRCTechMe 29ed221c, PMX GDPR webhooks 2022-09-19 (C9c, approved 10-23)'],
  ['Product builds', 'services: his words 10-23 "get projects out faster than anyone"; PMX, InsurAdmin, pioneer-webapp Angular 2024, Datepal Flutter 2e8f588 (C9c, approved 10-23)'],
  ['Anything, from idea to production, out faster than anyone. Elixir and Phoenix, React, Vue and Angular on the web, Flutter on mobile.', 'services: his words 10-23 "get projects out faster than anyone"; PMX, InsurAdmin, pioneer-webapp Angular 2024, Datepal Flutter 2e8f588 (C9c, approved 10-23)'],
  ['Legacy migrations', 'services: his words 10-23 multi bin; census 2.1 multi_bin_aggregator 2024; GRCTechMe 94737875 (C9c, approved 10-23)'],
  ['Live systems moved without stopping the business: a payments platform\'s Node.js API rebuilt in Elixir with its Angular front end and tests, Firestore moved into PostgreSQL.', 'services: his words 10-23 multi bin; census 2.1 multi_bin_aggregator 2024; GRCTechMe 94737875 (C9c, approved 10-23)'],
  ['Cloud and Kubernetes', 'services: Agency Rocket GKE 56225a2; Quility ArgoCD f82ca58, AKS Terraform c405d23 (C9c, approved 10-23)'],
  ['Kubernetes on GKE and AKS, GitOps with ArgoCD, Terraform and PostgreSQL in production.', 'services: Agency Rocket GKE 56225a2; Quility ArgoCD f82ca58, AKS Terraform c405d23 (C9c, approved 10-23)'],
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
