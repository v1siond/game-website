'use client'

import type { ReactNode } from 'react'
import { useCVData } from '@/components/cv/CVDataProvider'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionsOf } from '@/lib/cv/cvView'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { drumsSince, newTabName } from '@/components/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { ScrollScene } from '@/components/scroll/ScrollScene'
import { MASONRY_ITEM, MASONRY_LIST } from '@/components/cv/masonry'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { REALM } from './palette'
import { InnerCard, RealmFrame } from './panels'
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
  const labels = useLabels()
  const { professionalSummary } = useCVData()
  const { jobs, techStack, projects, companies } = sections

  return (
    <>
      {/* About - More breathing room */}
      <ScrollScene>
        <section style={{ marginBottom: layout.sectionSpacing, marginTop: '1rem' }}>
          <RealmFrame title={labels.sections.about} zone="roc">
            <p style={{
              color: REALM.textBright,
              lineHeight: 1.8,
              fontSize: isLargeScreen ? '1.125rem' : '1rem',
              padding: isLargeScreen ? '0.5rem 0' : '0.25rem 0',
            }}>{professionalSummary.bio}</p>
          </RealmFrame>
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
              <RealmFrame title={labels.sections.workExperience} zone="roc">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </RealmFrame>
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
            <RealmFrame title={labels.sections.techStack} zone="roc">
              <ul className={MASONRY_LIST} aria-label={labels.cards.techByCategory}>
                {techStack.map((category) => (
                  <li key={category.id} className={MASONRY_ITEM}>
                    <h3 style={{ color: REALM.goldMid, fontSize: '1.125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem', borderBottom: `1px solid ${REALM.metalDark}`, paddingBottom: '0.25rem' }}>
                      {category.name}
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {category.items.map((tech) => (
                        <li key={tech} style={{ color: REALM.textMid, fontSize: '1.125rem', marginBottom: '0.125rem' }}>{tech}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </RealmFrame>
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
            <RealmFrame title={labels.sections.projects} zone="ft">
              <ProjectList
                projects={projects}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3"
                renderProject={(slot) => <ProjectCard slot={slot} />}
              />
            </RealmFrame>
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
            <RealmFrame title={labels.sections.ventures} zone="ft">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: '0.75rem' }}>
                {companies.map((company) => (
                  <InnerCard key={company.id} zone="ft">
                    <h3 style={CARD_TITLE}><SlashBreaks text={company.name} /></h3>
                    <p style={{ ...CARD_SUBTITLE, fontSize: '1rem' }}>{company.tagline}</p>
                    <p style={CARD_BODY}>{company.description}</p>
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={newTabName(labels.links, company.name)}
                      style={{ color: REALM.frostIceMid, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block', minHeight: '44px', paddingTop: '0.75rem', overflowWrap: 'anywhere' }}
                    >
                      {company.url}
                    </a>
                  </InnerCard>
                ))}
              </div>
            </RealmFrame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>
    </>
  )
}

function MusicianSections({ sections, layout }: { sections: SectionsOf<'drummer'>; layout: SectionLayout }) {
  const labels = useLabels()
  const { musician, bands } = sections

  return (
    <>
      <ArtDivider layout={layout}>
        <RoCArtDivider variant="horde" scale={layout.artDividerScale} />
      </ArtDivider>

      <ScrollScene>
        <SectionWithOrnament leftOrnament={<FTOrnament side="left" type="frost" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <RealmFrame title={labels.sections.bands} zone="ft">
              <p style={{ color: REALM.textBright, fontSize: '1rem', marginBottom: '1rem' }}>
                {drumsSince(musician, labels.years)}
              </p>
              <BandList
                bands={bands}
                className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3"
                renderBand={(slot) => <BandCard {...slot} />}
              />
              <p style={{ color: REALM.frostIceMid, fontSize: '1rem', fontStyle: 'italic', marginTop: '1rem' }}>{musician.line}</p>
            </RealmFrame>
          </section>
        </SectionWithOrnament>
      </ScrollScene>
    </>
  )
}

function MartialArtistSections({ sections, layout }: { sections: SectionsOf<'fighter'>; layout: SectionLayout }) {
  const labels = useLabels()
  const { martialArts } = sections

  return (
    <>
      <ArtDivider layout={layout}>
        <RoCArtDivider variant="weapons" scale={layout.artDividerScale} />
      </ArtDivider>

      <ScrollScene>
        <SectionWithOrnament rightOrnament={<RoCOrnament side="right" type="shield" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <RealmFrame title={labels.sections.muayThai} zone="roc">
              <h3 style={{ ...CARD_TITLE, marginBottom: '1rem' }}>{martialArts.primary.title}</h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                  fact: 'p-3 bg-gradient-to-b from-[color:var(--realm-bg-deep)] to-[color:var(--realm-bg-void)] border border-[color:var(--realm-metal-dark)]',
                  term: 'text-sm uppercase tracking-[0.08em] font-semibold text-[color:var(--realm-gold-mid)]',
                  value: 'text-base mt-1 text-[color:var(--realm-text-bright)]',
                  achievements: 'space-y-1',
                  achievement: 'text-base flex items-start gap-2 text-[color:var(--realm-text-mid)]',
                }}
                renderAchievement={(achievement) => (
                  <>
                    <span className="text-[color:var(--realm-gold-dark)]" aria-hidden="true">›</span>
                    {achievement}
                  </>
                )}
              />
            </RealmFrame>
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
