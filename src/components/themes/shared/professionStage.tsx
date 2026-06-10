'use client'

import { memo, useState, useEffect } from 'react'
import { useTheme } from '@/themes/ThemeContext'
import { useProfession } from '@/contexts/ProfessionContext'

// Palette the boss-stage ornaments need (mirrors the 10 Dark Fantasy fields they reference).
export interface OrnamentPalette {
  void: string; voidDeep: string; voidPurple: string
  ethereal: string; etherealDark: string
  spiritGold: string; brass: string; copper: string
  stoneGrey: string; bone: string
}

const EngineerOrnaments = memo(function EngineerOrnaments({ scrollY, p }: { scrollY: number; p: OrnamentPalette }) {
  void scrollY
  const SHELL = p.voidDeep
  const SHELL_D = p.void
  const RIM = p.brass
  const RIM_H = p.spiritGold
  const RIM_S = p.copper
  const HW = p.stoneGrey
  const GLOW = p.ethereal
  void SHELL

  // brass-framed "arcane terminal" monitor — small; glowing code lines + blinking cursor
  const monitor = (cx: number, cy: number, w: number, h: number, k: string, rot: number) => (
    <g key={k} transform={`translate(${cx},${cy}) rotate(${rot})`}>
      <rect x={-6} y={h / 2} width={12} height={18} fill="url(#egBrass)" />
      <rect x={-18} y={h / 2 + 16} width={36} height={6} rx={2} fill="url(#egBrass)" stroke={RIM_S} strokeWidth="0.8" />
      <rect x={-w / 2 - 6} y={-h / 2 - 6} width={w + 12} height={h + 12} rx={6} fill="url(#egShell)" stroke={RIM} strokeWidth="2.5" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} fill={SHELL_D} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={2} fill={GLOW} className="hk-screen" opacity="0.1" />
      {[0.7, 0.45, 0.8, 0.35, 0.6].map((f, i) => { const cyl = -h / 2 + 9 + (i * (h - 16)) / 5; return <rect key={i} x={-w / 2 + 7} y={cyl} width={(w - 16) * f} height={2.5} rx={1} fill={i % 3 === 0 ? RIM_H : GLOW} opacity="0.55" /> })}
      <rect x={-w / 2 + 7 + (w - 16) * 0.5} y={-h / 2 + 9 + (4 * (h - 16)) / 5 - 1} width={5} height={4} fill={RIM_H} className="hk-cursor" />
    </g>
  )

  const desk = (cx: number, cy: number, w: number, k: string) => (
    <g key={k}>
      <rect x={cx - w / 2} y={cy} width={w} height={11} rx={3} fill="url(#egShell)" stroke={RIM} strokeWidth="2" />
      <rect x={cx - w / 2 + 6} y={cy + 11} width={10} height={42} fill={SHELL_D} />
      <rect x={cx + w / 2 - 16} y={cy + 11} width={10} height={42} fill={SHELL_D} />
      <rect x={cx - w / 2} y={cy - 2} width={w} height={2.5} fill={RIM_H} opacity="0.25" />
    </g>
  )

  const keyboardDesk = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.9">
      <rect x={-60} y={-8} width={120} height={20} rx={3} fill="url(#egShell)" stroke={RIM} strokeWidth="1.2" />
      {Array.from({ length: 4 }, (_, r) => Array.from({ length: 13 }, (_, col) => (
        <rect key={`${r}-${col}`} x={-54 + col * 8.6} y={-5 + r * 4.4} width={6} height={3} rx={1} fill={SHELL_D} />
      )))}
      <ellipse cx={80} cy={3} rx={10} ry={13} fill="url(#egShell)" stroke={RIM} strokeWidth="1.2" />
    </g>
  )

  const chair = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.5">
      <rect x={-30} y={-130} width={60} height={104} rx={18} fill="url(#egShell)" stroke={RIM} strokeWidth="2" />
      <line x1={0} y1={-26} x2={0} y2={18} stroke={HW} strokeWidth="6" />
      {[0, 72, 144, 216, 288].map((a, i) => { const r = (a * Math.PI) / 180; return <line key={i} x1={0} y1={18} x2={Math.cos(r) * 38} y2={18 + Math.sin(r) * 12} stroke={HW} strokeWidth="4" /> })}
    </g>
  )

  const lamp = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.85">
      <ellipse cx={0} cy={0} rx={16} ry={5} fill="url(#egBrass)" />
      <line x1={0} y1={0} x2={-3} y2={-58} stroke={RIM} strokeWidth="3.5" />
      <line x1={-3} y1={-58} x2={28} y2={-80} stroke={RIM} strokeWidth="3.5" />
      <path d="M28,-80 q18,3 11,21 l-24,-6 Z" fill="url(#egBrass)" stroke={RIM_S} strokeWidth="1.2" />
      <circle cx={30} cy={-68} r={6} fill={RIM_H} opacity="0.3" className="hk-screen" />
    </g>
  )

  // server / tower with drive bays, vents and blinking status LEDs (left gutter)
  const tower = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.9">
      <rect x={-28} y={-150} width={56} height={170} rx={6} fill="url(#egShell)" stroke={RIM} strokeWidth="2.5" />
      {[-122, -106, -90].map((ly, i) => <rect key={i} x={-20} y={ly} width={40} height={10} rx={2} fill={SHELL_D} stroke={RIM_S} strokeWidth="0.6" />)}
      {[-62, -46, -30].map((ly, i) => <circle key={i} cx={-12} cy={ly} r={4} fill={i === 0 ? RIM_H : GLOW} className="hk-cursor" style={{ animationDelay: `${i * 0.4}s` }} />)}
      {Array.from({ length: 5 }, (_, i) => <line key={i} x1={0} y1={-60 + i * 8} x2={20} y2={-60 + i * 8} stroke={SHELL_D} strokeWidth="2" />)}
    </g>
  )

  // open laptop with a glowing screen
  const laptop = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.9">
      <path d="M-66,0 L66,0 L78,18 L-78,18 Z" fill="url(#egShell)" stroke={RIM} strokeWidth="2" />
      <g transform="translate(-2,0) skewX(-10)">
        <rect x={-58} y={-92} width={116} height={92} rx={4} fill="url(#egShell)" stroke={RIM} strokeWidth="2" />
        <rect x={-50} y={-85} width={100} height={78} rx={2} fill={SHELL_D} />
        <rect x={-50} y={-85} width={100} height={78} rx={2} fill={GLOW} className="hk-screen" opacity="0.1" />
        {[0.6, 0.4, 0.75, 0.5].map((f, i) => <rect key={i} x={-44} y={-78 + i * 17} width={88 * f} height={3} rx={1} fill={i % 2 ? RIM_H : GLOW} opacity="0.5" />)}
      </g>
    </g>
  )

  // old CRT terminal (right gutter)
  const crt = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.9">
      <rect x={-30} y={0} width={60} height={14} rx={3} fill="url(#egShell)" stroke={RIM} strokeWidth="1.5" />
      <path d="M-64,-96 Q-70,-100 -64,-104 L64,-104 Q70,-100 64,-96 L60,-4 Q60,2 52,2 L-52,2 Q-60,2 -60,-4 Z" fill="url(#egShell)" stroke={RIM} strokeWidth="2.5" />
      <rect x={-48} y={-90} width={96} height={78} rx={14} fill={SHELL_D} />
      <rect x={-48} y={-90} width={96} height={78} rx={14} fill={GLOW} className="hk-screen" opacity="0.12" />
      {[0.5, 0.7, 0.4].map((f, i) => <rect key={i} x={-40} y={-78 + i * 20} width={80 * f} height={3} rx={1} fill={RIM_H} opacity="0.45" />)}
    </g>
  )

  // stack of manuals / books (left gutter)
  const books = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.85">
      {[{ w: 96, h: 18, c: RIM_S }, { w: 84, h: 16, c: RIM }, { w: 100, h: 20, c: SHELL }].map((b, i) => {
        const yy = -i * 18
        return <g key={i}><rect x={-b.w / 2} y={yy - b.h} width={b.w} height={b.h} rx={2} fill="url(#egShell)" stroke={SHELL_D} strokeWidth="1.5" /><rect x={-b.w / 2 + 3} y={yy - b.h + 3} width={4} height={b.h - 6} fill={b.c} opacity="0.6" /></g>
      })}
    </g>
  )

  // coffee mug + circuit chip accents
  const mug = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.85">
      <path d="M-12,-22 L12,-22 L10,2 Q10,6 0,6 Q-10,6 -10,2 Z" fill="url(#egShell)" stroke={RIM} strokeWidth="1.5" />
      <path d="M12,-18 q12,2 8,12 q-3,5 -9,3" fill="none" stroke={RIM} strokeWidth="2.5" />
      <ellipse cx={0} cy={-22} rx={12} ry={3} fill={SHELL_D} />
      <path d="M-4,-30 q2,-5 0,-9 M3,-30 q2,-5 0,-9" fill="none" stroke={GLOW} strokeWidth="1.2" opacity="0.4" />
    </g>
  )

  const chip = (cx: number, cy: number, s: number, k: string) => (
    <g key={k} transform={`translate(${cx},${cy}) scale(${s})`} opacity="0.8">
      <rect x={-26} y={-26} width={52} height={52} rx={3} fill="url(#egShell)" stroke={RIM} strokeWidth="2" />
      <rect x={-15} y={-15} width={30} height={30} rx={2} fill={SHELL_D} stroke={RIM_S} strokeWidth="1" />
      <circle cx={0} cy={0} r={5} fill={RIM_H} opacity="0.4" className="hk-screen" />
      {[-26, 26].map((ex) => [-16, 0, 16].map((ey, j) => <line key={`${ex}-${j}`} x1={ex} y1={ey} x2={ex > 0 ? ex + 8 : ex - 8} y2={ey} stroke={RIM} strokeWidth="2" />))}
      {[-26, 26].map((ey) => [-16, 0, 16].map((ex, j) => <line key={`v${ey}-${j}`} x1={ex} y1={ey} x2={ex} y2={ey > 0 ? ey + 8 : ey - 8} stroke={RIM} strokeWidth="2" />))}
    </g>
  )

  // floating code glyphs rising from the desk (same idea as the music notes)
  const GLYPHS = ['{ }', '< >', '/>', '( )', ';', '#']
  const codeCluster = (x: number, y: number, seed: number, k: string) => (
    <g key={k} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <text key={i} x={x + (i - 1) * 24} y={y} className="hk-note" style={{ animationDelay: `${((seed + i * 1.3) % 3.4).toFixed(2)}s` }} fill={i % 2 ? GLOW : RIM_H} fontSize="22" opacity="0">{GLYPHS[(seed + i) % 6]}</text>
      ))}
    </g>
  )

  return (
    <svg
      className="ornament-layer fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.82 }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="egShell" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SHELL_D} />
          <stop offset="45%" stopColor={p.voidPurple} />
          <stop offset="100%" stopColor={SHELL_D} />
        </linearGradient>
        <linearGradient id="egBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RIM_S} />
          <stop offset="45%" stopColor={RIM_H} />
          <stop offset="100%" stopColor={RIM_S} />
        </linearGradient>
      </defs>

      {/* FEATURED — compact dual-monitor desk rig, right of centre (kept smaller than the drum kit) */}
      {chair(1648, 712, 0.5, 'chair')}
      {desk(1648, 660, 196, 'desk')}
      {monitor(1604, 596, 84, 78, 'monL', -6)}
      {monitor(1692, 592, 88, 82, 'monR', 6)}
      {keyboardDesk(1645, 652, 0.62, 'kbd')}
      {lamp(1560, 660, 0.55, 'lamp')}
      {mug(1726, 648, 0.7, 'mug')}

      {/* LEFT gutter — server tower, laptop, books */}
      {tower(130, 706, 0.55, 'tower')}
      {laptop(330, 668, 0.5, 'laptop')}
      {books(470, 700, 0.6, 'books')}

      {/* RIGHT gutter / accents — CRT terminal, circuit chip */}
      {crt(1850, 660, 0.5, 'crt')}
      {chip(540, 470, 0.55, 'chip')}

      {/* floating code glyphs */}
      {codeCluster(1640, 470, 0, 'cc1')}
      {codeCluster(165, 480, 3, 'cc2')}
      {codeCluster(1850, 500, 5, 'cc3')}
    </svg>
  )
})

// Drummer "concert stage" — a Hollow Knight gothic chamber ensemble: drum kit, keyboard,
// trumpets, guitar, cello + violin, set BACK (smaller, high near the windows) in the side
// negative spaces so they read as distant stage-dressing and never touch the content.
// Solid dark shells, tarnished brass, ornate detail, gradient shading. Drummer only.
const MusicianOrnaments = memo(function MusicianOrnaments({ scrollY, p }: { scrollY: number; p: OrnamentPalette }) {
  void scrollY
  const SHELL = p.voidDeep
  const SHELL_D = p.void
  const RIM = p.brass
  const RIM_H = p.spiritGold
  const RIM_S = p.copper
  const HW = p.stoneGrey
  const GLOW = p.ethereal

  const drum = (cx: number, cy: number, rx: number, ry: number, k: string, glow = false) => (
    <g key={k}>
      <ellipse cx={cx} cy={cy} rx={rx * 1.05} ry={ry * 1.05} fill={SHELL_D} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="url(#hkHead)" stroke={RIM} strokeWidth="4" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.92} ry={ry * 0.92} fill="none" stroke={RIM_H} strokeWidth="1.5" opacity="0.4" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2
        const lx = cx + Math.cos(a) * rx
        const ly = cy + Math.sin(a) * ry
        return (
          <g key={i} transform={`translate(${lx},${ly}) rotate(${(a * 180) / Math.PI + 90})`}>
            <path d="M0,-8 Q4.5,-2 0,7 Q-4.5,-2 0,-8 Z" fill={RIM} stroke={RIM_S} strokeWidth="0.6" />
          </g>
        )
      })}
      {glow && (
        <>
          <circle cx={cx} cy={cy} r={rx * 0.34} fill={GLOW} opacity="0.14" />
          <path d={`M${cx},${cy - 30} L${cx - 8},${cy} L${cx},${cy + 30} L${cx + 8},${cy} Z`} fill={RIM_H} opacity="0.4" />
          <circle cx={cx} cy={cy} r="9" fill={p.etherealDark} opacity="0.5" />
        </>
      )}
    </g>
  )

  const cymbal = (x: number, baseY: number, topY: number, rx: number, tilt: number, k: string) => (
    <g key={k}>
      <line x1={x} y1={topY} x2={x} y2={baseY} stroke={HW} strokeWidth="4" opacity="0.7" />
      <line x1={x} y1={baseY} x2={x - 26} y2={baseY + 46} stroke={HW} strokeWidth="3" opacity="0.6" />
      <line x1={x} y1={baseY} x2={x + 26} y2={baseY + 46} stroke={HW} strokeWidth="3" opacity="0.6" />
      <g transform={`translate(${x},${topY}) rotate(${tilt})`}>
        <ellipse rx={rx} ry={rx * 0.15} fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
        <ellipse rx={rx} ry={rx * 0.15} fill="none" stroke={RIM_H} strokeWidth="1" opacity="0.55" />
        <ellipse rx={rx * 0.2} ry={rx * 0.05} fill={RIM_S} />
      </g>
    </g>
  )

  const floorTom = (cx: number, topY: number, w: number, h: number, k: string) => (
    <g key={k}>
      <line x1={cx - w / 2 + 8} y1={topY + h - 10} x2={cx - w / 2 - 16} y2={topY + h + 70} stroke={HW} strokeWidth="3" opacity="0.6" />
      <line x1={cx + w / 2 - 8} y1={topY + h - 10} x2={cx + w / 2 + 16} y2={topY + h + 70} stroke={HW} strokeWidth="3" opacity="0.6" />
      <path d={`M${cx - w / 2},${topY} L${cx - w / 2},${topY + h} Q${cx - w / 2},${topY + h + 14} ${cx},${topY + h + 14} Q${cx + w / 2},${topY + h + 14} ${cx + w / 2},${topY + h} L${cx + w / 2},${topY} Z`} fill="url(#hkShellV)" stroke={SHELL_D} strokeWidth="2" />
      <ellipse cx={cx} cy={topY} rx={w / 2} ry={w * 0.17} fill="url(#hkHead)" stroke={RIM} strokeWidth="3" />
      {[0.18, 0.5, 0.82].map((f, i) => (
        <g key={i}>
          <path d={`M${cx - w / 2 - 2},${topY + h * f} q-7,5 0,16 q7,-5 0,-16 Z`} fill={RIM} stroke={RIM_S} strokeWidth="0.5" />
          <path d={`M${cx + w / 2 + 2},${topY + h * f} q7,5 0,16 q-7,-5 0,-16 Z`} fill={RIM} stroke={RIM_S} strokeWidth="0.5" />
        </g>
      ))}
    </g>
  )

  const keyboard = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <path d="M-120,0 L-44,-150 M-44,0 L-120,-150" stroke={HW} strokeWidth="11" opacity="0.7" />
      <path d="M120,0 L44,-150 M44,0 L120,-150" stroke={HW} strokeWidth="11" opacity="0.7" />
      <rect x="-150" y="-196" width="300" height="56" rx="8" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <rect x="-140" y="-192" width="280" height="9" fill={RIM} opacity="0.7" />
      {Array.from({ length: 17 }, (_, i) => (
        <rect key={i} x={-138 + i * 16.2} y="-182" width="13" height="30" fill={p.bone} opacity="0.45" />
      ))}
      {Array.from({ length: 16 }, (_, i) => (i % 7 === 2 || i % 7 === 6 ? null : <rect key={`b${i}`} x={-130 + i * 16.2} y="-182" width="7" height="18" fill={SHELL_D} />))}
      <rect x="-150" y="-270" width="300" height="74" rx="6" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2" opacity="0.9" />
      <circle cx="0" cy="-288" r="5" fill={RIM_H} opacity="0.5" />
    </g>
  )

  const trumpets = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.92">
      <line x1="0" y1="0" x2="-26" y2="4" stroke={HW} strokeWidth="4" opacity="0.6" />
      <line x1="0" y1="0" x2="26" y2="4" stroke={HW} strokeWidth="4" opacity="0.6" />
      <line x1="0" y1="0" x2="0" y2="-118" stroke={HW} strokeWidth="6" opacity="0.65" />
      {[{ y: -116, r: -18 }, { y: -150, r: -26 }].map((t, i) => (
        <g key={i} transform={`translate(0,${t.y}) rotate(${t.r})`}>
          <rect x="6" y="-6" width="118" height="12" rx="6" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1" />
          <path d="M124,-26 Q160,0 124,26 Q138,0 124,-26 Z" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
          <rect x="46" y="-12" width="34" height="20" rx="3" fill={RIM} stroke={RIM_S} strokeWidth="1" />
          {[52, 62, 72].map((vx) => <line key={vx} x1={vx} y1="-12" x2={vx} y2="-22" stroke={RIM} strokeWidth="3" />)}
          <circle cx="2" cy="0" r="7" fill={RIM} />
        </g>
      ))}
    </g>
  )

  // clean electric-guitar silhouette on a stand
  const guitar = (tx: number, ty: number, s: number, rot: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) rotate(${rot}) scale(${s})`} opacity="0.9">
      <line x1="-30" y1="6" x2="0" y2="-26" stroke={HW} strokeWidth="6" opacity="0.6" />
      <line x1="30" y1="6" x2="0" y2="-26" stroke={HW} strokeWidth="6" opacity="0.6" />
      <path d="M-6,0 C-46,2 -58,-44 -40,-72 C-26,-92 -2,-86 6,-70 C16,-90 44,-86 52,-58 C58,-36 40,-6 6,-6 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <circle cx="6" cy="-48" r="14" fill={SHELL_D} stroke={RIM} strokeWidth="2" />
      <rect x="-3" y="-300" width="20" height="232" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1="-3" y1={-110 - i * 30} x2="17" y2={-110 - i * 30} stroke={RIM} strokeWidth="1" opacity="0.4" />
      ))}
      <path d="M-3,-300 L17,-300 L22,-346 L-8,-346 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2" />
      {[-308, -322, -336].map((py) => <circle key={py} cx="-6" cy={py} r="3" fill={RIM} />)}
    </g>
  )

  // violin / cello body (figure-8) + fingerboard + scroll; cello stands on an endpin
  const strings = (tx: number, ty: number, s: number, k: string, pin: boolean) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      {pin && <line x1="0" y1="0" x2="0" y2="26" stroke={HW} strokeWidth="4" opacity="0.6" />}
      <path d="M0,-8 C-56,-18 -60,-86 -34,-104 C-50,-114 -50,-150 -22,-160 C-40,-176 -36,-210 0,-218 C36,-210 40,-176 22,-160 C50,-150 50,-114 34,-104 C60,-86 56,-18 0,-8 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <path d="M-15,-66 q-7,16 0,34" fill="none" stroke={SHELL_D} strokeWidth="3" />
      <path d="M15,-66 q7,16 0,34" fill="none" stroke={SHELL_D} strokeWidth="3" />
      <rect x="-7" y="-94" width="14" height="14" rx="2" fill={RIM} opacity="0.7" />
      <rect x="-7" y="-218" width="14" height="118" fill={SHELL_D} stroke={RIM} strokeWidth="1.5" />
      <path d="M-7,-336 q-9,-4 -3,-16 q9,2 10,16 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="1.5" />
      <circle cx="-3" cy="-330" r="8" fill="none" stroke={RIM} strokeWidth="2" />
    </g>
  )

  // gothic harp — triangular frame (foot + front pillar + curved neck) with fanned strings
  const harp = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <path d="M-8,0 L86,0 L74,20 L4,20 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2.5" />
      <path d="M58,8 L40,-300 L62,-300 L80,8 Z" fill="url(#hkShellV)" stroke={RIM} strokeWidth="3" />
      <circle cx="51" cy="-300" r="11" fill={RIM} stroke={RIM_S} strokeWidth="1.5" />
      <path d="M46,-300 Q-70,-322 -84,-150 Q-90,-40 -6,16" fill="none" stroke="url(#hkBrass)" strokeWidth="12" />
      <path d="M46,-300 Q-70,-322 -84,-150 Q-90,-40 -6,16" fill="none" stroke={RIM_H} strokeWidth="2" opacity="0.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const t = i / 11
        const topX = 40 + (-78 - 40) * t
        const topY = -298 + (-120 - -298) * t
        const botX = 56 + (-2 - 56) * t
        return <line key={i} x1={topX} y1={topY} x2={botX} y2="14" stroke={RIM_H} strokeWidth="1" opacity="0.3" />
      })}
    </g>
  )

  // tubular bells / chimes — a cathedral-appropriate hanging brass rack
  const chimes = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <line x1="-104" y1="14" x2="-104" y2="-300" stroke={HW} strokeWidth="6" opacity="0.6" />
      <line x1="104" y1="14" x2="104" y2="-300" stroke={HW} strokeWidth="6" opacity="0.6" />
      <line x1="-120" y1="14" x2="120" y2="14" stroke={HW} strokeWidth="6" opacity="0.6" />
      <rect x="-112" y="-314" width="224" height="16" rx="7" fill="url(#hkShellV)" stroke={RIM} strokeWidth="2.5" />
      {Array.from({ length: 7 }, (_, i) => {
        const x = -84 + i * 28
        const len = 150 + i * 20
        return (
          <g key={i}>
            <rect x={x - 6} y="-292" width="12" height={len} rx="6" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="0.8" />
            <rect x={x - 6} y="-292" width="4" height={len} fill={RIM_H} opacity="0.4" />
            <ellipse cx={x} cy={-292 + len} rx="6" ry="3" fill={RIM_S} />
          </g>
        )
      })}
    </g>
  )

  // idle: a small cluster of drifting music notes rising from an instrument
  const GLYPHS = ['♪', '♫', '♩', '♬']
  const noteCluster = (x: number, y: number, seed: number, k: string) => (
    <g key={k} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <text
          key={i}
          x={x + (i - 1) * 18}
          y={y}
          className="hk-note"
          style={{ animationDelay: `${((seed + i * 1.3) % 3.4).toFixed(2)}s` }}
          fill={i % 2 === 0 ? GLOW : RIM_H}
          fontSize="30"
          opacity="0"
        >
          {GLYPHS[(seed + i) % 4]}
        </text>
      ))}
    </g>
  )

  // idle: drum kit gives a small struck-note burst (no rings — those read as blue circles)
  const drumFx = (x: number, y: number, k: string) => (
    <g key={k} aria-hidden="true">
      <text x={x} y={y - 34} className="hk-thump" style={{ animationDelay: '0.5s' }} fill={RIM_H} fontSize="26" textAnchor="middle" opacity="0">✺</text>
    </g>
  )

  return (
    <svg
      className="ornament-layer fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.82 }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="hkHead" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor={p.voidPurple} />
          <stop offset="70%" stopColor={SHELL} />
          <stop offset="100%" stopColor={SHELL_D} />
        </radialGradient>
        <linearGradient id="hkShellV" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={SHELL_D} />
          <stop offset="45%" stopColor={p.voidPurple} />
          <stop offset="100%" stopColor={SHELL_D} />
        </linearGradient>
        <linearGradient id="hkBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RIM_S} />
          <stop offset="45%" stopColor={RIM_H} />
          <stop offset="100%" stopColor={RIM_S} />
        </linearGradient>
      </defs>

      {/* harp set far BACK and small, floated up near the gothic windows (a distant
          back-row instrument, like the violin) — sits just above the drum kit */}
      {harp(1660, 560, 0.38, 'harp')}

      {/* === DRUM KIT — right gutter, set back (small + high) === */}
      <g transform="translate(1372, 392) scale(0.3)">
        <circle cx="960" cy="640" r="210" fill={GLOW} opacity="0.05" />
        {cymbal(675, 1004, 596, 112, -13, 'crash')}
        {cymbal(1230, 1004, 648, 120, 11, 'ride')}
        <line x1="545" y1="1004" x2="545" y2="762" stroke={HW} strokeWidth="4" opacity="0.7" />
        <ellipse cx="545" cy="752" rx="66" ry="11" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
        <ellipse cx="545" cy="770" rx="66" ry="11" fill="url(#hkBrass)" stroke={RIM_S} strokeWidth="1.5" />
        {floorTom(1238, 846, 148, 162, 'ft')}
        <line x1="960" y1="788" x2="960" y2="688" stroke={HW} strokeWidth="5" opacity="0.6" />
        <g transform="rotate(-12 882 704)">{drum(882, 704, 86, 70, 'tomL')}</g>
        <g transform="rotate(12 1042 704)">{drum(1042, 704, 86, 70, 'tomR')}</g>
        <line x1="742" y1="1004" x2="742" y2="838" stroke={HW} strokeWidth="3" opacity="0.65" />
        {drum(742, 828, 78, 30, 'snare')}
        {drum(960, 862, 168, 168, 'bass', true)}
      </g>

      {/* === stage-LEFT cluster (nudged toward centre): cello, keyboard, guitar === */}
      {strings(250, 712, 0.54, 'cello', true)}
      {keyboard(395, 700, 0.42, 'kb')}
      {guitar(525, 712, 0.34, -9, 'gtr')}

      {/* === stage-RIGHT cluster: trumpets + violin moved to the LEFT of the drum; chimes far right === */}
      {trumpets(1432, 712, 0.42, 'tp')}
      {strings(1520, 600, 0.33, 'violin', false)}
      {chimes(1810, 555, 0.4, 'chimes')}

      {/* === idle: drifting notes from melodic instruments + drum burst === */}
      {noteCluster(1675, 425, 0, 'n-harp')}
      {noteCluster(265, 565, 1, 'n-cello')}
      {noteCluster(410, 560, 2, 'n-kb')}
      {noteCluster(1450, 615, 3, 'n-tp')}
      {noteCluster(1530, 505, 4, 'n-vl')}
      {noteCluster(1820, 425, 5, 'n-chimes')}
      {drumFx(1655, 565, 'fx-drum')}
    </svg>
  )
})

// Muay Thai "gym" boss-stage — gothic-relic gym gear (hanging heavy bags, gloves, ring
// corner posts + ropes, corner stool) set BACK in the side negative spaces, behind the
// columns. Same treatment as the music stage: solid dark leather, tarnished brass, idle
// swing. Fighter only.
const FighterOrnaments = memo(function FighterOrnaments({ scrollY, p }: { scrollY: number; p: OrnamentPalette }) {
  void scrollY
  const SHELL = p.voidDeep
  const SHELL_D = p.void
  const RIM = p.brass
  const RIM_H = p.spiritGold
  const RIM_S = p.copper
  const HW = p.stoneGrey
  const GLOW = p.ethereal

  // hanging heavy bag — chain + leather cylinder + brass cap/straps; swings on its hang point
  const heavyBag = (tx: number, ty: number, s: number, k: string, delay: number) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.92">
      <g className="hk-swing" style={{ animationDelay: `${delay}s` }}>
        <line x1="0" y1="-360" x2="0" y2="-250" stroke={HW} strokeWidth="5" opacity="0.6" />
        <path d="M-26,-250 L0,-205 L26,-250" fill="none" stroke={RIM} strokeWidth="4" />
        <path d="M-40,-205 Q-44,-212 -36,-216 L36,-216 Q44,-212 40,-205 L40,40 Q40,72 0,72 Q-40,72 -40,40 Z" fill="url(#fgLeather)" stroke={SHELL_D} strokeWidth="2.5" />
        <ellipse cx="0" cy="-209" rx="40" ry="9" fill="url(#fgBrass)" stroke={RIM_S} strokeWidth="1.5" />
        {[-150, -78, 4].map((sy, i) => (
          <rect key={i} x="-42" y={sy} width="84" height="8" fill={RIM} opacity="0.5" />
        ))}
        <line x1="0" y1="-205" x2="0" y2="68" stroke={SHELL_D} strokeWidth="1.5" opacity="0.5" />
        <path d="M-26,-198 Q-34,-80 -26,52" fill="none" stroke={RIM_H} strokeWidth="2.5" opacity="0.18" />
      </g>
    </g>
  )

  // pair of boxing gloves hanging by their laces; sways
  const gloves = (tx: number, ty: number, s: number, k: string, delay: number) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <g className="hk-sway" style={{ animationDelay: `${delay}s` }}>
        <line x1="0" y1="-118" x2="-20" y2="-40" stroke={HW} strokeWidth="3" opacity="0.6" />
        <line x1="0" y1="-118" x2="20" y2="-40" stroke={HW} strokeWidth="3" opacity="0.6" />
        <circle cx="0" cy="-120" r="4" fill={RIM} />
        <g transform="translate(-24,0)">
          <path d="M-22,-40 Q-32,-44 -30,-18 Q-32,12 -8,18 Q18,20 20,-8 Q26,-16 18,-30 Q12,-46 -22,-40 Z" fill="url(#fgGlove)" stroke={SHELL_D} strokeWidth="2" />
          <path d="M-14,-16 Q-18,2 -2,8" fill="none" stroke={SHELL_D} strokeWidth="1.5" opacity="0.5" />
          <rect x="-28" y="-46" width="15" height="9" rx="3" fill={RIM} stroke={RIM_S} strokeWidth="0.8" />
        </g>
        <g transform="translate(26,4) scale(-1,1)">
          <path d="M-22,-40 Q-32,-44 -30,-18 Q-32,12 -8,18 Q18,20 20,-8 Q26,-16 18,-30 Q12,-46 -22,-40 Z" fill="url(#fgGlove)" stroke={SHELL_D} strokeWidth="2" />
          <rect x="-28" y="-46" width="15" height="9" rx="3" fill={RIM} stroke={RIM_S} strokeWidth="0.8" />
        </g>
      </g>
    </g>
  )

  // ring corner post + turnbuckle pad + three ropes running inward (mirror with negative s for the other side)
  const ringPost = (tx: number, ty: number, s: number, ropeDir: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.85">
      <ellipse cx="0" cy="2" rx="24" ry="6" fill={SHELL_D} opacity="0.6" />
      <rect x="-10" y="-230" width="20" height="232" fill="url(#fgBrass)" stroke={RIM_S} strokeWidth="1.5" />
      <rect x="-17" y="-218" width="34" height="66" rx="9" fill="url(#fgLeather)" stroke={SHELL_D} strokeWidth="2" />
      <circle cx="0" cy="-185" r="4" fill={RIM_H} opacity="0.4" />
      {[-198, -150, -102].map((ry, i) => (
        <line key={i} x1="0" y1={ry} x2={ropeDir * 230} y2={ry + 8} stroke={RIM} strokeWidth="4.5" opacity="0.5" />
      ))}
    </g>
  )

  // worn corner stool with a folded Thai pad leaning on it
  const stool = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.85">
      <line x1="-26" y1="0" x2="-20" y2="-64" stroke={HW} strokeWidth="5" opacity="0.7" />
      <line x1="26" y1="0" x2="20" y2="-64" stroke={HW} strokeWidth="5" opacity="0.7" />
      <line x1="-20" y1="-30" x2="20" y2="-30" stroke={HW} strokeWidth="3" opacity="0.5" />
      <rect x="-30" y="-78" width="60" height="16" rx="4" fill="url(#fgLeather)" stroke={SHELL_D} strokeWidth="2" />
      {/* leaning Thai pad */}
      <g transform="translate(34,-2) rotate(16)">
        <rect x="-9" y="-92" width="22" height="92" rx="7" fill="url(#fgGlove)" stroke={SHELL_D} strokeWidth="2" />
        <line x1="-9" y1="-46" x2="13" y2="-46" stroke={RIM} strokeWidth="3" opacity="0.5" />
        <rect x="-7" y="-6" width="18" height="10" rx="2" fill={RIM} opacity="0.7" />
      </g>
    </g>
  )

  // speed bag — teardrop bag under a round wall platform; sways
  const speedBag = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <ellipse cx="0" cy="-110" rx="58" ry="14" fill="url(#fgBrass)" stroke={RIM_S} strokeWidth="1.5" />
      <ellipse cx="0" cy="-110" rx="58" ry="14" fill="none" stroke={RIM_H} strokeWidth="1" opacity="0.4" />
      <g className="hk-sway" style={{ animationDelay: '0.3s' }}>
        <line x1="0" y1="-104" x2="0" y2="-78" stroke={HW} strokeWidth="3" opacity="0.6" />
        <path d="M-20,-78 Q-24,-40 0,-30 Q24,-40 20,-78 Q12,-86 0,-84 Q-12,-86 -20,-78 Z" fill="url(#fgGlove)" stroke={SHELL_D} strokeWidth="2" />
        <line x1="-14" y1="-70" x2="14" y2="-70" stroke={RIM} strokeWidth="2" opacity="0.5" />
      </g>
    </g>
  )

  // double-end bag — small ball tethered top + bottom
  const doubleEndBag = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <line x1="0" y1="-200" x2="0" y2="-70" stroke={HW} strokeWidth="2.5" opacity="0.5" strokeDasharray="6 5" />
      <line x1="0" y1="-30" x2="0" y2="40" stroke={HW} strokeWidth="2.5" opacity="0.5" strokeDasharray="6 5" />
      <g className="hk-sway" style={{ animationDelay: '1.1s' }}>
        <circle cx="0" cy="-50" r="22" fill="url(#fgGlove)" stroke={SHELL_D} strokeWidth="2" />
        <path d="M-14,-58 Q-18,-44 -6,-36" fill="none" stroke={SHELL_D} strokeWidth="1.5" opacity="0.5" />
        <rect x="-6" y="-74" width="12" height="6" rx="2" fill={RIM} opacity="0.7" />
      </g>
    </g>
  )

  // coiled jump rope hanging on a peg; sways
  const jumpRope = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.85">
      <circle cx="0" cy="-150" r="5" fill={RIM} />
      <g className="hk-sway" style={{ animationDelay: '0.6s' }}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${-14 + i * 4},-148 Q${-46 - i * 8},-70 ${-6 + i * 3},-12 Q${30 + i * 6},-70 ${10 - i * 3},-148`} fill="none" stroke={RIM} strokeWidth="3" opacity="0.5" />
        ))}
        <rect x="-26" y="-12" width="12" height="34" rx="5" fill="url(#fgLeather)" stroke={SHELL_D} strokeWidth="1.5" />
        <rect x="14" y="-12" width="12" height="34" rx="5" fill="url(#fgLeather)" stroke={SHELL_D} strokeWidth="1.5" />
      </g>
    </g>
  )

  // corner water bucket
  const bucket = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.85">
      <path d="M-30,-46 L30,-46 L24,2 Q24,8 0,8 Q-24,8 -24,2 Z" fill="url(#fgLeather)" stroke={RIM} strokeWidth="2.5" />
      <ellipse cx="0" cy="-46" rx="30" ry="8" fill={SHELL_D} stroke={RIM} strokeWidth="1.5" />
      <path d="M-30,-44 Q0,-72 30,-44" fill="none" stroke={RIM} strokeWidth="2.5" />
      <ellipse cx="0" cy="-46" rx="22" ry="5" fill={GLOW} opacity="0.12" />
    </g>
  )

  // mongkol — the sacred Muay Thai headband, hanging from a hook; sways
  const mongkol = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.85">
      <circle cx="0" cy="-90" r="4" fill={RIM} />
      <g className="hk-sway" style={{ animationDelay: '1.6s' }}>
        <ellipse cx="0" cy="-44" rx="38" ry="46" fill="none" stroke="url(#fgBrass)" strokeWidth="7" />
        <ellipse cx="0" cy="-44" rx="38" ry="46" fill="none" stroke={RIM_H} strokeWidth="2" opacity="0.4" />
        <path d="M-10,2 Q0,16 10,2" fill="none" stroke={RIM} strokeWidth="5" />
        <path d="M-6,12 L-10,40 M6,12 L10,40" stroke={RIM} strokeWidth="4" opacity="0.6" />
        <circle cx="0" cy="-86" r="7" fill="url(#fgBrass)" stroke={RIM_S} strokeWidth="1" />
      </g>
    </g>
  )

  // Thai kick shield — a big curved pad leaning (a prominent piece)
  const kickShield = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.9">
      <rect x="-46" y="-300" width="92" height="300" rx="40" fill="url(#fgLeather)" stroke={RIM} strokeWidth="3" />
      <rect x="-30" y="-286" width="60" height="272" rx="28" fill="none" stroke={SHELL_D} strokeWidth="2" opacity="0.5" />
      {[-230, -150, -70].map((sy, i) => <line key={i} x1="-46" y1={sy} x2="46" y2={sy} stroke={RIM} strokeWidth="3" opacity="0.4" />)}
      <ellipse cx="0" cy="-150" rx="18" ry="58" fill={RIM_H} opacity="0.08" />
    </g>
  )

  // focus mitts — a pair of round target pads
  const focusMitts = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.88">
      {[-1, 1].map((dir, i) => (
        <g key={i} transform={`translate(${dir * 40},${i * 8}) rotate(${dir * 14})`}>
          <circle cx="0" cy="-70" r="42" fill="url(#fgGlove)" stroke={SHELL_D} strokeWidth="2.5" />
          <circle cx="0" cy="-70" r="22" fill="none" stroke={RIM} strokeWidth="3" opacity="0.5" />
          <circle cx="0" cy="-70" r="8" fill={RIM_H} opacity="0.4" />
          <rect x="-12" y="-32" width="24" height="34" rx="8" fill="url(#fgLeather)" stroke={SHELL_D} strokeWidth="2" />
        </g>
      ))}
    </g>
  )

  // hand wraps coiled on a peg; sways
  const handWraps = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.85">
      <circle cx="0" cy="-120" r="4" fill={RIM} />
      <g className="hk-sway" style={{ animationDelay: '2s' }}>
        <ellipse cx="0" cy="-96" rx="26" ry="22" fill="none" stroke="url(#fgBrass)" strokeWidth="9" />
        <ellipse cx="0" cy="-96" rx="26" ry="22" fill="none" stroke={RIM_H} strokeWidth="1.5" opacity="0.3" />
        <path d="M-18,-80 Q-30,-30 -14,10" fill="none" stroke={RIM} strokeWidth="6" opacity="0.6" />
        <path d="M16,-82 Q28,-34 12,8" fill="none" stroke={RIM} strokeWidth="6" opacity="0.5" />
      </g>
    </g>
  )

  // kettlebell on the floor
  const kettlebell = (tx: number, ty: number, s: number, k: string) => (
    <g key={k} transform={`translate(${tx},${ty}) scale(${s})`} opacity="0.88">
      <ellipse cx="0" cy="2" rx="40" ry="8" fill={SHELL_D} opacity="0.5" />
      <path d="M-40,-30 Q-40,-70 0,-70 Q40,-70 40,-30 Q40,8 0,8 Q-40,8 -40,-30 Z" fill="url(#fgLeather)" stroke={RIM} strokeWidth="2.5" />
      <path d="M-22,-60 Q-30,-104 0,-104 Q30,-104 22,-60" fill="none" stroke="url(#fgBrass)" strokeWidth="10" />
      <ellipse cx="-12" cy="-24" rx="10" ry="16" fill={RIM_H} opacity="0.1" />
    </g>
  )

  // idle: a small struck-impact burst near a bag (sparse, like the drum's)
  const impact = (x: number, y: number) => (
    <text x={x} y={y} className="hk-thump" style={{ animationDelay: '0.7s' }} fill={RIM_H} fontSize="24" textAnchor="middle" opacity="0" aria-hidden="true">✦</text>
  )

  return (
    <svg
      className="ornament-layer fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.95 }}
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        {/* brighter, more saturated leather so the gym gear reads clearly on the dark stage */}
        <linearGradient id="fgLeather" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={p.voidDeep} />
          <stop offset="45%" stopColor="#3e2a4a" />
          <stop offset="100%" stopColor={p.voidDeep} />
        </linearGradient>
        <linearGradient id="fgGlove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2742" />
          <stop offset="60%" stopColor={SHELL} />
          <stop offset="100%" stopColor={SHELL_D} />
        </linearGradient>
        <linearGradient id="fgBrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={RIM_S} />
          <stop offset="45%" stopColor={RIM_H} />
          <stop offset="100%" stopColor={RIM_S} />
        </linearGradient>
      </defs>

      {/* ring corner posts framing the stage — bigger now, more prominent */}
      {ringPost(48, 762, 0.58, 1, 'postL')}
      {ringPost(1872, 762, 0.58, -1, 'postR')}

      {/* PROMINENT centrepieces: big heavy bag centre-right + leaning kick shield + mongkol overhead */}
      {heavyBag(1664, 534, 0.47, 'bagMain', 0.6)}
      {kickShield(1500, 700, 0.5, 'shield')}
      {mongkol(1574, 424, 0.44, 'mongkol')}

      {/* left gutter — heavy bag, double-end bag, gloves, jump rope, hand wraps, kettlebell */}
      {heavyBag(255, 452, 0.42, 'bagL', 0)}
      {doubleEndBag(560, 466, 0.5, 'deBag')}
      {gloves(420, 562, 0.5, 'glovesL', 0.8)}
      {jumpRope(305, 708, 0.56, 'rope')}
      {handWraps(118, 556, 0.48, 'wraps')}
      {kettlebell(640, 714, 0.4, 'kb')}

      {/* right corner — speed bag overhead, focus mitts, stool, bucket */}
      {speedBag(1796, 456, 0.66, 'speed')}
      {focusMitts(1720, 716, 0.42, 'mitts')}
      {stool(1806, 714, 0.4, 'stool')}
      {bucket(1874, 706, 0.46, 'bucket')}

      {/* faint stage glow + idle impacts near the bags */}
      <circle cx="1664" cy="470" r="72" fill={GLOW} opacity="0.05" />
      {impact(255, 540)}
      {impact(1664, 600)}
    </svg>
  )
})

// Container component that selects ornaments based on profession
const ProfessionStage = memo(function ProfessionStage({ profession, p }: { profession: 'engineer' | 'drummer' | 'fighter'; p: OrnamentPalette }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden" aria-hidden="true">
      {/* z-[0]: sits BELOW the z-[1] HollowDepths columns so instruments read as set
          BEHIND the architecture (was z-[2], which painted them in front of the columns). */}
      {profession === 'engineer' && <EngineerOrnaments scrollY={scrollY} p={p} />}
      {profession === 'drummer' && <MusicianOrnaments scrollY={scrollY} p={p} />}
      {profession === 'fighter' && <FighterOrnaments scrollY={scrollY} p={p} />}
    </div>
  )
})

// ---- theme-derived palette + global render (every world EXCEPT dark-fantasy, which keeps its own) ----
function clampHex(n: number) { return Math.max(0, Math.min(255, Math.round(n))) }
function parseHex(h: string) {
  let s = h.replace('#', '')
  if (s.length === 3) s = s.split('').map((ch) => ch + ch).join('')
  return [parseInt(s.slice(0, 2), 16) || 0, parseInt(s.slice(2, 4), 16) || 0, parseInt(s.slice(4, 6), 16) || 0]
}
function mix(a: string, b: string, t: number) {
  const [ar, ag, ab] = parseHex(a), [br, bg, bb] = parseHex(b)
  const r = clampHex(ar + (br - ar) * t), g = clampHex(ag + (bg - ag) * t), bl = clampHex(ab + (bb - ab) * t)
  return '#' + [r, g, bl].map((v) => v.toString(16).padStart(2, '0')).join('')
}

function paletteFromColors(c: { background: string; accent: string; secondary: string; text?: string }): OrnamentPalette {
  const bg = c.background, ac = c.accent, sc = c.secondary || c.accent
  return {
    void: bg,
    voidDeep: mix(bg, ac, 0.1),
    voidPurple: mix(bg, ac, 0.22),
    ethereal: ac,
    etherealDark: mix(ac, '#ffffff', 0.25),
    spiritGold: sc,
    brass: sc,
    copper: mix(sc, bg, 0.35),
    stoneGrey: mix(bg, '#8a8a92', 0.6),
    bone: c.text || mix(ac, '#ffffff', 0.6),
  }
}

/** Renders the profession boss-stage in any world, recoloured from its theme. Dark Fantasy
 *  renders its own hand-tuned set, so we skip it here to avoid doubling up. */
export default function GlobalProfessionStage() {
  const { theme } = useTheme()
  const { active } = useProfession()
  if (theme.id === 'dark-fantasy') return null
  const p = paletteFromColors(theme.colors)
  return <ProfessionStage profession={active} p={p} />
}

