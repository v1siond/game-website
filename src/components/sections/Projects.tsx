'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession, Profession } from '@/contexts/ProfessionContext'
import { PROJECTS_DATA, filterProjectsByProfession, Project } from '@/data/projects'

type Filter = Profession | 'all'

export default function Projects() {
  const { theme } = useTheme()
  const { active } = useProfession()
  const [filter, setFilter] = useState<Filter>(active)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = filterProjectsByProfession(PROJECTS_DATA, filter)
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
              [ PROJECTS ]
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

          {/* Project grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="text-left p-4 transition-all"
                style={{
                  border: `1px solid ${project.featured ? theme.colors.accent : theme.colors.border}`,
                  background: theme.colors.surface,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.accent
                  e.currentTarget.style.background = theme.colors.surfaceHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = project.featured ? theme.colors.accent : theme.colors.border
                  e.currentTarget.style.background = theme.colors.surface
                }}
              >
                {/* Featured badge */}
                {project.featured && (
                  <div
                    className="text-[8px] tracking-wider mb-2"
                    style={{ color: theme.colors.accent }}
                  >
                    * FEATURED *
                  </div>
                )}

                {/* Project name */}
                <div
                  className="text-sm mb-1"
                  style={{ color: theme.colors.text }}
                >
                  {project.name}
                </div>

                {/* Tagline */}
                <p
                  className="text-[10px] mb-2 line-clamp-2"
                  style={{ color: theme.colors.textMuted }}
                >
                  {project.tagline}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[8px] px-1 py-0.5 uppercase"
                      style={{
                        border: `1px solid ${theme.colors.border}`,
                        color: theme.colors.textMuted,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <p
              className="text-center text-xs italic py-8"
              style={{ color: theme.colors.textMuted }}
            >
              No projects for this filter.
            </p>
          )}
        </div>
      </div>

      {/* Project detail modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div className="absolute inset-0 bg-black/80" />
          <div
            className="relative p-6 max-w-lg w-full"
            style={{
              background: theme.colors.surface,
              border: `2px solid ${theme.colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-2 right-2 text-xl transition-colors"
              style={{ color: theme.colors.textMuted }}
              onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent}
              onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.textMuted}
            >
              [X]
            </button>

            {/* Project details */}
            <div className="mb-4">
              <h3
                className="text-lg mb-1"
                style={{ color: theme.colors.accent }}
              >
                {selectedProject.name}
              </h3>
              <p
                className="text-xs"
                style={{ color: theme.colors.textMuted }}
              >
                {selectedProject.tagline}
              </p>
            </div>

            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: theme.colors.text }}
            >
              {selectedProject.description}
            </p>

            {/* Tech stack */}
            <div className="mb-4">
              <h4
                className="text-xs tracking-widest mb-2"
                style={{ color: theme.colors.textMuted }}
              >
                TECH STACK:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1"
                    style={{
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.text,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            {selectedProject.links && (
              <div className="flex gap-3">
                {selectedProject.links.demo && (
                  <Link
                    href={selectedProject.links.demo}
                    className="px-4 py-2 text-xs tracking-wider transition-colors"
                    style={{
                      border: `1px solid ${theme.colors.accent}`,
                      color: theme.colors.accent,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${theme.colors.accent}15`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    VIEW DEMO
                  </Link>
                )}
                {selectedProject.links.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs tracking-wider transition-colors"
                    style={{
                      border: `1px solid ${theme.colors.border}`,
                      color: theme.colors.textMuted,
                    }}
                  >
                    GITHUB
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
