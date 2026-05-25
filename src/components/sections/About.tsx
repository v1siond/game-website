'use client'

import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA } from '@/data/about'

export default function About() {
  const { theme } = useTheme()
  const { active } = useProfession()
  const aboutData = ABOUT_DATA[active]

  return (
    <section className="relative z-30 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div
          className="p-6"
          style={{
            border: `1px solid ${theme.colors.border}`,
            background: `${theme.colors.surface}cc`,
          }}
        >
          <h2
            className="text-xs tracking-widest mb-6"
            style={{ color: theme.colors.textMuted }}
          >
            [ ABOUT ME ]
          </h2>

          <div className="grid md:grid-cols-[1fr_2fr] gap-6">
            {/* Photo placeholder */}
            <div
              className="aspect-square flex items-center justify-center"
              style={{
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.surface,
              }}
            >
              <span
                className="text-4xl font-mono"
                style={{ color: theme.colors.accent }}
              >
                [PHOTO]
              </span>
            </div>

            {/* Bio content */}
            <div>
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: theme.colors.text }}
              >
                {aboutData.bio}
              </p>

              <div>
                <h3
                  className="text-xs tracking-widest mb-3"
                  style={{ color: theme.colors.textMuted }}
                >
                  QUICK FACTS:
                </h3>
                <ul className="space-y-2">
                  {aboutData.quickFacts.map((fact, i) => (
                    <li
                      key={i}
                      className="text-xs flex items-center gap-2"
                      style={{ color: theme.colors.text }}
                    >
                      <span style={{ color: theme.colors.accent }}>•</span>
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
