'use client'

import type { ReactNode } from 'react'
import { ProjectList } from '@/components/cv/ProjectList'
import { BandList } from '@/components/cv/BandList'
import { VentureList } from '@/components/cv/VentureList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { SectionFrames } from '@/components/cv/SectionPlanView'
import { drumsSince } from '@/lib/cv/sectionText'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { MASONRY_COLUMN_LIST, MASONRY_ITEM } from '@/lib/cv/masonry'
import { REALM } from './palette'
import { InnerCard, RealmFrame } from './panels'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { BandCard, CARD_BODY, CARD_TITLE, JobCard, MARKED_LIST, ProjectCard, VentureCard } from './cards'
import { FrostArtDivider, FrostOrnament, ChaosArtDivider, ChaosOrnament } from './ornaments'

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

// An art divider between the realm's frames, still.
export function ArtDivider({ layout, children }: { layout: SectionLayout; children: ReactNode }) {
  return <div style={{ margin: `${layout.artDividerMargin} 0` }}>{children}</div>
}

// The page's spacing for its height (the root picks one) and whether the copy sits at the larger size.
interface FrameProps {
  layout: SectionLayout
  isLargeScreen: boolean
}

// His education and languages under the bio, each label set in the semibold.
const REALM_FACTS: AboutFactsLook = {
  list: '',
  fact: 'text-base text-[color:var(--realm-text-mid)]',
  term: 'inline font-semibold',
  value: 'inline',
  termEnd: ': ',
}

// One frame per section in the plan's order, each with the art divider that follows it (bands and Muay Thai
// open with theirs); the zone turns from chaos to frost after the services.
const FRAMES: SectionFrames<FrameProps> = {
  about: function AboutFrame({ slot, layout, isLargeScreen }) {
    const { sections, cards } = useLabels()
    const { highlights } = useAboutBlock()
    return (
      <>
          <section style={{ marginBottom: layout.sectionSpacing, marginTop: '1rem' }}>
            <RealmFrame title={sections[slot.titleKey]} zone="chaos">
              <p className="max-w-prose whitespace-pre-line" style={{
                color: REALM.textBright,
                lineHeight: 1.8,
                fontSize: isLargeScreen ? '1.125rem' : '1rem',
                padding: isLargeScreen ? '0.5rem 0' : '0.25rem 0',
              }}>{slot.bio}</p>
              <AboutFacts look={REALM_FACTS} />
              <div data-stage-items="">
                <MarkedLines items={highlights} label={cards.keyAchievements} look={MARKED_LIST} />
              </div>
            </RealmFrame>
          </section>

        {/* === Chaos Art Divider: Crossed Weapons === */}
        <ArtDivider layout={layout}>
          <ChaosArtDivider variant="weapons" scale={layout.artDividerScale} />
        </ArtDivider>
      </>
    )
  },
  work: function WorkFrame({ slot, layout }) {
    const { sections } = useLabels()
    return (
      <>
          <SectionWithOrnament
            leftOrnament={<ChaosOrnament side="left" type="flag" />}
            rightOrnament={<ChaosOrnament side="right" type="weapons" />}
          >
            <section style={{ marginBottom: layout.sectionSpacing }}>
              <RealmFrame title={sections[slot.titleKey]} zone="chaos">
                <ul data-stage-items="" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  {slot.jobs.map((job) => (
                    <li key={job.id}>
                      <JobCard job={job} />
                    </li>
                  ))}
                </ul>
              </RealmFrame>
            </section>
          </SectionWithOrnament>

        {/* === Chaos Art Divider: War Banner === */}
        <ArtDivider layout={layout}>
          <ChaosArtDivider variant="kingdom" scale={layout.artDividerScale} />
        </ArtDivider>
      </>
    )
  },
  tech: function TechFrame({ slot, layout }) {
    const { sections, cards } = useLabels()
    return (
        <SectionWithOrnament rightOrnament={<ChaosOrnament side="right" type="shield" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <RealmFrame title={sections[slot.titleKey]} zone="chaos">
              <ul data-stage-items="" className={MASONRY_COLUMN_LIST} aria-label={cards.techByCategory}>
                {slot.categories.map((category) => (
                  <li key={category.id} className={MASONRY_ITEM}>
                    <h3 style={{ color: REALM.goldText, fontSize: '1.125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem', borderBottom: `1px solid ${REALM.metalDark}`, paddingBottom: '0.25rem' }}>
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
    )
  },
  services: function ServicesFrame({ slot, layout }) {
    const { sections } = useLabels()
    return (
      <>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <RealmFrame title={sections[slot.titleKey]} zone="chaos">
              <ul data-stage-items="" className={MASONRY_COLUMN_LIST}>
                {slot.services.map((service) => (
                  <li key={service.id} className={MASONRY_ITEM}>
                    <InnerCard zone="chaos">
                      <h3 style={CARD_TITLE}>{service.title}</h3>
                      <p style={CARD_BODY}>{service.line}</p>
                    </InnerCard>
                  </li>
                ))}
              </ul>
            </RealmFrame>
          </section>

        {/* ============ TRANSITION - ICE THRONE ZONE ============ */}

        {/* === Transition Art Divider: Ice Crystals === */}
        <ArtDivider layout={layout}>
          <FrostArtDivider variant="crystals" scale={layout.artDividerScale} />
        </ArtDivider>
      </>
    )
  },
  projects: function ProjectsFrame({ slot, layout }) {
    const { sections } = useLabels()
    return (
      <>
        {/* Projects - Frost zone begins */}
          <SectionWithOrnament
            leftOrnament={<FrostOrnament side="left" type="shard" />}
            rightOrnament={<FrostOrnament side="right" type="rune" />}
          >
            <section style={{ marginBottom: layout.sectionSpacing }}>
              <RealmFrame title={sections[slot.titleKey]} zone="frost">
                <div data-stage-items="">
                  <ProjectList
                    projects={slot.projects}
                    className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3"
                    renderProject={(project) => <ProjectCard slot={project} />}
                  />
                </div>
              </RealmFrame>
            </section>
          </SectionWithOrnament>

        {/* === Frost Art Divider: Frost Rune === */}
        <ArtDivider layout={layout}>
          <FrostArtDivider variant="rune" scale={layout.artDividerScale} />
        </ArtDivider>
      </>
    )
  },
  ventures: function VenturesFrame({ slot, layout }) {
    const { sections } = useLabels()
    return (
        <SectionWithOrnament leftOrnament={<FrostOrnament side="left" type="frost" />}>
          <section style={{ marginBottom: layout.sectionSpacing }}>
            <RealmFrame title={sections[slot.titleKey]} zone="frost">
              {/* His own products (featured) first, each a gold trimmed card with a gold seal over the name,
                  every venture two to a row in the screen column. */}
              <div data-stage-items="">
                <VentureList
                  companies={slot.companies}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                  itemClassName="grid"
                  featuredItemClassName="grid"
                  renderVenture={(venture) => <VentureCard slot={venture} />}
                />
              </div>
            </RealmFrame>
          </section>
        </SectionWithOrnament>
    )
  },
  bands: function BandsFrame({ slot: { titleKey, musician, bands }, layout }) {
    const { sections, years } = useLabels()
    return (
      <>
        <ArtDivider layout={layout}>
          <ChaosArtDivider variant="weapons" scale={layout.artDividerScale} />
        </ArtDivider>
          <SectionWithOrnament leftOrnament={<FrostOrnament side="left" type="frost" />}>
            <section style={{ marginBottom: layout.sectionSpacing }}>
              <RealmFrame title={sections[titleKey]} zone="frost">
                <p style={{ color: REALM.textBright, fontSize: '1rem', marginBottom: '1rem' }}>
                  {drumsSince(musician, years)}
                </p>
                <div data-stage-items="">
                  <BandList
                    bands={bands}
                    className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3"
                    renderBand={(band) => <BandCard {...band} />}
                  />
                </div>
                <p style={{ color: REALM.frostIceMid, fontSize: '1rem', fontStyle: 'italic', marginTop: '1rem' }}>{musician.line}</p>
              </RealmFrame>
            </section>
          </SectionWithOrnament>
      </>
    )
  },
  muayThai: function MuayThaiFrame({ slot: { titleKey, martialArts }, layout }) {
    const { sections } = useLabels()
    return (
      <>
        <ArtDivider layout={layout}>
          <ChaosArtDivider variant="weapons" scale={layout.artDividerScale} />
        </ArtDivider>
          <SectionWithOrnament rightOrnament={<ChaosOrnament side="right" type="shield" />}>
            <section style={{ marginBottom: layout.sectionSpacing }}>
              <RealmFrame title={sections[titleKey]} zone="chaos">
                <h3 style={{ ...CARD_TITLE, marginBottom: '1rem' }}>{martialArts.primary.title}</h3>
                <div data-stage-items="">
                <MuayThaiRecord
                  martialArts={martialArts}
                  classNames={{
                    facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                    fact: 'p-3 bg-gradient-to-b from-[color:var(--realm-bg-deep)] to-[color:var(--realm-bg-void)] border border-[color:var(--realm-metal-dark)]',
                    term: 'text-sm uppercase tracking-[0.08em] font-semibold text-[color:var(--realm-gold-text)]',
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
                </div>
              </RealmFrame>
            </section>
          </SectionWithOrnament>
      </>
    )
  },
}

export const CARDS = FRAMES
