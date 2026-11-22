'use client'

import Link from 'next/link'
import { useCVData, useLabels } from '@/components/cv/CVDataProvider'
import { usePosts } from '@/components/blog/BlogProvider'
import type { ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'
import { FadeInScene } from '@/components/scroll/ScrollScene'
import type { SectionsOf } from '@/lib/cv/cvView'
import { BLOG_PATH, postLinks } from '@/lib/blog/links'
import { ServiceBoard, TechBoard, VentureBoard } from './boards'
import { WOOD_BUTTON } from './buttons'
import { BrawlRecord } from './brawl'
import { CannonRun } from './cannons'
import { VineCrossing } from './crossing'
import { ElderYard } from './elder'
import { Board, Level } from './levelSign'
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
// crocodiles, dropped onto the page by the vulture (./deliveries). The posts level closes every profession on a plain board with the latest posts.

export function EngineerSections({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()
  const { sections: titles } = useLabels()

  return (
    <div className="space-y-24">
      <Level title={titles.about} scene="jungle">
        <ElderYard>
          <Board>
            <p className="mx-auto max-w-prose text-center text-base leading-relaxed text-[color:var(--tp-parchment)]">{professionalSummary.bio}</p>
          </Board>
        </ElderYard>
      </Level>

      {sections.jobs.length > 0 && (
        <Level title={titles.workExperience} scene="treetop">
          <CannonRun jobs={sections.jobs} />
        </Level>
      )}

      <Level title={titles.techStack} scene="jungle">
        <GroundSlap>
          <TechBoard categories={sections.techStack} itemClassName={JOLTED} />
        </GroundSlap>
      </Level>

      {sections.services.length > 0 && (
        <Level title={titles.services} scene="jungle">
          <FadeInScene>
            <BarrelSmash>
              <ServiceBoard services={sections.services} />
            </BarrelSmash>
          </FadeInScene>
        </Level>
      )}

      {sections.projects.length > 0 && (
        <>
          <VineCrossing />
          <Level title={titles.projects} scene="cave">
            <CartProjects projects={sections.projects} />
          </Level>
        </>
      )}

      {sections.companies.length > 0 && (
        <Level title={titles.ventures} scene="jungle">
          <RhinoCharge>
            <VentureBoard companies={sections.companies} itemClassName={RAMMED} />
          </RhinoCharge>
        </Level>
      )}
    </div>
  )
}

export function MusicianSections({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { sections: titles } = useLabels()

  return (
    <Level title={titles.bands} scene="vines">
      <VineBands bands={sections.bands} musician={sections.musician} />
    </Level>
  )
}

export function MartialArtistSections({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { sections: titles } = useLabels()
  const { martialArts } = sections

  return (
    <Level title={titles.muayThai} scene="jungle">
      <h3 className={`mb-8 text-center text-xl text-[color:var(--tp-sun-gold)] ${look.display} ${look.caption}`}>{martialArts.primary.title}</h3>
      <VultureDrop>
        <BrawlRecord martialArts={martialArts} />
      </VultureDrop>
    </Level>
  )
}

export const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerSections,
  drummer: MusicianSections,
  fighter: MartialArtistSections,
}

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
