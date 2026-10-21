import { getLocale } from 'next-intl/server'
import RootShell from '@/components/layouts/RootShell'

export { metadata, viewport } from '@/components/layouts/RootShell'

// The CV is translated: its document language is the locale next-intl resolved for this request
// (cookie, then Accept-Language), so screen readers read it in the language it is shown in.
export default async function CVLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang={await getLocale()}>{children}</RootShell>
}
