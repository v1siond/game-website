import '@testing-library/jest-dom'
import v8 from 'node:v8'

// jsdom doesn't expose structuredClone (browsers + Node do). Polyfill it with v8 serialize/deserialize — a
// TRUE structured clone (preserves undefined, nested arrays) — so editor snapshot code (mapSnapshot) tests
// against the same deep-clone semantics the real browser runtime provides.
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = <T>(value: T): T => v8.deserialize(v8.serialize(value)) as T
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}))

// Mock next-intl/server
jest.mock('next-intl/server', () => ({
  getTranslations: () => Promise.resolve((key: string) => key),
  getLocale: () => Promise.resolve('en'),
}))

// Mock html2pdf.js for PDF download tests
jest.mock('html2pdf.js', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    set: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    save: jest.fn().mockResolvedValue(undefined),
  })),
}))

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock document.cookie
let cookieStore: Record<string, string> = {}
Object.defineProperty(document, 'cookie', {
  get: () =>
    Object.entries(cookieStore)
      .map(([key, value]) => `${key}=${value}`)
      .join('; '),
  set: (cookie: string) => {
    const [keyValue] = cookie.split(';')
    const [key, value] = keyValue.split('=')
    if (key && value) {
      cookieStore[key.trim()] = value.trim()
    }
  },
})

// Reset mocks between tests
beforeEach(() => {
  localStorageMock.getItem.mockClear()
  localStorageMock.setItem.mockClear()
  cookieStore = {}
})
