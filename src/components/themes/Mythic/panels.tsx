import { memo } from 'react'
import { useSectionTrigger } from '@/hooks/useSectionTrigger'
import { headingId } from '@/components/cv/sectionText'
import { GOW } from './palette'
import { GreekMeander } from './art'

// The frames the sections are laid out in: the fade in wrapper, the framed panel with its title and
// the framed section that puts the two together.

// =============================================================================
// FADE IN SECTION (IntersectionObserver based)
// =============================================================================
export const FadeInSection = memo(function FadeInSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, triggered } = useSectionTrigger({
    threshold: 0.05,
    rootMargin: '100px 0px 0px 0px',
  })

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: triggered ? 1 : 0,
        transform: triggered ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
})

// =============================================================================
// SPARTAN FRAME - GOW3 styled content frame
// =============================================================================
export const SpartanFrame = memo(function SpartanFrame({
  children,
  title,
  headingLevel = 'h2',
}: {
  children: React.ReactNode
  title: string
  headingLevel?: 'h2' | 'h3'
}) {
  const HeadingTag = headingLevel
  const sectionHeadingId = headingId('section', title)

  return (
    <div className="relative pt-4 pb-4" role="region" aria-labelledby={sectionHeadingId}>
      {/* Greek meander border top */}
      <GreekMeander color={GOW.gold} opacity={0.2} />

      <div
        className="relative"
        style={{
          background: `linear-gradient(180deg,
            rgba(10, 10, 12, 0.96) 0%,
            rgba(15, 12, 18, 0.92) 50%,
            rgba(10, 10, 12, 0.96) 100%
          )`,
          borderLeft: `2px solid ${GOW.bloodDark}50`,
          borderRight: `2px solid ${GOW.bloodDark}50`,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: `
            inset 0 0 80px rgba(0, 0, 0, 0.6),
            inset 0 1px 0 ${GOW.gold}08,
            0 8px 32px rgba(0, 0, 0, 0.5)
          `,
        }}
      >
        <div className="pt-6 pb-4 px-6 text-center">
          <HeadingTag
            id={sectionHeadingId}
            className="text-sm tracking-[0.35em] uppercase inline-block"
            style={{
              color: GOW.goldBright,
              fontWeight: 600,
              letterSpacing: '0.3em',
              textShadow: `0 0 30px ${GOW.gold}50, 0 0 60px ${GOW.gold}20, 0 2px 4px rgba(0, 0, 0, 0.8)`,
            }}
          >
            {title}
          </HeadingTag>
          {/* Blood line under title */}
          <div
            className="mt-3 mx-auto"
            style={{
              width: '60px',
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${GOW.blood}, transparent)`,
              boxShadow: `0 0 10px ${GOW.blood}60`,
            }}
          />
        </div>

        <div className="px-6 pb-6">
          {children}
        </div>
      </div>

      {/* Greek meander border bottom */}
      <GreekMeander color={GOW.gold} opacity={0.2} />
    </div>
  )
})

export function FramedSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <FadeInSection>
      <section className="relative z-20 py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <SpartanFrame title={title}>{children}</SpartanFrame>
        </div>
      </section>
    </FadeInSection>
  )
}
