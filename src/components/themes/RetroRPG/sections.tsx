"use client";

import type { ReactNode } from "react";
import { useLabels } from "@/components/cv/CVDataProvider";
import {
  sectionViews,
  type SectionFrames,
} from "@/components/cv/SectionPlanView";
import { ProjectList } from "@/components/cv/ProjectList";
import { BandList } from "@/components/cv/BandList";
import { VentureList } from "@/components/cv/VentureList";
import { MuayThaiRecord } from "@/components/cv/MuayThaiRecord";
import { MASONRY_ITEM, MASONRY_LIST } from "@/lib/cv/masonry";
import { drumsSince } from "@/lib/cv/sectionText";
import type { Labels } from "@/lib/cv/labels";
import {
  BandCard,
  CompanyCard,
  ExperienceCard,
  ItemBag,
  ProjectCard,
} from "./cards";
import { BulletBox } from "./bulletBox";
import { MonsterTurnBox } from "./monsterTurn";
import { BODY, Box, Mark, SectionHeader } from "./panels";
import { PIXEL } from "./palette";
import { usePlay } from "./play";
import {
  BridgeRoom,
  EncounterRoom,
  PuzzleRoom,
  RingsFlower,
  SentryRoom,
  ShopRoom,
  SparRoom,
  StreetRoom,
} from "./rooms";
import world from "./world.module.css";

// Each profession's sections, and only those, as the encounter's boxes; the shared section plan picks which
// a profession shows and in which order, and each is one frame here. Light blocks (About, Tech stack,
// Services, Ventures, the band lines) are one box each; heavy blocks are the long lists in masonry columns
// (MASONRY_LIST), each entry its own box with its own reveal (cards.tsx). The bullet box sits above
// each profession's main list, playing that profession's soul mode (bulletBox.tsx).
//
// The services box is opened by the About monster landing on it (monsterTurn.tsx).
//
// Every reveal has its own play scope (usePlay), so a block's heading, its box and each card in a list
// open and type once, each when it shows, and never drive one another.

const WIDE = "max-w-6xl";
const NARROW = "max-w-3xl";

function Heading({ title }: { title: string }) {
  const { ref, play } = usePlay(600);

  return (
    <div ref={ref} data-play={play}>
      <SectionHeader title={title} />
    </div>
  );
}

/** A single box that opens in steps, then shows what it holds, when it first shows. */
function OpenBox({ children }: { children: ReactNode }) {
  const { ref, play } = usePlay(1400);

  return (
    <div ref={ref} data-play={play}>
      <Box className={world.opens}>{children}</Box>
    </div>
  );
}

type SectionKey = keyof Labels["sections"];

/** A section: its box title over what it holds; the region is named by labelKey, the title by titleKey. */
function Block({
  labelKey,
  titleKey = labelKey,
  width = NARROW,
  children,
}: {
  labelKey: SectionKey;
  titleKey?: SectionKey;
  width?: string;
  children: ReactNode;
}) {
  const titles = useLabels().sections;

  return (
    <section className="px-4 py-10 sm:px-6" aria-label={titles[labelKey]}>
      <div className={`mx-auto ${width}`}>
        <Heading title={titles[titleKey]} />
        {children}
      </div>
    </section>
  );
}

const STAT =
  "border-2 border-[color:var(--rpg-border-shade)] bg-[color:var(--rpg-window-low)] p-3";

// One frame per section of the shared plan, each in its room of the zone it belongs to.
const FRAMES: SectionFrames = {
  about: function AboutFrame({ slot }) {
    return (
      <Block labelKey={slot.titleKey}>
        <EncounterRoom>
          <OpenBox>
            <p className={`max-w-prose ${BODY}`}>{slot.bio}</p>
          </OpenBox>
          <div className="mt-6">
            <BulletBox profession="engineer" />
          </div>
        </EncounterRoom>
      </Block>
    );
  },
  work: function WorkFrame({ slot }) {
    return (
      <Block labelKey={slot.titleKey} width={WIDE}>
        <SentryRoom profession="engineer">
          <ul className={MASONRY_LIST}>
            {slot.jobs.map((entry) => (
              <li key={entry.id} className={MASONRY_ITEM}>
                <ExperienceCard entry={entry} />
              </li>
            ))}
          </ul>
        </SentryRoom>
      </Block>
    );
  },
  tech: function TechFrame({ slot }) {
    return (
      <Block labelKey={slot.titleKey} width={WIDE}>
        <ShopRoom profession="engineer">
          <OpenBox>
            <ItemBag categories={slot.categories} />
          </OpenBox>
        </ShopRoom>
      </Block>
    );
  },
  services: function ServicesFrame({ slot }) {
    return (
      <Block labelKey={slot.titleKey} width={WIDE}>
        <MonsterTurnBox>
          <ul className={MASONRY_LIST}>
            {slot.services.map((service) => (
              <li key={service.id} className={MASONRY_ITEM}>
                <h3
                  className={`mb-2 flex items-center gap-2 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}
                >
                  <Mark />
                  {service.title}
                </h3>
                <p className={BODY}>{service.line}</p>
              </li>
            ))}
          </ul>
        </MonsterTurnBox>
      </Block>
    );
  },
  projects: function ProjectsFrame({ slot }) {
    return (
      <Block labelKey={slot.titleKey} titleKey="featuredWork" width={WIDE}>
        <PuzzleRoom profession="engineer">
          <ProjectList
            projects={slot.projects}
            className={MASONRY_LIST}
            itemClassName={MASONRY_ITEM}
            renderProject={(project) => <ProjectCard {...project} />}
          />
        </PuzzleRoom>
      </Block>
    );
  },
  ventures: function VenturesFrame({ slot }) {
    return (
      <Block labelKey={slot.titleKey} width={WIDE}>
        <StreetRoom profession="engineer">
          <VentureList
            companies={slot.companies}
            className="grid gap-6 md:grid-cols-6"
            itemClassName="md:col-span-2"
            featuredItemClassName="md:col-span-3"
            renderVenture={(venture) => <CompanyCard {...venture} />}
          />
        </StreetRoom>
      </Block>
    );
  },
  bands: function BandsFrame({ slot }) {
    const { years } = useLabels();
    const { musician, bands } = slot;

    return (
      <Block labelKey={slot.titleKey} width={WIDE}>
        <p
          className={`mb-6 inline-block bg-[color:var(--rpg-void)] px-3 py-1 text-sm uppercase tracking-[0.15em] text-[color:var(--rpg-gold)] ${PIXEL}`}
        >
          {drumsSince(musician, years)}
        </p>
        <BridgeRoom profession="drummer" count={bands.length}>
          <BandList
            bands={bands}
            className={MASONRY_LIST}
            itemClassName={MASONRY_ITEM}
            renderBand={(band, index) => (
              <RingsFlower index={index}>
                <BandCard {...band} />
              </RingsFlower>
            )}
          />
          <p
            className={`mt-4 bg-[color:var(--rpg-void)] px-3 py-2 text-center ${BODY}`}
          >
            {musician.line}
          </p>
          <div className="mt-6">
            <BulletBox profession="drummer" />
          </div>
        </BridgeRoom>
      </Block>
    );
  },
  muayThai: function MuayThaiFrame({ slot }) {
    const { martialArts } = slot;

    return (
      <Block labelKey={slot.titleKey}>
        <SparRoom profession="fighter">
          <OpenBox>
            <h3
              className={`mb-4 flex items-start gap-2 text-sm uppercase tracking-wide text-[color:var(--rpg-gold)] sm:text-base ${PIXEL}`}
            >
              <Mark className="" />
              {martialArts.primary.title}
            </h3>
            <MuayThaiRecord
              martialArts={martialArts}
              classNames={{
                facts: `mb-6 grid gap-3 sm:grid-cols-2 ${world.after} [--show-delay:500ms]`,
                fact: STAT,
                term: `text-sm uppercase tracking-widest text-[color:var(--rpg-gold)] ${PIXEL}`,
                value: `mt-2 ${BODY} text-[color:var(--rpg-text)]`,
                achievements: `space-y-3 ${world.after} [--show-delay:900ms]`,
                achievement: BODY,
              }}
              renderAchievement={(achievement) => (
                <span className="flex items-start gap-2 text-[color:var(--rpg-green)]">
                  <Mark />
                  {achievement}
                </span>
              )}
            />
          </OpenBox>
          <div className="mt-6">
            <BulletBox profession="fighter" />
          </div>
        </SparRoom>
      </Block>
    );
  },
};

export const SECTION_VIEWS = sectionViews(FRAMES);
