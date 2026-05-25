'use client'

import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'

export default function Skills() {
  const { theme } = useTheme()
  const { active } = useProfession()

  // For engineer, show tech stack; for others, show skills
  const isEngineer = active === 'engineer'
  const techCategories = isEngineer ? getEngineerSkills() : null
  const skillCategories = !isEngineer ? getSkillsByProfession(active) : null

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
            {isEngineer ? '[ TECH STACK ]' : '[ SKILLS ]'}
          </h2>

          {/* Tech Stack for Engineer */}
          {techCategories && (
            <div className="space-y-6">
              {techCategories.map((category) => (
                <div key={category.name}>
                  <h3
                    className="text-xs tracking-wider mb-3 flex items-center gap-2"
                    style={{ color: theme.colors.accent }}
                  >
                    <span>{category.icon}</span>
                    {category.name.toUpperCase()}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs"
                        style={{
                          border: `1px solid ${theme.colors.border}`,
                          background: theme.colors.surface,
                          color: theme.colors.text,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills for Drummer/Fighter */}
          {skillCategories && (
            <div className="space-y-6">
              {skillCategories.map((category) => (
                <div key={category.name}>
                  <h3
                    className="text-xs tracking-wider mb-3 flex items-center gap-2"
                    style={{ color: theme.colors.accent }}
                  >
                    {category.icon && <span>{category.icon}</span>}
                    {category.name.toUpperCase()}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill.name}
                        className="px-3 py-2 text-xs"
                        style={{
                          border: `1px solid ${theme.colors.border}`,
                          background: theme.colors.surface,
                          color: theme.colors.text,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
