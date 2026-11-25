import RootShell from '@/components/layouts/RootShell'
import '@/styles/blog.css'

export { metadata, viewport } from '@/components/layouts/RootShell'

// The blog's document: English, plain like /cv, no world. The opaque white page sits above the world
// ornaments RootShell's providers draw fixed behind every page.
export default function BlogLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <RootShell lang="en" worldsPicker>
      <div className="relative z-10 min-h-screen bg-white font-sans text-gray-900">{children}</div>
    </RootShell>
  )
}
