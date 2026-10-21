import { notFound } from 'next/navigation'

// With one root layout per route group there is no app level layout for an unknown URL to render in.
// Catching every unmatched path here sends it to the site's own not-found page, inside the site layout.
export default function MissingPage() {
  notFound()
}
