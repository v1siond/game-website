'use client'

import { useState } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession, Profession } from '@/contexts/ProfessionContext'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

type Filter = Profession | 'all'

export default function Experience() {
  const { theme } = useTheme()
  const { active } = useProfession()
  const [filter, setFilter] = useState<Filter>(active)

  const filteredExperience = filterExperienceByProfession(EXPERIENCE_DATA, filter)
  const filters: Filter[] = ['all', 'engineer', 'drummer', 'fighter']

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
          <div className="flex justify-between items-center mb-6">
            <h2
              className="text-xs tracking-widest"
              style={{ color: theme.colors.textMuted }}
            >
              [ EXPERIENCE ]
            </h2>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-2 py-1 text-[10px] tracking-wider transition-colors"
                  style={{
                    border: `1px solid ${filter === f ? theme.colors.accent : theme.colors.border}`,
                    background: filter === f ? `${theme.colors.accent}15` : 'transparent',
                    color: filter === f ? theme.colors.accent : theme.colors.textMuted,
                  }}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            {filteredExperience.map((entry, index) => {
              const startYear = entry.startDate.split('-')[0]
              const endYear = entry.endDate ? entry.endDate.split('-')[0] : 'Present'

              return (
                <div
                  key={entry.id}
                  className="relative pl-8"
                  style={{
                    borderLeft: `2px solid ${theme.colors.border}`,
                  }}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[-5px] top-0 w-2 h-2 rounded-full"
                    style={{ background: theme.colors.accent }}
                  />

                  {/* Date */}
                  <div
                    className="text-[10px] tracking-wider mb-1"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {startYear} - {endYear}
                  </div>

                  {/* Title & Organization */}
                  <div
                    className="text-sm mb-1"
                    style={{ color: theme.colors.text }}
                  >
                    {entry.title}
                  </div>
                  <div
                    className="text-xs mb-2"
                    style={{ color: theme.colors.accent }}
                  >
                    {entry.organization}
                  </div>

                  {/* Description */}
                  <p
                    className="text-xs leading-relaxed mb-2"
                    style={{ color: theme.colors.textMuted }}
                  >
                    {entry.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {entry.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5"
                        style={{
                          border: `1px solid ${theme.colors.border}`,
                          color: theme.colors.textMuted,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Profession tags */}
                  {entry.professions.length > 1 && (
                    <div className="mt-2 flex gap-1">
                      {entry.professions.map((p) => (
                        <span
                          key={p}
                          className="text-[8px] px-1 py-0.5 uppercase tracking-wider"
                          style={{
                            background: `${theme.colors.accent}20`,
                            color: theme.colors.accent,
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {filteredExperience.length === 0 && (
            <p
              className="text-center text-xs italic py-8"
              style={{ color: theme.colors.textMuted }}
            >
              No experience entries for this filter.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
