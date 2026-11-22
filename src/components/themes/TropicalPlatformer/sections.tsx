'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { aboutBlock } from '@/lib/cv/cvView'
import { usePosts } from '@/components/blog/BlogProvider'
import { sectionViews, type SectionFrames } from '@/components/cv/SectionPlanView'
import type { SectionSlot } from '@/lib/cv/sectionPlan'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import { BLOG_PATH, postLinks } from '@/lib/blog/links'
import { ServiceBoard, SunPoints, TechBoard, VentureBoard } from './boards'
import { WOOD_BUTTON } from './buttons'
import { BrawlRecord } from './brawl'
import { CannonRun } from './cannons'
import { VineCrossing } from './crossing'
import { ElderYard } from './elder'
import { Board, Level } from './levelSign'
import type { SceneKind } from './scenery'
import { CartProjects } from './projects'
import { RAMMED, RhinoCharge } from './rhino'
import { GroundSlap, JOLTED } from './slap'
import { VineBands } from './vines'
import { BarrelSmash, VultureDrop } from './deliveries'
import look from './jungle.module.css'

// The picked profession's sections, each a level opened by its plank sign and standing in its own scene,
// and each one a different thing he does with its content: about in the old timer's yard (a barrel
// cannon fires him in, the board unfolds, the old timer grumbles), the jobs as barrel cannons he blasts
// between collecting the letters of his name, the tech stack shaken by his ground slap, the services on
// boards his thrown barrel smashes open (./deliveries), a vine crossing
// into the cave, the projects as stations of a mine cart ride, the ventures rammed by the rhino, the
// bands as hanging planks he swings between, and the Muay Thai record as a bout with the walking
// crocodiles, dropped onto the page by the vulture (./deliveries). The shared plan picks which levels a
// profession runs and in which order. The posts level closes every profession on a plain board with the
// latest posts.

/** A section's level, titled with the section's own label. */
function SectionLevel({ slot, scene, children }: { slot: SectionSlot; scene: SceneKind; children: ReactNode }) {
  const { sections: titles } = useLabels()
  return (
    <Level title={titles[slot.titleKey]} scene={scene}>
      {children}
    </Level>
  )
}

const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    const { cards, about } = useLabels()
    const { education, languages, highlights } = aboutBlock(useCVData().professionalSummary)
    return (
      <SectionLevel slot={slot} scene="jungle">
        <ElderYard>
          <Board>
            <p className="mx-auto max-w-prose text-center text-base leading-relaxed text-[color:var(--tp-parchment)]">{slot.bio}</p>
            <div className="mx-auto max-w-prose">
              <SunPoints items={highlights} label={cards.keyAchievements} />
              {education && (
                <p className="mt-4 text-sm leading-relaxed text-[color:var(--tp-parchment)]">
                  <span className="font-bold text-[color:var(--tp-sun-gold)]">{about.education}: </span>
                  {education}
                </p>
              )}
              {languages && (
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--tp-parchment)]">
                  <span className="font-bold text-[color:var(--tp-sun-gold)]">{about.languages}: </span>
                  {languages}
                </p>
              )}
            </div>
          </Board>
        </ElderYard>
      </SectionLevel>
    )
  },
  work: function WorkFrame({ slot }) {
    return (
      <SectionLevel slot={slot} scene="treetop">
        <CannonRun jobs={slot.jobs} />
      </SectionLevel>
    )
  },
  tech: function TechFrame({ slot }) {
    return (
      <SectionLevel slot={slot} scene="jungle">
        <GroundSlap>
          <TechBoard categories={slot.categories} itemClassName={JOLTED} />
        </GroundSlap>
      </SectionLevel>
    )
  },
  services: function ServicesFrame({ slot }) {
    return (
      <SectionLevel slot={slot} scene="jungle">
        <FadeInScene>
          <BarrelSmash>
            <ServiceBoard services={slot.services} />
          </BarrelSmash>
        </FadeInScene>
      </SectionLevel>
    )
  },
  // He swings across the gap into the cave before the projects.
  projects: function ProjectsFrame({ slot }) {
    return (
      <>
        <VineCrossing />
        <SectionLevel slot={slot} scene="cave">
          <CartProjects projects={slot.projects} />
        </SectionLevel>
      </>
    )
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <SectionLevel slot={slot} scene="jungle">
        <RhinoCharge>
          <VentureBoard companies={slot.companies} itemClassName={RAMMED} />
        </RhinoCharge>
      </SectionLevel>
    )
  },
  bands: function BandsFrame({ slot }) {
    return (
      <SectionLevel slot={slot} scene="vines">
        <VineBands bands={slot.bands} musician={slot.musician} />
      </SectionLevel>
    )
  },
  muayThai: function MuayThaiFrame({ slot }) {
    return (
      <SectionLevel slot={slot} scene="jungle">
        <h3 className={`mb-8 text-center text-xl text-[color:var(--tp-sun-gold)] ${look.display} ${look.caption}`}>{slot.martialArts.primary.title}</h3>
        <VultureDrop>
          <BrawlRecord martialArts={slot.martialArts} />
        </VultureDrop>
      </SectionLevel>
    )
  },
}

// A profession's levels sit 6rem apart in one wrapper.
export const SECTION_VIEWS = sectionViews(FRAMES, 'space-y-24')

/** The closing posts level, the same after every profession: the latest posts on a plain board, each
 *  title a sun gold link with its date, and the wooden button to the whole list. */
export function PostsLevel() {
  const { blog } = useLabels()
  const links = postLinks(usePosts())
  if (!links) return null

  return (
    <Level title={blog.latestPosts} scene="dusk">
      <FadeInScene>
        <Board>
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex min-h-[44px] flex-col justify-center gap-1 rounded-lg py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${look.focus}`}
                >
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
      </FadeInScene>
    </Level>
  )
}
