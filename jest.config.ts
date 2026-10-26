import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/', '<rootDir>/.claude/', '<rootDir>/src/__tests__/helpers/', '<rootDir>/e2e/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/types/**/*',
  ],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
}

// The blog's Markdown chain is ESM only, so these packages join transpilePackages in next/jest's node_modules pattern.
const ESM_PACKAGES = [
  'unified', 'bail', 'devlop', 'trough', 'is-plain-obj', 'vfile[^/]*', 'remark-[^/]+', 'rehype-[^/]+', 'micromark[^/]*',
  'mdast-[^/]+', 'hast-[^/]+', 'hastscript', 'unist-[^/]+', 'decode-named-character-reference', 'ccount',
  'escape-string-regexp', 'markdown-table', 'zwitch', 'longest-streak', 'trim-lines', 'github-slugger', 'refractor',
  'property-information', 'comma-separated-tokens', 'space-separated-tokens', 'parse-entities', 'character-entities[^/]*',
  'character-reference-invalid', 'is-decimal', 'is-hexadecimal', 'is-alphanumerical', 'is-alphabetical',
  'html-void-elements', 'stringify-entities',
].join('|')

const TRANSPILED = '(?!.pnpm)(?!('

const withEsmPackages = (pattern: string): string => pattern.replace(TRANSPILED, `${TRANSPILED}${ESM_PACKAGES}|`)

export default async function jestConfig() {
  const resolved = await createJestConfig(config)()
  return { ...resolved, transformIgnorePatterns: (resolved.transformIgnorePatterns ?? []).map(withEsmPackages) }
}
