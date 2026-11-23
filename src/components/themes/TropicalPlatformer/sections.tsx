'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useLabels } from '@/components/cv/CVDataProvider'
import { AboutFacts, useAboutBlock, type AboutFactsLook } from '@/components/cv/AboutFacts'
import { usePosts } from '@/components/blog/BlogProvider'
import { BandList } from '@/components/cv/BandList'
import { MarkedLines } from '@/components/cv/MarkedLines'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import { ProjectList } from '@/components/cv/ProjectList'
import { SlashBreaks } from '@/components/cv/SlashBreaks'
import { TagList } from '@/components/cv/TagList'
import { BLOG_PATH, postLinks } from '@/lib/blog/links'
import { jobCard, projectCard } from '@/lib/cv/cvView'
import { MASONRY_ITEM, MASONRY_LIST } from '@/lib/cv/masonry'
import { drumsSince, headingId } from '@/lib/cv/sectionText'
import type { SectionId, SectionSlot, SlotOf } from '@/lib/cv/sectionPlan'
import { SUN_POINTS, ServiceBoard, TechBoard, VentureBoard, WOOD_TAGS } from './boards'
import { WOOD_BUTTON, jungleButton } from './buttons'
import { Board, LevelSign } from './levelSign'
import type { Scene } from './scenes'
import { JungleStage } from './stage'
import look from './jungle.module.css'

// One level per scene: a tall head that first shows the place alone and then brings the level's sign up,
// then the cards on their dark boards, then a screen of the place alone before it sinks. The cards a scene
// counts sit in an element marked data-stage-items, which the shared theatre measures for the reading line
// that plays each card's beat.

// His education and languages on the About board, each label in sun gold.
const SUN_FACTS: AboutFactsLook = {
  list: 'mt-4 space-y-1',
  fact: 'text-sm leading-relaxed text-[color:var(--tp-parchment)]',
  term: 'inline font-bold text-[color:var(--tp-sun-gold)]',
  value: 'inline',
  termEnd: ': ',
}

const CARD_TITLE = `text-lg leading-snug text-[color:var(--tp-sun-gold)] ${look.display}`
const QUIET = 'mt-1 text-sm text-[color:var(--tp-plank-light)]'
const LINK_BUTTON = jungleButton({ tone: 'wood', size: 'small', extra: 'inline-flex items-center' })

function AboutCards({ slot }: { slot: SlotOf<'about'> }) {
  const { cards } = useLabels()
  const { highlights } = useAboutBlock()
  return (
    <Board>
      <p className="whitespace-pre-line text-base leading-relaxed text-[color:var(--tp-parchment)]">{slot.bio}</p>
      <div data-stage-items="">
        <MarkedLines items={highlights} label={cards.keyAchievements} look={SUN_POINTS} />
      </div>
      <AboutFacts look={SUN_FACTS} />
    </Board>
  )
}

function WorkCards({ slot }: { slot: SlotOf<'work'> }) {
  const { years, cards } = useLabels()
  return (
    <ul className={MASONRY_LIST} data-stage-items="">
      {slot.jobs.map((entry) => {
        const job = jobCard(entry, years)
        return (
          <li key={entry.id} className={MASONRY_ITEM}>
            <article className={`rounded-3xl p-5 ${look.board}`}>
              <h3 className={CARD_TITLE}>{job.title}</h3>
              <p className="mt-1 text-base text-[color:var(--tp-parchment)]">
                <SlashBreaks text={job.company} />
              </p>
              <p className={QUIET}>{job.years}</p>
              {job.location && <p className={QUIET}>{job.location}</p>}
              {job.description && <p className="mt-4 text-sm leading-relaxed text-[color:var(--tp-parchment)]">{job.description}</p>}
              <MarkedLines items={job.highlights} label={cards.keyAchievements} look={SUN_POINTS} />
              <TagList items={job.skills} label={cards.skillsUsed} look={WOOD_TAGS} />
            </article>
          </li>
        )
      })}
    </ul>
  )
}

function TechCards({ slot }: { slot: SlotOf<'tech'> }) {
  return (
    <div data-stage-items="">
      <TechBoard categories={slot.categories} />
    </div>
  )
}

function ServiceCards({ slot }: { slot: SlotOf<'services'> }) {
  return (
    <div data-stage-items="">
      <ServiceBoard services={slot.services} />
    </div>
  )
}

function ProjectCards({ slot }: { slot: SlotOf<'projects'> }) {
  const labels = useLabels()
  return (
    <div data-stage-items="">
      <ProjectList
        projects={slot.projects}
        className={MASONRY_LIST}
        itemClassName={MASONRY_ITEM}
        renderProject={({ project: entry, links, noLink }) => {
          const project = projectCard(entry, labels)
          return (
            <article className={`rounded-3xl p-5 ${look.board}`}>
              <h3 className={CARD_TITLE}>
                <SlashBreaks text={project.name} />
              </h3>
              {project.role && <p className={`${QUIET} font-bold`}>{project.role}</p>}
              {project.years && <p className={QUIET}>{project.years}</p>}
              {project.tagline && <p className="mt-3 text-base leading-relaxed text-[color:var(--tp-parchment)]">{project.tagline}</p>}
              {project.description && <p className="mt-3 text-sm leading-relaxed text-[color:var(--tp-parchment)]">{project.description}</p>}
              {project.impact && (
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--tp-parchment)]">
                  <span className="font-bold text-[color:var(--tp-sun-gold)]">{labels.cards.impact}: </span>
                  {project.impact}
                </p>
              )}
              <MarkedLines items={project.details} label={labels.cards.details} look={SUN_POINTS} />
              <TagList items={project.techStack} label={labels.cards.technologiesUsed} look={WOOD_TAGS} />
              <div className="mt-4 flex flex-wrap gap-3">
                {links.map(({ kind, label, linkProps }) => (
                  <a key={kind} {...linkProps} className={LINK_BUTTON}>
                    {label}
                  </a>
                ))}
                {noLink && <p className="text-sm italic text-[color:var(--tp-plank-light)]">{noLink}</p>}
              </div>
            </article>
          )
        }}
      />
    </div>
  )
}

function VentureCards({ slot }: { slot: SlotOf<'ventures'> }) {
  return (
    <div data-stage-items="">
      <VentureBoard companies={slot.companies} />
    </div>
  )
}

function BandCards({ slot: { musician, bands } }: { slot: SlotOf<'bands'> }) {
  const { years: yearWords } = useLabels()
  return (
    <>
      <p className={`mx-auto mb-8 w-fit rounded-xl px-5 py-2 text-center text-base text-[color:var(--tp-parchment)] ${look.board}`}>{drumsSince(musician, yearWords)}</p>
      <div data-stage-items="">
        <BandList
          bands={bands}
          className={MASONRY_LIST}
          itemClassName={MASONRY_ITEM}
          renderBand={({ band, years, linkProps, release }) => (
            <article className={`rounded-3xl p-5 ${look.board}`}>
              <h3 className={CARD_TITLE}>
                {linkProps ? (
                  <a {...linkProps} className={`underline decoration-2 underline-offset-4 ${look.focus}`}>
                    {band.name}
                  </a>
                ) : (
                  band.name
                )}
              </h3>
              {band.role && <p className="mt-1 text-base text-[color:var(--tp-parchment)]">{band.role}</p>}
              {years && <p className={QUIET}>{years}</p>}
              {release && (
                <p className="mt-2 text-sm text-[color:var(--tp-parchment)]">
                  <span className="font-bold text-[color:var(--tp-sun-gold)]">{release.label}: </span>
                  {release.title}
                </p>
              )}
            </article>
          )}
        />
      </div>
    </>
  )
}

function RecordCards({ slot: { martialArts } }: { slot: SlotOf<'muayThai'> }) {
  return (
    <>
      <h3 className={`mb-8 text-center text-xl text-[color:var(--tp-sun-gold)] ${look.display} ${look.caption}`}>{martialArts.primary.title}</h3>
      <div data-stage-items="">
        <MuayThaiRecord
          martialArts={martialArts}
          classNames={{
            facts: 'grid gap-4 sm:grid-cols-2 mb-6',
            fact: `rounded-2xl p-4 ${look.board}`,
            term: `text-sm uppercase text-[color:var(--tp-sun-gold)] ${look.display}`,
            value: 'mt-1 text-base text-[color:var(--tp-parchment)]',
            achievements: `space-y-3 rounded-3xl p-6 ${look.board}`,
            achievement: 'flex items-start gap-3 text-base text-[color:var(--tp-parchment)]',
          }}
          renderAchievement={(achievement) => (
            <>
              {SUN_POINTS.marker}
              <span className="min-w-0 flex-1">{achievement}</span>
            </>
          )}
        />
      </div>
    </>
  )
}

const CARDS: { [Id in SectionId]: (props: { slot: SlotOf<Id> }) => ReactNode } = {
  about: AboutCards,
  work: WorkCards,
  tech: TechCards,
  services: ServiceCards,
  projects: ProjectCards,
  ventures: VentureCards,
  bands: BandCards,
  muayThai: RecordCards,
}

interface SceneSectionProps {
  scene: Scene
  slot: SectionSlot
  still: boolean
}

/** One level of the page; under reduced motion its own stage sits still behind its head. */
export function SceneSection({ scene, slot, still }: SceneSectionProps) {
  const { sections } = useLabels()
  const Cards = CARDS[slot.id] as (props: { slot: SectionSlot }) => ReactNode
  const title = sections[slot.titleKey]
  const id = headingId('jungle', title)
  return (
    <section data-scene={scene.id} aria-labelledby={id} className="relative px-4 pb-[60svh] motion-reduce:pb-16 sm:px-6 lg:px-[6vw]">
      {still && <JungleStage scene={scene} settled />}
      <header className="relative flex min-h-[90svh] max-w-[42rem] items-end justify-center pb-6 motion-reduce:min-h-[70svh]">
        <LevelSign id={id} title={title} />
      </header>
      <div className="relative max-w-[42rem]">
        <Cards slot={slot} />
      </div>
    </section>
  )
}

/** The latest posts on a plain board, each title a sun gold link with its date, and the button to the
 *  whole list; nothing when there are none. */
export function PostsBoard() {
  const { blog } = useLabels()
  const links = postLinks(usePosts())
  if (!links) return null

  return (
    <Board className="mb-10">
      <h2 className={`mb-4 text-xl uppercase text-[color:var(--tp-sun-gold)] ${look.display}`}>{blog.latestPosts}</h2>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={`flex min-h-[44px] flex-col justify-center gap-1 rounded-lg py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${look.focus}`}>
              <span className={`text-lg leading-snug text-[color:var(--tp-sun-gold)] underline decoration-2 underline-offset-4 ${look.display}`}>{link.title}</span>
              <time dateTime={link.date} className="shrink-0 text-sm text-[color:var(--tp-plank-light)]">
                {link.shownDate}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex justify-center">
        <Link href={BLOG_PATH} className={WOOD_BUTTON}>
          {blog.allPosts}
        </Link>
      </div>
    </Board>
  )
}
