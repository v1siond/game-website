import { CVPage, cvMetadata } from '../cvPage'

export const generateMetadata = () => cvMetadata('en')

// The English CV; src/middleware.ts sends a visitor whose language is another one to its address.
export default function EnglishCVPage() {
  return <CVPage locale="en" />
}
