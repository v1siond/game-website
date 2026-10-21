'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job, Project } from '@/lib/cv/content'
import type { ProfessionSections } from '@/lib/cv/cvView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

// Borderlands color palette - desert wasteland + loot rarity
const BORDERLANDS_COLORS = {
  // Desert/wasteland tones
  sand: '#e8c170',
  dustyOrange: '#d4763d',
  wastelandYellow: '#f0c850',
  sunBurn: '#cc6633',
  panderanDust: '#c9a961',
  // Loot rarity colors
  common: '#9a9a9a',
  uncommon: '#45b035',
  rare: '#4d7eff',
  epic: '#9f40ff',
  legendary: '#ff9500',
  pearlescent: '#00ced1',
  // Accent colors
  psychoRed: '#cc2222',
  clapTrapYellow: '#ffcc00',
  eridium: '#9966cc',
  ink: '#1a1a1a',
  paper: '#f5ecd5',
}

// Comic book halftone pattern - enhanced with cel-shading gradient
function HalftoneBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1]"
      aria-hidden="true"
    >
      {/* Base halftone dots */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle, ${BORDERLANDS_COLORS.ink} 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
        }}
      />
      {/* Cel-shading gradient overlay */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(180deg,
            transparent 0%,
            ${BORDERLANDS_COLORS.dustyOrange}10 25%,
            ${BORDERLANDS_COLORS.sand}20 50%,
            ${BORDERLANDS_COLORS.sunBurn}15 75%,
            ${BORDERLANDS_COLORS.ink}30 100%
          )`,
        }}
      />
    </div>
  )
}

// Wasteland grunge texture overlay - enhanced with graffiti/spray paint effect
function WastelandTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2]"
      aria-hidden="true"
    >
      {/* Cross-hatch ink texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 2px, ${BORDERLANDS_COLORS.ink} 2px, transparent 4px),
            repeating-linear-gradient(90deg, transparent, transparent 2px, ${BORDERLANDS_COLORS.ink} 2px, transparent 4px)
          `,
        }}
      />
      {/* Spray paint speckle effect */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${BORDERLANDS_COLORS.dustyOrange} 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, ${BORDERLANDS_COLORS.wastelandYellow} 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, ${BORDERLANDS_COLORS.sand} 1px, transparent 1px)
          `,
          backgroundSize: '47px 53px, 31px 37px, 23px 29px',
        }}
      />
      {/* Sand/dust overlay */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: `linear-gradient(135deg,
            ${BORDERLANDS_COLORS.sand}40 0%,
            transparent 50%,
            ${BORDERLANDS_COLORS.panderanDust}30 100%
          )`,
        }}
      />
    </div>
  )
}

// Psycho mask silhouette decoration
function PsychoMask({ x, y, size, rotation = 0 }: { x: number; y: number; size: number; rotation?: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.12]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <svg width={size} height={size * 1.2} viewBox="0 0 80 96" fill={BORDERLANDS_COLORS.ink}>
        {/* Psycho mask shape */}
        <ellipse cx="40" cy="48" rx="35" ry="42" />
        {/* Eye holes */}
        <ellipse cx="28" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
        <ellipse cx="52" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
        {/* Stitched mouth */}
        <path
          d="M20,65 Q28,75 40,75 Q52,75 60,65"
          fill="none"
          stroke={BORDERLANDS_COLORS.paper}
          strokeWidth="3"
        />
        {/* Mouth stitches */}
        <line x1="28" y1="66" x2="28" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
        <line x1="36" y1="68" x2="36" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
        <line x1="44" y1="68" x2="44" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
        <line x1="52" y1="66" x2="52" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
      </svg>
    </div>
  )
}

// Graffiti drip decoration
function GraffitiDrip({ x, y, color, height = 40 }: { x: number; y: number; color: string; height?: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-30"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width="20" height={height} viewBox={`0 0 20 ${height}`}>
        <path
          d={`M10,0 Q8,${height * 0.3} 10,${height * 0.5} Q12,${height * 0.7} 10,${height} Q9,${height - 5} 10,${height - 8} Q8,${height * 0.6} 10,${height * 0.4} Q11,${height * 0.2} 10,0`}
          fill={color}
        />
      </svg>
    </div>
  )
}

// Ink splatter decoration - hand-drawn sketch quality
function InkSplatter({ x, y, size, color = BORDERLANDS_COLORS.ink, rotation = 0 }: { x: number; y: number; size: number; color?: string; rotation?: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        borderRadius: '60% 40% 50% 50%',
        transform: `rotate(${rotation}deg)`,
        boxShadow: `3px 3px 0 ${BORDERLANDS_COLORS.ink}`,
        // Hand-drawn wobble effect
        filter: 'url(#borderlands-sketch)',
      }}
    />
  )
}

// Floating damage numbers - respects reduced motion
function DamageNumber({ x, y, value, color, reducedMotion = false }: { x: number; y: number; value: string; color: string; reducedMotion?: boolean }) {
  return (
    <div
      className={`fixed pointer-events-none z-[3] font-black text-2xl ${reducedMotion ? '' : 'animate-damage-float'}`}
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color: color,
        textShadow: `4px 4px 0 ${BORDERLANDS_COLORS.ink}, -1px -1px 0 ${BORDERLANDS_COLORS.ink}, 1px -1px 0 ${BORDERLANDS_COLORS.ink}, -1px 1px 0 ${BORDERLANDS_COLORS.ink}`,
        fontFamily: '"Bangers", "Impact", sans-serif',
        WebkitTextStroke: `2px ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      +{value}
    </div>
  )
}

// Gun silhouette decoration - Jakobs/Hyperion style
function GunSilhouette({ x, y, rotation, flip }: { x: number; y: number; rotation: number; flip?: boolean }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.15]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}`,
      }}
    >
      <svg width="140" height="60" viewBox="0 0 140 60" fill={BORDERLANDS_COLORS.ink}>
        {/* Main body with cel-shading */}
        <path
          d="M5,28 L42,28 L47,22 L95,22 L100,16 L130,16 L135,20 L135,28 L125,28 L125,34 L100,34 L100,40 L65,40 L60,34 L47,34 L42,40 L32,40 L32,34 L5,34 Z"
          stroke={BORDERLANDS_COLORS.ink}
          strokeWidth="3"
        />
        {/* Magazine */}
        <rect x="26" y="34" width="18" height="20" rx="2" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
        {/* Scope */}
        <ellipse cx="80" cy="14" rx="8" ry="4" fill={BORDERLANDS_COLORS.rare} opacity="0.6" />
        {/* Trigger detail */}
        <path d="M52,34 L52,44 L48,44" fill="none" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
      </svg>
    </div>
  )
}

// Vault symbol - authentic Borderlands vault key design
function VaultSymbol({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.12]"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
        {/* Outer ring with thick ink outline */}
        <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" strokeDasharray="8 4" />
        {/* Inner ring */}
        <circle cx="50" cy="50" r="30" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="4" />
        {/* Cardinal lines */}
        <line x1="50" y1="5" x2="50" y2="20" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <line x1="50" y1="80" x2="50" y2="95" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <line x1="5" y1="50" x2="20" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        <line x1="80" y1="50" x2="95" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
        {/* V-shape (Vault symbol core) */}
        <path d="M35,35 L50,55 L65,35" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Bottom detail */}
        <path d="M42,60 L50,70 L58,60" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  )
}

// Claptrap robot silhouette - with cel-shaded details
function ClaptrapSilhouette({ x, y, reducedMotion = false }: { x: number; y: number; reducedMotion?: boolean }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-[0.18]"
      aria-hidden="true"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width="80" height="100" viewBox="0 0 80 100">
        {/* Body with outline */}
        <rect x="15" y="30" width="50" height="45" rx="5" fill={BORDERLANDS_COLORS.ink} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
        {/* Body highlight (cel-shading) */}
        <rect x="18" y="33" width="20" height="39" rx="3" fill={BORDERLANDS_COLORS.clapTrapYellow} opacity="0.3" />
        {/* Eye */}
        <circle cx="40" cy="50" r="14" fill={BORDERLANDS_COLORS.paper} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
        <circle cx="40" cy="50" r="9" fill={BORDERLANDS_COLORS.rare} />
        <circle cx="43" cy="47" r="4" fill="#fff" />
        {/* Eye glow */}
        <circle cx="40" cy="50" r="9" fill="none" stroke={BORDERLANDS_COLORS.rare} strokeWidth="2" opacity="0.5" className={reducedMotion ? '' : 'animate-pulse'} />
        {/* Antenna */}
        <rect x="37" y="10" width="6" height="20" fill={BORDERLANDS_COLORS.ink} />
        <circle cx="40" cy="10" r="6" fill={BORDERLANDS_COLORS.clapTrapYellow} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
        {/* Wheel */}
        <circle cx="40" cy="85" r="13" fill={BORDERLANDS_COLORS.ink} />
        <circle cx="40" cy="85" r="7" fill={BORDERLANDS_COLORS.paper} />
        <circle cx="40" cy="85" r="3" fill={BORDERLANDS_COLORS.ink} />
        {/* Arms */}
        <rect x="0" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
        <rect x="65" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
        {/* Arm joints */}
        <circle cx="15" cy="44" r="4" fill={BORDERLANDS_COLORS.clapTrapYellow} />
        <circle cx="65" cy="44" r="4" fill={BORDERLANDS_COLORS.clapTrapYellow} />
      </svg>
    </div>
  )
}

// Explosion burst decoration - comic book action word
function ExplosionBurst({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <div
      className="fixed pointer-events-none z-[4]"
      aria-hidden="true"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg width="120" height="80" viewBox="0 0 120 80">
        {/* Outer burst with cel-shading */}
        <polygon
          points="60,2 72,22 98,17 82,38 105,55 73,48 60,78 47,48 15,55 38,38 22,17 48,22"
          fill={BORDERLANDS_COLORS.legendary}
          stroke={BORDERLANDS_COLORS.ink}
          strokeWidth="4"
        />
        {/* Inner highlight burst */}
        <polygon
          points="60,12 68,26 88,22 76,38 92,50 69,45 60,68 51,45 28,50 44,38 32,22 52,26"
          fill={BORDERLANDS_COLORS.clapTrapYellow}
          stroke={BORDERLANDS_COLORS.ink}
          strokeWidth="2"
        />
        {/* Action text */}
        <text
          x="60"
          y="44"
          textAnchor="middle"
          fill={BORDERLANDS_COLORS.ink}
          fontSize="14"
          fontWeight="900"
          fontFamily="Bangers, Impact, sans-serif"
          style={{ letterSpacing: '1px' }}
        >
          {text}
        </text>
      </svg>
    </div>
  )
}

// Art Section Break - Borderlands themed decorative divider
function ArtSectionBreak({ variant = 1, reducedMotion = false }: { variant?: 1 | 2 | 3; reducedMotion?: boolean }) {
  // Variant 1: Vault symbols with psycho masks
  if (variant === 1) {
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        {/* Central vault symbol */}
        <div className="flex items-center justify-center gap-4">
          {/* Left psycho mask */}
          <div className="opacity-40" style={{ transform: 'rotate(-15deg)' }}>
            <svg width="60" height="72" viewBox="0 0 80 96" fill={BORDERLANDS_COLORS.ink}>
              <ellipse cx="40" cy="48" rx="35" ry="42" />
              <ellipse cx="28" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <ellipse cx="52" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <path d="M20,65 Q28,75 40,75 Q52,75 60,65" fill="none" stroke={BORDERLANDS_COLORS.paper} strokeWidth="3" />
              <line x1="28" y1="66" x2="28" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="36" y1="68" x2="36" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="44" y1="68" x2="44" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="52" y1="66" x2="52" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
            </svg>
          </div>

          {/* Left decorative line */}
          <div
            className="h-1 flex-1 max-w-32"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${BORDERLANDS_COLORS.clapTrapYellow} 50%, ${BORDERLANDS_COLORS.legendary} 100%)`,
              border: `2px solid ${BORDERLANDS_COLORS.ink}`,
            }}
          />

          {/* Main vault symbol */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <circle cx="50" cy="50" r="45" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" strokeDasharray="8 4" />
            <circle cx="50" cy="50" r="30" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="4" />
            <line x1="50" y1="5" x2="50" y2="20" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <line x1="50" y1="80" x2="50" y2="95" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <line x1="5" y1="50" x2="20" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <line x1="80" y1="50" x2="95" y2="50" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="5" />
            <path d="M35,35 L50,55 L65,35" stroke={BORDERLANDS_COLORS.legendary} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M42,60 L50,70 L58,60" stroke={BORDERLANDS_COLORS.clapTrapYellow} strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>

          {/* Right decorative line */}
          <div
            className="h-1 flex-1 max-w-32"
            style={{
              background: `linear-gradient(90deg, ${BORDERLANDS_COLORS.legendary} 0%, ${BORDERLANDS_COLORS.clapTrapYellow} 50%, transparent 100%)`,
              border: `2px solid ${BORDERLANDS_COLORS.ink}`,
            }}
          />

          {/* Right psycho mask */}
          <div className="opacity-40" style={{ transform: 'rotate(15deg)' }}>
            <svg width="60" height="72" viewBox="0 0 80 96" fill={BORDERLANDS_COLORS.ink}>
              <ellipse cx="40" cy="48" rx="35" ry="42" />
              <ellipse cx="28" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <ellipse cx="52" cy="38" rx="8" ry="12" fill={BORDERLANDS_COLORS.paper} />
              <path d="M20,65 Q28,75 40,75 Q52,75 60,65" fill="none" stroke={BORDERLANDS_COLORS.paper} strokeWidth="3" />
              <line x1="28" y1="66" x2="28" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="36" y1="68" x2="36" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="44" y1="68" x2="44" y2="75" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
              <line x1="52" y1="66" x2="52" y2="74" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Floating small decorations */}
        <div className="absolute top-4 left-1/4 opacity-30" style={{ transform: 'rotate(-20deg)' }}>
          <svg width="30" height="30" viewBox="0 0 30 30">
            <polygon points="15,0 18,12 30,12 20,19 24,30 15,23 6,30 10,19 0,12 12,12" fill={BORDERLANDS_COLORS.legendary} stroke={BORDERLANDS_COLORS.ink} strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-4 right-1/4 opacity-30" style={{ transform: 'rotate(25deg)' }}>
          <svg width="25" height="25" viewBox="0 0 30 30">
            <polygon points="15,0 18,12 30,12 20,19 24,30 15,23 6,30 10,19 0,12 12,12" fill={BORDERLANDS_COLORS.psychoRed} stroke={BORDERLANDS_COLORS.ink} strokeWidth="1" />
          </svg>
        </div>
      </div>
    )
  }

  // Variant 2: Loot drops with weapon silhouettes
  if (variant === 2) {
    return (
      <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
        <div className="flex items-center justify-center gap-6">
          {/* Left weapon silhouette */}
          <div className="opacity-30" style={{ transform: 'rotate(-10deg)' }}>
            <svg width="100" height="45" viewBox="0 0 140 60" fill={BORDERLANDS_COLORS.ink}>
              <path d="M5,28 L42,28 L47,22 L95,22 L100,16 L130,16 L135,20 L135,28 L125,28 L125,34 L100,34 L100,40 L65,40 L60,34 L47,34 L42,40 L32,40 L32,34 L5,34 Z" stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
              <rect x="26" y="34" width="18" height="20" rx="2" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
              <ellipse cx="80" cy="14" rx="8" ry="4" fill={BORDERLANDS_COLORS.rare} opacity="0.6" />
            </svg>
          </div>

          {/* Loot beam / pillar */}
          <div className="relative">
            {/* Glow effect */}
            <div
              className={`absolute inset-0 ${reducedMotion ? '' : 'animate-pulse'}`}
              style={{
                background: `radial-gradient(ellipse at center, ${BORDERLANDS_COLORS.legendary}40 0%, transparent 70%)`,
                filter: 'blur(10px)',
                transform: 'scale(1.5)',
              }}
            />
            {/* Loot chest icon */}
            <svg width="80" height="60" viewBox="0 0 80 60" className="relative z-10">
              {/* Chest base */}
              <rect x="5" y="25" width="70" height="35" rx="5" fill={BORDERLANDS_COLORS.legendary} stroke={BORDERLANDS_COLORS.ink} strokeWidth="4" />
              {/* Chest lid */}
              <path d="M5,30 Q40,5 75,30" fill={BORDERLANDS_COLORS.clapTrapYellow} stroke={BORDERLANDS_COLORS.ink} strokeWidth="4" />
              {/* Chest lock */}
              <rect x="32" y="30" width="16" height="12" rx="2" fill={BORDERLANDS_COLORS.ink} />
              <circle cx="40" cy="36" r="3" fill={BORDERLANDS_COLORS.clapTrapYellow} />
              {/* Shine lines */}
              <line x1="15" y1="40" x2="25" y2="40" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" opacity="0.6" />
              <line x1="55" y1="40" x2="65" y2="40" stroke={BORDERLANDS_COLORS.paper} strokeWidth="2" opacity="0.6" />
            </svg>
          </div>

          {/* Floating loot items */}
          <div className="flex flex-col gap-2">
            {/* Legendary drop */}
            <div
              className={`px-3 py-1 text-xs font-black tracking-wider ${reducedMotion ? '' : 'animate-bounce'}`}
              style={{
                background: BORDERLANDS_COLORS.legendary,
                color: BORDERLANDS_COLORS.ink,
                border: `2px solid ${BORDERLANDS_COLORS.ink}`,
                boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}, 0 0 15px ${BORDERLANDS_COLORS.legendary}50`,
                animationDuration: '2s',
              }}
            >
              LEGENDARY
            </div>
            {/* Epic drop */}
            <div
              className={`px-3 py-1 text-xs font-black tracking-wider ${reducedMotion ? '' : 'animate-bounce'}`}
              style={{
                background: BORDERLANDS_COLORS.epic,
                color: '#fff',
                border: `2px solid ${BORDERLANDS_COLORS.ink}`,
                boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
                animationDelay: '0.3s',
                animationDuration: '2s',
              }}
            >
              EPIC
            </div>
            {/* Rare drop */}
            <div
              className={`px-3 py-1 text-xs font-black tracking-wider ${reducedMotion ? '' : 'animate-bounce'}`}
              style={{
                background: BORDERLANDS_COLORS.rare,
                color: '#fff',
                border: `2px solid ${BORDERLANDS_COLORS.ink}`,
                boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
                animationDelay: '0.6s',
                animationDuration: '2s',
              }}
            >
              RARE
            </div>
          </div>

          {/* Right weapon silhouette */}
          <div className="opacity-30" style={{ transform: 'rotate(10deg) scaleX(-1)' }}>
            <svg width="100" height="45" viewBox="0 0 140 60" fill={BORDERLANDS_COLORS.ink}>
              <path d="M5,28 L42,28 L47,22 L95,22 L100,16 L130,16 L135,20 L135,28 L125,28 L125,34 L100,34 L100,40 L65,40 L60,34 L47,34 L42,40 L32,40 L32,34 L5,34 Z" stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
              <rect x="26" y="34" width="18" height="20" rx="2" stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
              <ellipse cx="80" cy="14" rx="8" ry="4" fill={BORDERLANDS_COLORS.epic} opacity="0.6" />
            </svg>
          </div>
        </div>

        {/* Eridium crystals */}
        <div className="absolute top-6 left-1/3 opacity-40">
          <svg width="20" height="35" viewBox="0 0 20 35">
            <polygon points="10,0 20,25 10,35 0,25" fill={BORDERLANDS_COLORS.eridium} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
            <line x1="10" y1="5" x2="10" y2="15" stroke="#fff" strokeWidth="2" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute bottom-6 right-1/3 opacity-40" style={{ transform: 'rotate(20deg)' }}>
          <svg width="15" height="28" viewBox="0 0 20 35">
            <polygon points="10,0 20,25 10,35 0,25" fill={BORDERLANDS_COLORS.eridium} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
          </svg>
        </div>
      </div>
    )
  }

  // Variant 3: Cel-shaded action lines with Claptrap
  return (
    <div className="relative py-12 my-8 overflow-hidden" aria-hidden="true">
      <div className="flex items-center justify-center gap-8">
        {/* Left action lines */}
        <div className="flex gap-1 items-end opacity-60">
          {[25, 40, 55, 35, 50, 30].map((h, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: h,
                background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.clapTrapYellow} 0%, ${BORDERLANDS_COLORS.legendary} 100%)`,
                border: `1px solid ${BORDERLANDS_COLORS.ink}`,
                transform: `rotate(${-15 + i * 3}deg)`,
              }}
            />
          ))}
        </div>

        {/* Explosion/Impact burst */}
        <div className="relative">
          <svg width="120" height="80" viewBox="0 0 120 80">
            <polygon
              points="60,2 72,22 98,17 82,38 105,55 73,48 60,78 47,48 15,55 38,38 22,17 48,22"
              fill={BORDERLANDS_COLORS.legendary}
              stroke={BORDERLANDS_COLORS.ink}
              strokeWidth="4"
            />
            <polygon
              points="60,12 68,26 88,22 76,38 92,50 69,45 60,68 51,45 28,50 44,38 32,22 52,26"
              fill={BORDERLANDS_COLORS.clapTrapYellow}
              stroke={BORDERLANDS_COLORS.ink}
              strokeWidth="2"
            />
            <text x="60" y="44" textAnchor="middle" fill={BORDERLANDS_COLORS.ink} fontSize="12" fontWeight="900" fontFamily="Bangers, Impact, sans-serif">
              BADASS!
            </text>
          </svg>
        </div>

        {/* Mini Claptrap */}
        <div className="opacity-60">
          <svg width="50" height="65" viewBox="0 0 80 100">
            <rect x="15" y="30" width="50" height="45" rx="5" fill={BORDERLANDS_COLORS.ink} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
            <rect x="18" y="33" width="20" height="39" rx="3" fill={BORDERLANDS_COLORS.clapTrapYellow} opacity="0.3" />
            <circle cx="40" cy="50" r="14" fill={BORDERLANDS_COLORS.paper} stroke={BORDERLANDS_COLORS.ink} strokeWidth="3" />
            <circle cx="40" cy="50" r="9" fill={BORDERLANDS_COLORS.rare} />
            <circle cx="43" cy="47" r="4" fill="#fff" />
            <rect x="37" y="10" width="6" height="20" fill={BORDERLANDS_COLORS.ink} />
            <circle cx="40" cy="10" r="6" fill={BORDERLANDS_COLORS.clapTrapYellow} stroke={BORDERLANDS_COLORS.ink} strokeWidth="2" />
            <circle cx="40" cy="85" r="13" fill={BORDERLANDS_COLORS.ink} />
            <circle cx="40" cy="85" r="7" fill={BORDERLANDS_COLORS.paper} />
            <rect x="0" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
            <rect x="65" y="40" width="15" height="8" rx="2" fill={BORDERLANDS_COLORS.ink} />
          </svg>
        </div>

        {/* Right action lines */}
        <div className="flex gap-1 items-end opacity-60">
          {[30, 50, 35, 55, 40, 25].map((h, i) => (
            <div
              key={i}
              className="w-1"
              style={{
                height: h,
                background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.clapTrapYellow} 0%, ${BORDERLANDS_COLORS.legendary} 100%)`,
                border: `1px solid ${BORDERLANDS_COLORS.ink}`,
                transform: `rotate(${15 - i * 3}deg)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Small scattered debris */}
      {[
        { left: '20%', top: '20%', rot: 45 },
        { left: '75%', top: '30%', rot: -30 },
        { left: '30%', top: '70%', rot: 60 },
        { left: '80%', top: '65%', rot: -45 },
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 opacity-40"
          style={{
            left: pos.left,
            top: pos.top,
            background: i % 2 === 0 ? BORDERLANDS_COLORS.legendary : BORDERLANDS_COLORS.psychoRed,
            border: `1px solid ${BORDERLANDS_COLORS.ink}`,
            transform: `rotate(${pos.rot}deg)`,
          }}
        />
      ))}
    </div>
  )
}

// Comic panel style container with heavy outlines - Borderlands UI panel
function ComicPanel({
  children,
  rotation = 0,
  accentColor = BORDERLANDS_COLORS.legendary,
  title,
  ariaLabel,
}: {
  children: React.ReactNode
  rotation?: number
  accentColor?: string
  title?: string
  ariaLabel?: string
}) {
  return (
    <section
      className="relative p-6"
      aria-label={ariaLabel || title}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, #ebe5d5 100%)`,
        border: `6px solid ${BORDERLANDS_COLORS.ink}`,
        boxShadow: `8px 8px 0 ${BORDERLANDS_COLORS.ink}, inset 0 0 30px rgba(0,0,0,0.05)`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Heavy corner marks - cel-shaded */}
      <div className="absolute -top-2 -left-2 w-7 h-7" style={{ background: accentColor, border: `3px solid ${BORDERLANDS_COLORS.ink}`, boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}` }} aria-hidden="true" />
      <div className="absolute -bottom-2 -right-2 w-7 h-7" style={{ background: accentColor, border: `3px solid ${BORDERLANDS_COLORS.ink}`, boxShadow: `-2px -2px 0 ${BORDERLANDS_COLORS.ink}` }} aria-hidden="true" />
      <div className="absolute -top-2 -right-2 w-4 h-4" style={{ background: BORDERLANDS_COLORS.ink }} aria-hidden="true" />
      <div className="absolute -bottom-2 -left-2 w-4 h-4" style={{ background: BORDERLANDS_COLORS.ink }} aria-hidden="true" />

      {/* Cel-shading edge highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.05) 100%)`,
        }}
      />

      {/* Title banner - loot rarity style */}
      {title && (
        <div
          className="absolute -top-5 left-1/2 px-6 py-1"
          style={{
            background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
            border: `4px solid ${BORDERLANDS_COLORS.ink}`,
            transform: 'translateX(-50%) rotate(-2deg)',
            boxShadow: `3px 3px 0 ${BORDERLANDS_COLORS.ink}`,
          }}
        >
          <span className="text-sm tracking-wider font-black" style={{ color: BORDERLANDS_COLORS.ink, textShadow: `1px 1px 0 ${accentColor}` }}>
            {title}
          </span>
        </div>
      )}

      {children}
    </section>
  )
}

// Character card with bold outlines - Vault Hunter skill tree selection style. ProfessionSwitch owns
// the order (Musician, System Engineer, Martial Artist), the pick and the keyboard; the card draws.
const HUNTERS: Record<Profession, { icon: string; color: string; actionSkill: string }> = {
  engineer: { icon: '💻', color: BORDERLANDS_COLORS.rare, actionSkill: 'DEPLOY INFRASTRUCTURE' },
  drummer: { icon: '🥁', color: BORDERLANDS_COLORS.legendary, actionSkill: 'RHYTHMIC ASSAULT' },
  fighter: { icon: '🥊', color: BORDERLANDS_COLORS.psychoRed, actionSkill: 'MELEE OVERRIDE' },
}

function VaultHunterCard({ option, reducedMotion = false }: { option: ProfessionOption; reducedMotion?: boolean }) {
  const { id: profession, label, selected: isActive, optionProps } = option
  const hunter = HUNTERS[profession]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative focus:outline-none focus:ring-4 focus:ring-yellow-400 ${reducedMotion ? '' : 'transition-all duration-200'} ${
        isActive ? 'scale-110 z-10' : 'hover:scale-105'
      }`}
      style={{
        transform: isActive ? 'scale(1.1) rotate(-2deg)' : '',
      }}
    >
      <div
        className="p-3 sm:p-6 text-center relative overflow-hidden"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${hunter.color} 0%, ${hunter.color}cc 100%)`
            : `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, #ddd5c5 100%)`,
          border: `6px solid ${BORDERLANDS_COLORS.ink}`,
          boxShadow: isActive
            ? `6px 6px 0 ${BORDERLANDS_COLORS.ink}, 0 0 20px ${hunter.color}60`
            : `5px 5px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {/* Cel-shading highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }}
        />

        <span className="text-3xl sm:text-5xl block mb-2 relative z-10" style={{ filter: `drop-shadow(4px 4px 0 ${BORDERLANDS_COLORS.ink})` }} aria-hidden="true">
          {hunter.icon}
        </span>
        <span
          className="text-sm sm:text-lg font-black tracking-wider block relative z-10 uppercase"
          aria-hidden="true"
          style={{
            color: isActive ? '#fff' : BORDERLANDS_COLORS.ink,
            textShadow: isActive ? `2px 2px 0 ${BORDERLANDS_COLORS.ink}` : 'none',
            WebkitTextStroke: isActive ? `1px ${BORDERLANDS_COLORS.ink}` : 'none',
          }}
        >
          {label}
        </span>

        {/* Action skill indicator */}
        <div
          className="mt-3 px-2 py-1 relative z-10 hidden sm:block"
          aria-hidden="true"
          style={{
            background: isActive ? BORDERLANDS_COLORS.ink : 'transparent',
            border: `2px solid ${isActive ? BORDERLANDS_COLORS.clapTrapYellow : hunter.color}`,
          }}
        >
          <span
            className="text-sm font-black tracking-widest"
            style={{ color: isActive ? BORDERLANDS_COLORS.clapTrapYellow : hunter.color }}
          >
            {hunter.actionSkill}
          </span>
        </div>
      </div>

      {/* Selection burst - SELECTED badge */}
      {isActive && (
        <div className="absolute -top-5 -right-5" aria-hidden="true">
          <svg width="55" height="55" viewBox="0 0 55 55">
            <polygon
              points="27.5,0 33,20 55,20 37,31 44,55 27.5,40 11,55 18,31 0,20 22,20"
              fill={BORDERLANDS_COLORS.clapTrapYellow}
              stroke={BORDERLANDS_COLORS.ink}
              strokeWidth="3"
            />
            <text x="27.5" y="32" textAnchor="middle" fill={BORDERLANDS_COLORS.ink} fontSize="8" fontWeight="900" fontFamily="Bangers, Impact, sans-serif">
              ACTIVE
            </text>
          </svg>
        </div>
      )}
    </button>
  )
}

// Tech tag with comic styling - loot item style
function TechTag({ name, color, reducedMotion = false }: { name: string; color: string; reducedMotion?: boolean }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-sm font-bold cursor-default ${reducedMotion ? '' : 'transition-transform hover:scale-110 hover:rotate-2'}`}
      style={{
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 100%)`,
        color: BORDERLANDS_COLORS.ink,
        border: `2px solid ${BORDERLANDS_COLORS.ink}`,
        boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      {name}
    </span>
  )
}

// Tech stack cloud for engineer (Borderlands weapon manufacturer style)
function TechStackCloud({ categories, reducedMotion = false }: { categories: CVData['techStack']; reducedMotion?: boolean }) {
  const colors = [
    BORDERLANDS_COLORS.legendary,
    BORDERLANDS_COLORS.rare,
    BORDERLANDS_COLORS.psychoRed,
    BORDERLANDS_COLORS.clapTrapYellow,
    BORDERLANDS_COLORS.uncommon,
    BORDERLANDS_COLORS.eridium,
  ]

  return (
    <div className="space-y-5" role="list" aria-label="Technical skills by category">
      {categories.map((category, catIndex) => (
        <div key={category.id} className="mb-3" role="listitem">
          <h3
            className="text-sm tracking-widest mb-2 flex items-center gap-2 font-black"
            style={{ color: colors[catIndex % colors.length] }}
          >
            <span className="text-lg" aria-hidden="true">{category.icon}</span>
            {category.name.toUpperCase()}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} color={colors[catIndex % colors.length]} reducedMotion={reducedMotion} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Experience Card - work history styled as mission briefing / ECHO log. Dates are date only strings
// (UTC midnight), so the year is read in UTC: a January start keeps its own year west of UTC.
function ExperienceCard({ entry, index, reducedMotion = false }: { entry: Job; index: number; reducedMotion?: boolean }) {
  const borderColors = [BORDERLANDS_COLORS.legendary, BORDERLANDS_COLORS.rare, BORDERLANDS_COLORS.psychoRed]
  const color = borderColors[index % 3]
  const startYear = entry.startDate.getUTCFullYear()
  const endYear = entry.endDate ? entry.endDate.getUTCFullYear() : 'ACTIVE'

  return (
    <article
      className={`relative p-4 mb-4 ${reducedMotion ? '' : 'transition-transform hover:scale-[1.01]'}`}
      aria-label={`${entry.title} at ${entry.company}, ${startYear} to ${endYear}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, ${color}08 100%)`,
        border: `5px solid ${BORDERLANDS_COLORS.ink}`,
        boxShadow: `4px 4px 0 ${BORDERLANDS_COLORS.ink}`,
        transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`,
      }}
    >
      {/* Cel-shading edge */}
      <div
        className="absolute top-0 left-0 right-0 h-2 pointer-events-none"
        aria-hidden="true"
        style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)` }}
      />

      {/* Mission date badge */}
      <div
        className="absolute top-0 left-0 px-3 py-1 text-sm font-black tracking-wider"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          color: '#fff',
          border: `3px solid ${BORDERLANDS_COLORS.ink}`,
          transform: 'translate(-8px, -8px) rotate(-3deg)',
          textShadow: `1px 1px 0 ${BORDERLANDS_COLORS.ink}`,
          boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {startYear} - {endYear}
      </div>

      <h3
        className="text-lg font-black mt-5 mb-1"
        style={{
          color: BORDERLANDS_COLORS.ink,
          textShadow: `2px 2px 0 ${color}`,
          WebkitTextStroke: `0.5px ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {entry.title}
      </h3>
      <p className="text-sm font-bold mb-2 text-[#1a1a1a]">{entry.company}</p>

      {entry.description && (
        <p className="text-sm mb-2 font-sans text-[#1a1a1a]">{entry.description}</p>
      )}

      {entry.highlights.length > 0 && (
        <ul className="mt-3 space-y-1.5 font-sans" aria-label="Key accomplishments">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="text-sm flex items-start gap-2 text-[#1a1a1a]">
              <span className="text-[8px] mt-[3px]" style={{ color }} aria-hidden="true">
                ◆
              </span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

type Rarity = 'common' | 'rare' | 'legendary' | 'pearlescent'

const RARITY_LOOK: Record<Rarity, { color: string; label: string; glow: boolean }> = {
  common: { color: BORDERLANDS_COLORS.common, label: 'COMMON', glow: false },
  rare: { color: BORDERLANDS_COLORS.rare, label: 'RARE', glow: false },
  legendary: { color: BORDERLANDS_COLORS.legendary, label: 'LEGENDARY', glow: true },
  pearlescent: { color: BORDERLANDS_COLORS.pearlescent, label: 'PEARLESCENT', glow: true },
}

// The loot rarity is only a colour: the first project glows pearlescent, a featured one legendary.
const rarityFor = (project: Project, index: number): Rarity => {
  if (index === 0) return 'pearlescent'
  if (project.featured) return 'legendary'
  return index < 3 ? 'rare' : 'common'
}

// Loot card for projects - Borderlands weapon card style: his role, the result line and the links
function LootCard({ slot: { project, years, links }, rarity, reducedMotion = false }: { slot: ProjectSlot; rarity: Rarity; reducedMotion?: boolean }) {
  const config = RARITY_LOOK[rarity]

  return (
    <article
      className={`relative h-full p-4 group ${reducedMotion ? '' : 'transition-transform hover:scale-[1.02] hover:rotate-1'}`}
      aria-labelledby={`loot-${project.id}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, ${config.color}10 100%)`,
        border: `5px solid ${config.color}`,
        boxShadow: config.glow
          ? `4px 4px 0 ${BORDERLANDS_COLORS.ink}, 0 0 25px ${config.color}50`
          : `4px 4px 0 ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      {/* Cel-shading highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%)',
        }}
      />

      {/* Rarity banner */}
      <div
        className="absolute -top-3 left-4 px-3 py-0.5 text-sm font-black tracking-wider"
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, ${config.color} 0%, ${config.color}cc 100%)`,
          color: '#fff',
          border: `3px solid ${BORDERLANDS_COLORS.ink}`,
          transform: 'rotate(-2deg)',
          textShadow: `1px 1px 0 ${BORDERLANDS_COLORS.ink}`,
          boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {config.label}
      </div>

      <div className="flex justify-between items-start gap-2 mt-4 mb-1 relative z-10">
        <h3 id={`loot-${project.id}`} className="text-sm font-black" style={{ color: BORDERLANDS_COLORS.ink }}>
          {project.name}
        </h3>
        {years && <span className="text-sm font-bold whitespace-nowrap text-[#444]">{years}</span>}
      </div>
      <p className="text-sm font-bold mb-1 relative z-10 text-[#1a1a1a]">{project.role}</p>
      <p className="text-sm mb-2 relative z-10 font-sans text-[#444]">{project.tagline}</p>

      {/* Impact statement - the key achievement */}
      {project.impact && (
        <p
          className="text-sm mb-2 font-bold relative z-10 px-2 py-1"
          style={{
            color: config.color,
            background: `${BORDERLANDS_COLORS.ink}`,
            border: `1px solid ${config.color}`,
          }}
        >
          +{project.impact}
        </p>
      )}

      {/* Tech as weapon elements */}
      <div className="flex gap-1 flex-wrap relative z-10">
        {project.techStack.slice(0, 4).map((tech, i) => (
          <span
            key={tech}
            className="text-sm px-2 py-0.5 font-bold"
            style={{
              background: i === 0 ? config.color : BORDERLANDS_COLORS.ink,
              color: i === 0 ? BORDERLANDS_COLORS.ink : BORDERLANDS_COLORS.paper,
              border: `1px solid ${BORDERLANDS_COLORS.ink}`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {links.length > 0 ? (
        <div className="flex gap-2 flex-wrap mt-3 relative z-10">
          {links.map(({ kind, label, linkProps }) => (
            <a
              key={kind}
              {...linkProps}
              className={`inline-flex items-center min-h-[44px] px-3 text-sm font-black tracking-wider uppercase bg-white text-[#1a1a1a] border-4 border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 ${reducedMotion ? '' : 'transition-transform hover:-rotate-2'}`}
            >
              {label}
            </a>
          ))}
        </div>
      ) : (
        <p className="text-sm mt-3 italic relative z-10 text-[#444]">No public link</p>
      )}

      {/* Hover action lines - only if not reduced motion */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          aria-hidden="true"
          style={{
            background: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${config.color}15 10px, ${config.color}15 20px)`,
          }}
        />
      )}
    </article>
  )
}

// Company card - Borderlands vendor / weapon manufacturer style
function CompanyCard({ company, reducedMotion = false }: { company: CVData['companies'][number]; reducedMotion?: boolean }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${company.name} - ${company.tagline} (opens in a new tab)`}
      className={`block relative p-4 group ${reducedMotion ? '' : 'transition-all hover:scale-[1.02] hover:-rotate-1'}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.paper} 0%, ${BORDERLANDS_COLORS.clapTrapYellow}10 100%)`,
        border: `5px solid ${BORDERLANDS_COLORS.clapTrapYellow}`,
        boxShadow: `5px 5px 0 ${BORDERLANDS_COLORS.ink}`,
      }}
    >
      {/* Cel-shading highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%)',
        }}
      />

      {/* Marcus-style vendor banner */}
      <div
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1"
        style={{
          background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.clapTrapYellow} 0%, ${BORDERLANDS_COLORS.wastelandYellow} 100%)`,
          border: `3px solid ${BORDERLANDS_COLORS.ink}`,
          boxShadow: `2px 2px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        <span className="text-sm font-black tracking-wider" style={{ color: BORDERLANDS_COLORS.ink }}>
          VENDOR
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2 mt-3 relative z-10">
        <span
          className="text-3xl"
          aria-hidden="true"
          style={{ filter: `drop-shadow(2px 2px 0 ${BORDERLANDS_COLORS.ink})` }}
        >
          {company.icon}
        </span>
        <div>
          <h3 className={`text-sm font-black ${reducedMotion ? '' : 'group-hover:text-[#ff6600] transition-colors'}`} style={{ color: BORDERLANDS_COLORS.ink }}>
            {company.name}
          </h3>
          <p className="text-sm font-bold text-[#1a1a1a]">{company.tagline}</p>
        </div>
      </div>
      <p className="text-sm relative z-10 font-sans text-[#444]">{company.description}</p>

      {/* Services as weapon bonuses */}
      <div className="mt-3 space-y-1 relative z-10">
        {company.services.slice(0, 2).map((service) => (
          <div key={service} className="flex items-center gap-1">
            <span className="text-sm font-black" style={{ color: BORDERLANDS_COLORS.legendary }} aria-hidden="true">+</span>
            <span className="text-sm font-bold" style={{ color: BORDERLANDS_COLORS.ink }}>{service}</span>
          </div>
        ))}
      </div>
    </a>
  )
}

// Band card - Borderlands Echo device / audio log style
function BandCard({ slot: { band, years, linkProps }, reducedMotion = false }: { slot: BandSlot; reducedMotion?: boolean }) {
  const content = (
    <article
      className={`relative h-full p-4 group ${reducedMotion ? '' : 'transition-all hover:scale-[1.02] hover:rotate-1'}`}
      style={{
        background: `linear-gradient(135deg, ${BORDERLANDS_COLORS.ink} 0%, #252535 100%)`,
        border: `5px solid ${BORDERLANDS_COLORS.eridium}`,
        boxShadow: `5px 5px 0 ${BORDERLANDS_COLORS.ink}, 0 0 20px ${BORDERLANDS_COLORS.eridium}40`,
      }}
    >
      {/* Cel-shading edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
        aria-hidden="true"
        style={{ background: `linear-gradient(90deg, ${BORDERLANDS_COLORS.eridium}40 0%, transparent 50%, ${BORDERLANDS_COLORS.eridium}20 100%)` }}
      />

      {/* Echo device top bar */}
      <div className="flex items-center gap-2 mb-3" aria-hidden="true">
        <div
          className={`w-3 h-3 rounded-full ${reducedMotion ? '' : 'animate-pulse'}`}
          style={{ background: BORDERLANDS_COLORS.uncommon, boxShadow: `0 0 10px ${BORDERLANDS_COLORS.uncommon}` }}
        />
        <span className="text-sm tracking-widest font-bold" style={{ color: BORDERLANDS_COLORS.eridium }}>ECHO RECORDING</span>
      </div>

      <h3 className={`text-sm font-black ${reducedMotion ? '' : 'group-hover:text-[#ff6600] transition-colors'}`} style={{ color: BORDERLANDS_COLORS.paper }}>
        {band.name}
      </h3>
      <p className="text-sm mt-1 font-bold text-[#c9a6ff]">
        {band.role}
        {years && <span aria-hidden="true"> | </span>}
        {years}
      </p>
      {band.release && (
        <p className="text-sm mt-2 font-sans text-[#ccc]">
          Released <cite>&ldquo;{band.release}&rdquo;</cite>
        </p>
      )}

      {/* Audio wave decoration */}
      <div className="absolute bottom-2 right-2 flex items-end gap-0.5" aria-hidden="true">
        {[3, 5, 2, 6, 4, 3, 5].map((h, i) => (
          <div
            key={i}
            className={`w-1 ${reducedMotion ? '' : 'animate-pulse'}`}
            style={{
              height: h * 2.5,
              background: BORDERLANDS_COLORS.eridium,
              animationDelay: reducedMotion ? '0s' : `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400">
      {content}
    </a>
  )
}

// Speech bubble for bio - comic book style with heavy cel-shaded outlines
function SpeechBubble({ children, ariaLabel }: { children: React.ReactNode; ariaLabel?: string }) {
  return (
    <div className="relative" role="region" aria-label={ariaLabel || 'About me'}>
      <div
        className="p-6 relative"
        style={{
          background: `linear-gradient(135deg, #fff 0%, ${BORDERLANDS_COLORS.paper} 100%)`,
          border: `5px solid ${BORDERLANDS_COLORS.ink}`,
          borderRadius: '20px',
          boxShadow: `6px 6px 0 ${BORDERLANDS_COLORS.ink}`,
        }}
      >
        {/* Inner cel-shading highlight */}
        <div
          className="absolute top-2 left-2 right-2 h-4 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            borderRadius: '15px 15px 0 0',
          }}
        />
        {children}
      </div>
      {/* Tail - outer border */}
      <div
        className="absolute -bottom-5 left-16 w-0 h-0"
        aria-hidden="true"
        style={{
          borderLeft: '18px solid transparent',
          borderRight: '18px solid transparent',
          borderTop: `24px solid ${BORDERLANDS_COLORS.ink}`,
        }}
      />
      {/* Tail - inner fill */}
      <div
        className="absolute -bottom-2 left-16 w-0 h-0"
        aria-hidden="true"
        style={{
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: `18px solid ${BORDERLANDS_COLORS.paper}`,
          marginLeft: '4px',
        }}
      />
    </div>
  )
}

const HEADING_BANNER = 'text-2xl inline-block px-6 py-2 border-[5px] border-[#1a1a1a] shadow-[5px_5px_0_#1a1a1a]'

const COMIC_BUTTON =
  'inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm tracking-wider font-black border-[5px] border-[#1a1a1a] shadow-[4px_4px_0_#1a1a1a] focus:outline-none focus:ring-4 focus:ring-yellow-400'

// Email is the loud orange action, LinkedIn the white one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], string> = {
  email: 'bg-gradient-to-br from-[#ff9500] to-[#d4763d] text-white [text-shadow:2px_2px_0_#1a1a1a]',
  linkedin: 'bg-white text-[#1a1a1a]',
}

function HeroActions({ actions, reducedMotion }: { actions: HeroActionSlot[]; reducedMotion: boolean }) {
  return (
    <>
      {actions.map((action) => (
        <a
          key={action.id}
          {...action.linkProps}
          className={`${COMIC_BUTTON} ${HERO_ACTION_LOOK[action.id]} ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:-rotate-2'}`}
        >
          {action.label.toUpperCase()}
        </a>
      ))}
    </>
  )
}

type SectionsOf<Id extends Profession> = Extract<ProfessionSections, { profession: Id }>

function EngineerPanels({ sections, reducedMotion }: { sections: SectionsOf<'engineer'>; reducedMotion: boolean }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      {/* 1. About / Bio speech bubble */}
      <section className="mb-8" aria-label="About">
        <SpeechBubble ariaLabel="About me">
          <p className="text-sm leading-relaxed relative z-10 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>
            {professionalSummary.bio}
          </p>
        </SpeechBubble>
      </section>

      {/* ART SECTION 1: Vault symbols with psycho masks */}
      <ArtSectionBreak variant={1} reducedMotion={reducedMotion} />

      {/* 2. Work Experience */}
      {sections.jobs.length > 0 && (
        <section className="mb-8">
          <ComicPanel rotation={0.5} accentColor={BORDERLANDS_COLORS.legendary} title="Work Experience" ariaLabel="Work Experience">
            <div className="mt-4">
              {sections.jobs.map((entry, i) => (
                <ExperienceCard key={entry.id} entry={entry} index={i} reducedMotion={reducedMotion} />
              ))}
            </div>
          </ComicPanel>
        </section>
      )}

      {/* ART SECTION 2: Loot drops with weapons */}
      <ArtSectionBreak variant={2} reducedMotion={reducedMotion} />

      {/* 3. Tech Stack */}
      <section className="mb-8">
        <ComicPanel rotation={-0.5} accentColor={BORDERLANDS_COLORS.rare} title="Tech Stack" ariaLabel="Tech Stack">
          <div className="mt-4">
            <TechStackCloud categories={sections.techStack} reducedMotion={reducedMotion} />
          </div>
        </ComicPanel>
      </section>

      {/* 4. Projects as loot drops */}
      <section className="mb-8" aria-label="Projects">
        <div className="text-center mb-6" style={{ transform: 'rotate(1deg)' }}>
          <h2 className={`${HEADING_BANNER} text-[#1a1a1a] bg-gradient-to-br from-[#ffcc00] to-[#f0c850] [text-shadow:2px_2px_0_#ff9500]`}>
            Featured Work
          </h2>
        </div>
        <ProjectList
          projects={sections.projects}
          className="grid md:grid-cols-2 gap-6"
          renderProject={(slot) => (
            <LootCard
              slot={slot}
              rarity={rarityFor(slot.project, sections.projects.indexOf(slot.project))}
              reducedMotion={reducedMotion}
            />
          )}
        />
      </section>

      {/* ART SECTION 3: Action lines with Claptrap */}
      <ArtSectionBreak variant={3} reducedMotion={reducedMotion} />

      {/* 5. Ventures */}
      <section className="mb-8" aria-label="Ventures">
        <div className="text-center mb-6" style={{ transform: 'rotate(-1deg)' }}>
          <h2 className={`${HEADING_BANNER} text-[#1a1a1a] bg-gradient-to-br from-[#ffcc00] to-[#f0c850]`}>
            VENTURES
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {sections.companies.map((company) => (
            <CompanyCard key={company.id} company={company} reducedMotion={reducedMotion} />
          ))}
        </div>
      </section>
    </>
  )
}

function MusicianPanels({ sections, reducedMotion }: { sections: SectionsOf<'drummer'>; reducedMotion: boolean }) {
  const { musician, bands } = sections

  return (
    <>
      <ArtSectionBreak variant={1} reducedMotion={reducedMotion} />

      <section className="mb-8" aria-label="Bands">
        <div className="text-center mb-6" style={{ transform: 'rotate(1deg)' }}>
          <h2 className={`${HEADING_BANNER} text-[#f5ecd5] bg-gradient-to-br from-[#9966cc] to-[#7744aa]`}>
            BANDS
          </h2>
        </div>
        <p className="text-sm font-bold text-center mb-6 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>
          Drums since {musician.since}, {musician.yearsPlaying} years
        </p>
        <BandList
          bands={bands}
          className="grid md:grid-cols-3 gap-6"
          renderBand={(slot) => <BandCard slot={slot} reducedMotion={reducedMotion} />}
        />
        <p className="text-sm font-bold text-center mt-6 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>
          {musician.line}
        </p>
      </section>

      <ArtSectionBreak variant={3} reducedMotion={reducedMotion} />
    </>
  )
}

function MartialArtistPanels({ sections, reducedMotion }: { sections: SectionsOf<'fighter'>; reducedMotion: boolean }) {
  const { martialArts } = sections

  return (
    <>
      <ArtSectionBreak variant={2} reducedMotion={reducedMotion} />

      <section className="mb-8">
        <ComicPanel rotation={-0.5} accentColor={BORDERLANDS_COLORS.psychoRed} title="Muay Thai" ariaLabel="Muay Thai">
          <h3 className="text-lg font-black mt-4 mb-4" style={{ color: BORDERLANDS_COLORS.ink }}>
            {martialArts.primary.title}
          </h3>
          <MuayThaiRecord
            martialArts={martialArts}
            classNames={{
              facts: 'grid sm:grid-cols-2 gap-3 mb-4 font-sans',
              fact: 'p-3 bg-white border-[3px] border-[#1a1a1a] shadow-[2px_2px_0_#1a1a1a]',
              term: 'text-sm font-black tracking-wider uppercase text-[#1a1a1a]',
              value: 'text-sm mt-1 text-[#1a1a1a]',
              achievements: 'space-y-1.5 font-sans',
              achievement: 'text-sm font-bold flex items-start gap-2 text-[#1a1a1a]',
            }}
            renderAchievement={(achievement) => (
              <>
                <span className="text-[#cc2222]" aria-hidden="true">◆</span>
                {achievement}
              </>
            )}
          />
        </ComicPanel>
      </section>

      <ArtSectionBreak variant={3} reducedMotion={reducedMotion} />
    </>
  )
}

function ProfessionPanels({ sections, reducedMotion }: { sections: ProfessionSections; reducedMotion: boolean }) {
  if (sections.profession === 'drummer') return <MusicianPanels sections={sections} reducedMotion={reducedMotion} />
  if (sections.profession === 'fighter') return <MartialArtistPanels sections={sections} reducedMotion={reducedMotion} />
  return <EngineerPanels sections={sections} reducedMotion={reducedMotion} />
}

export default function CellShadedTheme() {
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null


  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${BORDERLANDS_COLORS.sand} 0%, ${BORDERLANDS_COLORS.paper} 40%, ${BORDERLANDS_COLORS.panderanDust} 100%)`,
        fontFamily: '"Bangers", "Impact", sans-serif',
      }}
    >
      {/* SVG Filter for hand-drawn sketch effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="borderlands-sketch">
            <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
          </filter>
        </defs>
      </svg>

      {/* Background layers */}
      <HalftoneBackground />
      <WastelandTexture />

      {/* Decorative elements - all aria-hidden in their components */}
      <InkSplatter x={5} y={10} size={40} rotation={45} />
      <InkSplatter x={92} y={15} size={25} color={BORDERLANDS_COLORS.legendary} rotation={120} />
      <InkSplatter x={88} y={75} size={35} rotation={200} />
      <InkSplatter x={3} y={60} size={20} color={BORDERLANDS_COLORS.rare} rotation={75} />

      <GunSilhouette x={-2} y={20} rotation={15} />
      <GunSilhouette x={85} y={85} rotation={-25} flip />

      <VaultSymbol x={92} y={40} size={80} />
      <VaultSymbol x={5} y={80} size={60} />

      <ClaptrapSilhouette x={88} y={60} reducedMotion={reducedMotion} />

      {/* Psycho masks in background */}
      <PsychoMask x={2} y={35} size={50} rotation={-10} />
      <PsychoMask x={90} y={75} size={40} rotation={15} />

      {/* Graffiti drips */}
      <GraffitiDrip x={10} y={5} color={BORDERLANDS_COLORS.legendary} height={60} />
      <GraffitiDrip x={85} y={8} color={BORDERLANDS_COLORS.psychoRed} height={45} />
      <GraffitiDrip x={95} y={50} color={BORDERLANDS_COLORS.eridium} height={35} />

      <DamageNumber x={15} y={25} value="9999" color={BORDERLANDS_COLORS.legendary} reducedMotion={reducedMotion} />
      <DamageNumber x={80} y={30} value="CRIT" color={BORDERLANDS_COLORS.psychoRed} reducedMotion={reducedMotion} />
      <DamageNumber x={70} y={70} value="1337" color={BORDERLANDS_COLORS.rare} reducedMotion={reducedMotion} />

      <ExplosionBurst x={8} y={45} text="POW!" />
      <ExplosionBurst x={95} y={20} text="BOOM!" />


      {/* Header - the recruiter first screen */}
      <header className="relative z-30 p-4 sm:p-6" role="banner">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-start gap-4">
              <div className="min-w-0" style={{ transform: 'rotate(-2deg)' }}>
                <h1
                  className="text-3xl sm:text-5xl tracking-wider uppercase"
                  style={{
                    color: BORDERLANDS_COLORS.ink,
                    textShadow: `4px 4px 0 ${BORDERLANDS_COLORS.legendary}, 8px 8px 0 ${BORDERLANDS_COLORS.ink}`,
                    WebkitTextStroke: `1px ${BORDERLANDS_COLORS.ink}`,
                  }}
                >
                  {name}
                </h1>
                <p className="text-base tracking-wide mt-2 font-bold" style={{ color: BORDERLANDS_COLORS.ink }}>
                  {headline}
                </p>
                <q className="block text-sm tracking-wider mt-1 italic font-bold text-[#1a1a1a]">{tagline}</q>
                <p className="text-sm mt-1 font-bold font-sans text-[#1a1a1a]">{line}</p>
              </div>

              <nav className="flex flex-wrap gap-3 items-center" aria-label="Contact and CV">
                <HeroActions actions={actions} reducedMotion={reducedMotion} />
                <Link
                  href="/cv"
                  className={`${COMIC_BUTTON} bg-white text-[#1a1a1a] ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:-rotate-2'}`}
                >
                  Resume
                </Link>
                <Link
                  href="/personal-projects/game-engine"
                  className={`${COMIC_BUTTON} bg-gradient-to-br from-[#ff9500] to-[#d4763d] text-white [text-shadow:2px_2px_0_#1a1a1a] ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:rotate-2'}`}
                >
                  PLAY!
                </Link>
              </nav>
            </div>
          )}
        />
      </header>

      {/* Character selection */}
      <section className="relative z-20 py-8" aria-label="Select profession">
        <div className="text-center mb-4">
          <h2
            className="text-lg tracking-widest"
            style={{
              color: BORDERLANDS_COLORS.ink,
              textShadow: `2px 2px 0 ${BORDERLANDS_COLORS.clapTrapYellow}`,
            }}
          >
            SELECT YOUR VAULT HUNTER
          </h2>
        </div>
        <ProfessionSwitch
          className="flex justify-center gap-3 sm:gap-8 px-4"
          label="Profession selector"
          renderOption={(option) => <VaultHunterCard option={option} reducedMotion={reducedMotion} />}
        />
      </section>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <ProfessionPanels sections={view.sections} reducedMotion={reducedMotion} />
        </div>
      </main>

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-6" aria-label="Contact">
        <div className="max-w-2xl mx-auto text-center">
          <ComicPanel rotation={0} accentColor={BORDERLANDS_COLORS.legendary} title="GET IN TOUCH" ariaLabel="Contact section">
            <RecruiterHero
              render={({ line, actions }) => (
                <div className="py-4 mt-4">
                  <h2
                    className="text-xl font-black mb-3"
                    style={{
                      color: BORDERLANDS_COLORS.ink,
                      textShadow: `2px 2px 0 ${BORDERLANDS_COLORS.legendary}`,
                    }}
                  >
                    READY TO TEAM UP?
                  </h2>
                  <p className="text-sm mb-6 font-sans" style={{ color: BORDERLANDS_COLORS.ink }}>{line}</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <HeroActions actions={actions} reducedMotion={reducedMotion} />
                    <Link
                      href="/cv"
                      className={`${COMIC_BUTTON} bg-white text-[#1a1a1a] ${reducedMotion ? '' : 'transition-all hover:scale-105 hover:-rotate-2'}`}
                    >
                      GET THE CV
                    </Link>
                  </div>
                </div>
              )}
            />
          </ComicPanel>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center" role="contentinfo">
        <div
          className="inline-block px-8 py-3 relative"
          style={{
            background: BORDERLANDS_COLORS.ink,
            border: `4px solid ${BORDERLANDS_COLORS.clapTrapYellow}`,
            boxShadow: `4px 4px 0 ${BORDERLANDS_COLORS.legendary}`,
          }}
        >
          {/* Cel-shading top edge */}
          <div
            className="absolute top-0 left-0 right-0 h-1 pointer-events-none"
            aria-hidden="true"
            style={{ background: `linear-gradient(90deg, ${BORDERLANDS_COLORS.clapTrapYellow}40 0%, transparent 50%)` }}
          />

          <p
            className="text-sm tracking-widest font-black"
            style={{ color: BORDERLANDS_COLORS.clapTrapYellow }}
          >
            CATCH-A-RIIIIDE!
          </p>
          <p className="text-xs mt-1" style={{ color: BORDERLANDS_COLORS.paper }}>
            PANDORA | 2026
          </p>
        </div>
      </footer>

      {/* Animations - respects prefers-reduced-motion via the reducedMotion variable */}
      <style jsx global>{`
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          25% { opacity: 0.9; transform: translateY(-8px) scale(1.1); }
          50% { opacity: 0.7; transform: translateY(-15px) scale(1); }
          75% { opacity: 0.4; transform: translateY(-20px) scale(0.9); }
          100% { opacity: 0; transform: translateY(-25px) scale(0.8); }
        }
        .animate-damage-float {
          animation: damage-float 4s ease-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-damage-float {
            animation: none;
          }
          .animate-pulse {
            animation: none;
          }
        }

        /* Borderlands-style focus indicator */
        *:focus-visible {
          outline: 4px solid ${BORDERLANDS_COLORS.clapTrapYellow};
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}
