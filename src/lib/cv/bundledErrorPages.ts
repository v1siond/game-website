import labels from '../../../content/cv/labels.json'
import summary from '../../../content/cv/summary.json'
import { errorPagesFrom } from './errorPages'
import type { LabelsFile } from './labels'

// The Pages Router error pages (src/pages/404, 500, _error) cannot read content/cv from disk: _error's
// getInitialProps also runs in the browser, and 404 and 500 are built once. So they carry these two files in
// their own bundle, which only the Pages Router loads and every content commit rebuilds. The App Router 404
// reads the same files per request (getErrorPages in src/lib/cv-data.ts).
export const BUNDLED_ERROR_PAGES = errorPagesFrom({ labels: labels as LabelsFile, summary })
