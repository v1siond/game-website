import type { ReactNode } from 'react'

/** One section of /cv: its title over its content, in the page's plain document look. */
export function CVSection({ title, children }: Readonly<{ title: string; children: ReactNode }>) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-3">{title}</h2>
      {children}
    </section>
  )
}
