import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Labels, LabelsFile } from '@/lib/cv/labels'
import { locales } from '@/i18n/config'

// The admin (public/admin/config.yml) edits content/cv/labels.json; a field the file lacks offers text no
// page prints, and a key with no field can only be changed by hand. The repo has no YAML parser, and the
// labels collection is regular enough to read as text: a group is a `name:` line 16 spaces in, followed by
// its `i18n:` line, and each of its fields a one line `- { ... name: key }` 18 spaces in.
const configLines = readFileSync(join(process.cwd(), 'public', 'admin', 'config.yml'), 'utf8').split('\n')
const labelsFile = JSON.parse(
  readFileSync(join(process.cwd(), 'content', 'cv', 'labels.json'), 'utf8'),
) as LabelsFile

type AdminGroup = { name: string; translated: boolean; fields: string[] }

const labelsCollection = (lines: string[]): string[] => {
  const start = lines.findIndex((line) => line.trim() === 'file: content/cv/labels.json')
  const end = lines.findIndex((line, index) => index > start && /^ {2}- name: /.test(line))
  return lines.slice(start, end)
}

const adminGroups = (lines: string[]): AdminGroup[] =>
  lines.reduce<AdminGroup[]>((groups, line) => {
    const group = line.match(/^ {16}name: (\w+)$/)
    if (group) return [...groups, { name: group[1], translated: true, fields: [] }]
    const current = groups[groups.length - 1]
    if (!current) return groups
    const i18n = line.match(/^ {16}i18n: (true|false)$/)
    if (i18n) current.translated = i18n[1] === 'true'
    const field = line.match(/^ {18}- \{.*[{,] name: (\w+)/)
    if (field) current.fields.push(field[1])
    return groups
  }, [])

const groups = adminGroups(labelsCollection(configLines))

const adminKeys = (locale: string): string[] =>
  groups
    .filter((group) => locale === 'en' || group.translated)
    .flatMap((group) => group.fields.map((field) => `${group.name}.${field}`))
    .sort()

const fileKeys = (labels: Labels): string[] =>
  Object.entries(labels)
    .flatMap(([group, entries]) => Object.keys(entries).map((key) => `${group}.${key}`))
    .sort()

describe('the admin fields of labels.json', () => {
  it('reads the label groups of the admin', () => {
    expect(groups.map((group) => group.name)).toContain('actions')
    expect(groups.find((group) => group.name === 'worlds')?.translated).toBe(false)
  })

  it.each(locales)('lists exactly the keys the file holds in %s', (locale) => {
    expect(adminKeys(locale)).toEqual(fileKeys(labelsFile[locale]?.labels as Labels))
  })
})
