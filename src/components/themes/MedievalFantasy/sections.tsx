'use client'

import type { ReactNode } from 'react'
import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince } from '@/components/cv/sectionText'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { WC3 } from './palette'
import { InnerCard, WC3Frame } from './panels'
import { BandCard, CARD_BODY, CARD_SUBTITLE, CARD_TITLE, JobCard, ProjectCard } from './cards'
import { FTArtDivider, FTOrnament, RoCArtDivider, RoCOrnament } from './ornaments'

// Each profession's sections, framed per zone between ornaments and art dividers.

function SectionWithOrnament({
  children,
  leftOrnament,
  rightOrnament
}: {
  children: ReactNode
  leftOrnament?: ReactNode
  rightOrnament?: ReactNode
}) {
  return (
    <div style={{ position: 'relative' }}>
      {leftOrnament}
      {rightOrnament}
      {children}
    </div>
  )
}

export interface SectionLayout {
  sectionSpacing: string
  artDividerMargin: string
  artDividerScale: number
}

export function ArtDivider({ layout, children }: { layout: SectionLayout; children: ReactNode }) {
  return (
    <ScrollScene>
      <div style={{ margin: `${layout.artDividerMargin} 0` }}>{children}</div>
    </ScrollScene>
  )
}

function EngineerSections({ sections, layout, isLargeScreen }: { sections: SectionsOf<'engineer'>; layout: SectionLayout; isLargeScreen: boolean }) {
  const { professionalSummary } = useCVData()
  const { jobs, techStack, projects, companies } = sections

  return (
    <>
      {/* About - More breathing room */}
      <ScrollScene>
        <section style={{ marginBottom: layout.sectionSpacing, marginTop: '1rem' }}>
          <WC3Frame title="About" zone="roc">
            <p style={{
              color: WC3.textBright,
              lineHeight: 1.8,
              fontSize: isLargeScreen ? '1.125rem' : '1rem',
              padding: isLargeScreen ? '0.5rem 0' : '0.25rem 0',
            }}>{professionalSummary.bio}</p>
          </WC3Frame>
        </section>
      </ScrollScene>

      {/* === RoC Art Divider: Crossed Weapons === */}
      <ArtDivider layout={layout}>
        <RoCArtDivider variant="horde" scale={layout.artDividerScale} />
      </ArtDivider>

      {/* Work Experience */}
      {jobs.length > 0 && (
        <ScrollScene>
          <SectionWithOrnament
            leftOrnament={<RoCOrnament side="left" type="flag" />}
            rightOrnament={<RoCOrnament side="right" type="weapons" />}
          >
            <section style={{ marginBottom: layout.sectionSpacing }}>
              <WC3Frame title="Work Experience" zone="roc">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </WC3Frame>
            </section>
          </SectionWithOrnament>
        </ScrollScene>
      )}

      {/* === RoC Art Divider: War Banner === */}
      <ArtDivider layout={layout}>
        <RoCArtDivider variant="alliance" scale={layout.artDividerScale} />
      </ArtDivider>

      {/* Tech Stack - with shield ornament */}
      <ScrollScene>
        <SectionWithOrnament rightOrnament={<RoCOrnament side="right" type="shield" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <WC3Frame title="Tech Stack" zone="roc">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {techStack.map((category) => (
                  <div key={category.id}>
                    <h3 style={{ color: WC3.goldMid, fontSize: '1.125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem', borderBottom: `1px solid ${WC3.metalDark}`, paddingBottom: '0.25rem' }}>
                      {category.name}
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {category.items.map((tech) => (
                        <li key={tech} style={{ color: WC3.textMid, fontSize: '1.125rem', marginBottom: '0.125rem' }}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </WC3Frame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>

      {/* ============ TRANSITION - FROZEN THRONE ZONE ============ */}

      {/* === Transition Art Divider: Ice Crystals === */}
      <ArtDivider layout={layout}>
        <FTArtDivider variant="crystals" scale={layout.artDividerScale} />
      </ArtDivider>

      {/* Projects - FT zone begins */}
      <ScrollScene>
        <SectionWithOrnament
          leftOrnament={<FTOrnament side="left" type="shard" />}
          rightOrnament={<FTOrnament side="right" type="rune" />}
        >
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <WC3Frame title="Projects" zone="ft">
              <ProjectList
                projects={projects}
                className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3"
                renderProject={(slot) => <ProjectCard slot={slot} />}
              />
            </WC3Frame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>

      {/* === FT Art Divider: Frost Rune === */}
      <ArtDivider layout={layout}>
        <FTArtDivider variant="rune" scale={layout.artDividerScale} />
      </ArtDivider>

      {/* Ventures */}
      <ScrollScene>
        <SectionWithOrnament leftOrnament={<FTOrnament side="left" type="frost" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <WC3Frame title="Ventures" zone="ft">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {companies.map((company) => (
                  <InnerCard key={company.id} zone="ft">
                    <h3 style={CARD_TITLE}>{company.name}</h3>
                    <p style={{ ...CARD_SUBTITLE, fontSize: '1rem' }}>{company.tagline}</p>
                    <p style={CARD_BODY}>{company.description}</p>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${company.name} (opens in a new tab)`}
                      style={{ color: WC3.ft.iceMid, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', minHeight: '44px', paddingTop: '0.75rem' }}
                    >
                      {company.url}
                    </a>
                  </InnerCard>
                ))}
              </div>
            </WC3Frame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>
    </>
  )
}

function MusicianSections({ sections, layout }: { sections: SectionsOf<'drummer'>; layout: SectionLayout }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtDivider layout={layout}>
        <RoCArtDivider variant="horde" scale={layout.artDividerScale} />
      </ArtDivider>

      <ScrollScene>
        <SectionWithOrnament leftOrnament={<FTOrnament side="left" type="frost" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <WC3Frame title="Bands" zone="ft">
              <p style={{ color: WC3.textBright, fontSize: '1rem', marginBottom: '1rem' }}>
                {drumsSince(musician)}
              </p>
              <BandList
                bands={bands}
                className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3"
                renderBand={(slot) => <BandCard {...slot} />}
              />
              <p style={{ color: WC3.ft.iceMid, fontSize: '1rem', fontStyle: 'italic', marginTop: '1rem' }}>{musician.line}</p>
            </WC3Frame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>
    </>
  )
}

function MartialArtistSections({ sections, layout }: { sections: SectionsOf<'fighter'>; layout: SectionLayout }) {
  const { martialArts } = sections

  return (
    <>
      <ArtDivider layout={layout}>
        <RoCArtDivider variant="weapons" scale={layout.artDividerScale} />
      </ArtDivider>

      <ScrollScene>
        <SectionWithOrnament rightOrnament={<RoCOrnament side="right" type="shield" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <WC3Frame title="Muay Thai" zone="roc">
              <h3 style={{ ...CARD_TITLE, marginBottom: '1rem' }}>{martialArts.primary.title}</h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                  fact: 'p-3 bg-gradient-to-b from-[#0a0c0e] to-[#060608] border border-[#2a2428]',
                  term: 'text-sm uppercase tracking-[0.08em] font-semibold text-[#b8860b]',
                  value: 'text-base mt-1 text-[#e8dcc8]',
                  achievements: 'space-y-1',
                  achievement: 'text-base flex items-start gap-2 text-[#b09878]',
                }}
                renderAchievement={(achievement) => (
                  <>
                    <span className="text-[#8b6914]" aria-hidden="true">›</span>
                    {achievement}
                  </>
                )}
              />
            </WC3Frame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>
    </>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews<{ layout: SectionLayout; isLargeScreen: boolean }> = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}
