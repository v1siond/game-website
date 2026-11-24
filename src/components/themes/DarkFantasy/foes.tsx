'use client'

import { memo } from 'react'
import { DARK_FANTASY } from './palette'

// What the wanderer meets in the hall besides the bug (bug.tsx), drawn in the bug's shell and mask colours
// with its orange infection light: the crawler that charges along the floor, the flier that dives from the
// vaults, and the armoured knight who duels him; and the bench he rests at and the soul bolt he casts (the
// caverns' other pieces are cavern.tsx). Each is
// drawn round its own origin, the foot of the thing at y 0, so a scene places it with one translate.

/** The crawler, about 150 wide, facing left toward him: a low domed shell, a pale mask, two orange eyes. */
export const Crawler = memo(function Crawler() {
  return (
    <g>
      <ellipse cx="0" cy="-4" rx="70" ry="8" fill={DARK_FANTASY.black} opacity="0.35" />
      {[-44, -18, 8, 34].map((x) => (
        <path key={x} d={`M${x},-30 Q${x - 8},-14 ${x - 12},-2`} fill="none" stroke={DARK_FANTASY.shellDark} strokeWidth="6" strokeLinecap="round" />
      ))}
      <path d="M-62,-30 C-60,-78 40,-92 66,-40 C70,-30 60,-22 50,-22 L-50,-22 C-60,-22 -64,-26 -62,-30 Z" fill={DARK_FANTASY.shell} stroke={DARK_FANTASY.black} strokeWidth="3" />
      <path d="M-30,-70 C-10,-80 20,-80 40,-64" fill="none" stroke={DARK_FANTASY.shellMid} strokeWidth="5" opacity="0.8" />
      <ellipse cx="-52" cy="-40" rx="22" ry="20" fill={DARK_FANTASY.bugMask} stroke={DARK_FANTASY.black} strokeWidth="3" />
      <circle cx="-60" cy="-42" r="5" fill={DARK_FANTASY.infected} />
      <circle cx="-46" cy="-44" r="5" fill={DARK_FANTASY.infected} />
      <circle cx="-60" cy="-42" r="9" fill={DARK_FANTASY.infectedGlow} opacity="0.3" />
    </g>
  )
})

/** The flier, about 160 wide, its wings spread: a round shell body under two pale veined wings. */
export const Flier = memo(function Flier() {
  return (
    <g>
      <path d="M-6,-10 C-60,-70 -90,-30 -84,0 C-60,-8 -30,-4 -6,-2 Z" fill={DARK_FANTASY.lavender} opacity="0.45" stroke={DARK_FANTASY.lavender} strokeWidth="2" />
      <path d="M6,-10 C60,-70 90,-30 84,0 C60,-8 30,-4 6,-2 Z" fill={DARK_FANTASY.lavender} opacity="0.45" stroke={DARK_FANTASY.lavender} strokeWidth="2" />
      <ellipse cx="0" cy="8" rx="30" ry="26" fill={DARK_FANTASY.shell} stroke={DARK_FANTASY.black} strokeWidth="3" />
      <ellipse cx="0" cy="22" rx="16" ry="12" fill={DARK_FANTASY.bugMask} stroke={DARK_FANTASY.black} strokeWidth="2" />
      <circle cx="-6" cy="20" r="4" fill={DARK_FANTASY.infected} />
      <circle cx="6" cy="20" r="4" fill={DARK_FANTASY.infected} />
      <path d="M-8,32 L0,48 L8,32" fill={DARK_FANTASY.shellDark} stroke={DARK_FANTASY.black} strokeWidth="2" />
    </g>
  )
})

/** The armoured knight, about 230 tall, facing left toward him: an iron helm with a visor slit, a dark cloak,
 *  and his greatsword ([data-fx="foe-blade"]) turning on his hand at (-30, -120). */
export const ArmouredKnight = memo(function ArmouredKnight() {
  return (
    <g>
      <ellipse cx="0" cy="-4" rx="62" ry="9" fill={DARK_FANTASY.black} opacity="0.35" />
      <path d="M-46,-4 L-38,-120 C-36,-150 36,-150 38,-120 L46,-4 Z" fill={DARK_FANTASY.voidDeep} stroke={DARK_FANTASY.black} strokeWidth="3" />
      <path d="M-30,-118 L-26,-40 M0,-130 L0,-30 M28,-118 L24,-40" stroke={DARK_FANTASY.rim} strokeWidth="3" opacity="0.8" />
      <rect x="-40" y="-150" width="80" height="34" rx="10" fill={DARK_FANTASY.stoneGrey} stroke={DARK_FANTASY.black} strokeWidth="3" />
      <path d="M-34,-176 C-34,-226 34,-226 34,-176 L34,-150 L-34,-150 Z" fill={DARK_FANTASY.stoneGrey} stroke={DARK_FANTASY.black} strokeWidth="3" />
      <path d="M-28,-184 L10,-184" stroke={DARK_FANTASY.black} strokeWidth="7" strokeLinecap="round" />
      <circle cx="-16" cy="-184" r="3" fill={DARK_FANTASY.infected} />
      <path d="M-30,-212 C-44,-236 -40,-250 -30,-256 C-28,-240 -22,-226 -18,-216 Z" fill={DARK_FANTASY.bone} stroke={DARK_FANTASY.black} strokeWidth="2" />
      <path d="M30,-212 C44,-236 40,-250 30,-256 C28,-240 22,-226 18,-216 Z" fill={DARK_FANTASY.bone} stroke={DARK_FANTASY.black} strokeWidth="2" />
      <g data-fx="foe-blade" transform="rotate(-30 -30 -120)">
        <rect x="-38" y="-132" width="16" height="24" rx="3" fill={DARK_FANTASY.copper} stroke={DARK_FANTASY.black} strokeWidth="2" />
        <path d="M-34,-132 L-38,-260 L-30,-290 L-22,-260 L-26,-132 Z" fill={DARK_FANTASY.silver} stroke={DARK_FANTASY.black} strokeWidth="2" />
        <rect x="-52" y="-138" width="44" height="8" rx="2" fill={DARK_FANTASY.copper} stroke={DARK_FANTASY.black} strokeWidth="2" />
      </g>
    </g>
  )
})

/** The bench, about 200 wide: a stone seat on two legs under an iron back. */
export const Bench = memo(function Bench() {
  return (
    <g>
      <ellipse cx="0" cy="-2" rx="110" ry="8" fill={DARK_FANTASY.black} opacity="0.35" />
      <rect x="-80" y="-60" width="14" height="60" fill={DARK_FANTASY.stoneDark} stroke={DARK_FANTASY.black} strokeWidth="2" />
      <rect x="66" y="-60" width="14" height="60" fill={DARK_FANTASY.stoneDark} stroke={DARK_FANTASY.black} strokeWidth="2" />
      <rect x="-100" y="-74" width="200" height="16" rx="4" fill={DARK_FANTASY.stoneGrey} stroke={DARK_FANTASY.black} strokeWidth="2" />
      <path d="M-90,-74 L-90,-150 C-60,-176 60,-176 90,-150 L90,-74" fill="none" stroke={DARK_FANTASY.brass} strokeWidth="6" />
      <path d="M-50,-74 L-50,-160 M0,-74 L0,-168 M50,-74 L50,-160" stroke={DARK_FANTASY.brass} strokeWidth="3" opacity="0.8" />
    </g>
  )
})

/** The soul bolt he casts, flying right, about 120 long: a bright head trailing pale fire. */
export const SoulBolt = memo(function SoulBolt() {
  return (
    <g>
      <path d="M-110,0 C-70,-22 -30,-26 0,-14 C14,-8 14,8 0,14 C-30,26 -70,22 -110,0 Z" fill={DARK_FANTASY.soulBlue} opacity="0.35" />
      <path d="M-70,0 C-40,-14 -16,-16 0,-8 C8,-4 8,4 0,8 C-16,16 -40,14 -70,0 Z" fill={DARK_FANTASY.ethereal} opacity="0.7" />
      <circle cx="-4" cy="0" r="10" fill={DARK_FANTASY.white} />
    </g>
  )
})
