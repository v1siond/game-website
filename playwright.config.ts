import { defineConfig, devices } from '@playwright/test'

// The e2e server runs on its own port and its own dist dir, so it never shares `.next` with the
// :3000 dev server (a second next process writing the same dist dir breaks the first one). E2E_PORT
// moves it when a parallel lane already holds 4100.
const PORT = Number(process.env.E2E_PORT ?? 4100)
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  timeout: 60_000,
  // The dev server compiles a route on its first visit, which can take longer than the default 5s.
  expect: { timeout: 20_000 },
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npx next dev --turbopack -p ${PORT}`,
    url: baseURL,
    env: { NEXT_DIST_DIR: '.next-e2e' },
    reuseExistingServer: false,
    timeout: 180_000,
  },
})
