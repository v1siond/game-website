import RootShell from '@/components/layouts/RootShell'

export { metadata, viewport } from '@/components/layouts/RootShell'

// The English CV's document language. Reading no cookie or header here keeps /cv static; the other
// languages have their own address and layout ([locale]).
export default function CVLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <RootShell lang="en" worldsPicker={false}>{children}</RootShell>
}
