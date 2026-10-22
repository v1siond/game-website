import RootShell from '@/components/layouts/RootShell'

export { viewport } from '@/components/layouts/RootShell'

// The worlds are written in English only, so the site's document language is fixed. Reading no cookie
// or header here also keeps `/` static.
export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en">{children}</RootShell>
}
