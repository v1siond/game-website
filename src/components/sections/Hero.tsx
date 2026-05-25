'use client'

import { useTheme } from '@/themes/ThemeContext'
import { useProfession, PROFESSION_CONFIGS, Profession } from '@/contexts/ProfessionContext'
import Link from 'next/link'
import ThemeSwitcher from '@/components/ThemeSwitcher'

export default function Hero() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()

  const professions = Object.values(PROFESSION_CONFIGS)

  return (
    <section className="relative z-30 p-6">
      {/* Header row */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1
            className="text-2xl tracking-[0.3em]"
            style={{
              color: theme.colors.accent,
              textShadow: `0 0 20px ${theme.colors.accent}40`,
            }}
          >
            ALEXANDER PULIDO
          </h1>
          <p
            className="text-xs tracking-[0.2em] mt-1"
            style={{ color: theme.colors.textMuted }}
          >
            {config.title.toUpperCase()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/cv"
            className="text-xs px-3 py-1 transition-colors"
            style={{
              border: `1px solid ${theme.colors.border}`,
              color: theme.colors.textMuted,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.accent
              e.currentTarget.style.color = theme.colors.accent
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = theme.colors.border
              e.currentTarget.style.color = theme.colors.textMuted
            }}
          >
            [DOC] PLAIN CV
          </Link>
          <ThemeSwitcher />
        </div>
      </div>

      {/* Profession switcher */}
      <div className="max-w-4xl mx-auto">
        <div
          className="flex justify-center gap-2 mb-6"
        >
          {professions.map((prof) => (
            <button
              key={prof.id}
              onClick={() => setActive(prof.id)}
              className="px-4 py-2 text-xs tracking-wider transition-all"
              style={{
                border: `1px solid ${active === prof.id ? theme.colors.accent : theme.colors.border}`,
                background: active === prof.id ? `${theme.colors.accent}15` : 'transparent',
                color: active === prof.id ? theme.colors.accent : theme.colors.textMuted,
              }}
              onMouseEnter={(e) => {
                if (active !== prof.id) {
                  e.currentTarget.style.borderColor = theme.colors.borderHover
                }
              }}
              onMouseLeave={(e) => {
                if (active !== prof.id) {
                  e.currentTarget.style.borderColor = theme.colors.border
                }
              }}
            >
              <span className="mr-2 font-mono">{prof.icon}</span>
              {prof.id.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tagline */}
        <div className="text-center">
          <p
            className="text-lg italic"
            style={{ color: theme.colors.text }}
          >
            &ldquo;{config.tagline}&rdquo;
          </p>
          <p
            className="text-xs mt-2"
            style={{ color: theme.colors.textMuted }}
          >
            {config.years} experience
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-8 text-center text-xs tracking-widest animate-pulse"
          style={{ color: theme.colors.textMuted }}
        >
          [ SCROLL TO EXPLORE ]
        </div>
      </div>
    </section>
  )
}
