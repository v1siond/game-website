'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProfession } from '@/contexts/ProfessionContext'
import { ProfessionSwitch, type ProfessionOption } from '@/components/cv/ProfessionSwitch'
import { useCVData, useWorldView } from '@/components/cv/CVDataProvider'
import { RecruiterHero, type HeroActionSlot } from '@/components/cv/RecruiterHero'
import { ProjectList, type ProjectSlot } from '@/components/cv/ProjectList'
import { BandList, type BandSlot } from '@/components/cv/BandList'
import { MuayThaiRecord } from '@/components/cv/MuayThaiRecord'
import type { Profession } from '@/lib/cv/professions'
import type { CVData, Job } from '@/lib/cv/content'
import type { SectionsOf } from '@/lib/cv/cvView'
import { ProfessionSectionsView, type ProfessionSectionViews } from '@/components/cv/ProfessionSectionsView'

// =============================================================================
// SUPER MARIO BROS (NES) THEMED CV
// Classic 2D platformer aesthetic with authentic color palette
//
// COLOR PALETTE:
// Sky Blue: #5C94FC, #92CCFF
// Ground Brown: #D87B17, #8B4513, #5C3317
// Brick Red: #AD6B2F, #7B3B0A
// Pipe Green: #5C9E31, #3E6B1F, #1E4B0F
// Question Block Yellow: #FFD700, #F5A623, #E5941B
// Mario Red: #E52521, #C41E3A
// Luigi Green: #43B047
// Coin Gold: #FFD700, #FFC107
// Cloud White: #FFFFFF, #E8E8E8
// Bush Green: #228B22, #32CD32
// Flag Pole Grey: #808080, #A0A0A0
//
// ALL CONTENT IMMEDIATELY VISIBLE - NO HIDING ANIMATIONS
// =============================================================================

// === MARIO COLORS ===
const MARIO_COLORS = {
  skyBlue: '#5C94FC',
  skyLight: '#92CCFF',
  groundBrown: '#D87B17',
  groundDark: '#8B4513',
  groundDarkest: '#5C3317',
  brickRed: '#AD6B2F',
  brickDark: '#7B3B0A',
  pipeGreen: '#5C9E31',
  pipeMid: '#3E6B1F',
  pipeDark: '#1E4B0F',
  questionYellow: '#FFD700',
  questionOrange: '#F5A623',
  questionDark: '#E5941B',
  marioRed: '#E52521',
  marioDarkRed: '#C41E3A',
  luigiGreen: '#43B047',
  coinGold: '#FFD700',
  coinOrange: '#FFC107',
  cloudWhite: '#FFFFFF',
  cloudGrey: '#E8E8E8',
  bushGreen: '#228B22',
  bushLight: '#32CD32',
  flagGrey: '#808080',
  flagLight: '#A0A0A0',
  undergroundBlue: '#000080',
  undergroundBlack: '#0A0A20',
  castleGrey: '#707070',
  castleDark: '#404040',
}

// === QUESTION BLOCK - Iconic "?" Block with bounce animation ===
function QuestionBlock({ size = 48, hit = false }: { size?: number; hit?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label={hit ? "Empty Block" : "Question Block"}
      role="img"
      className={hit ? '' : 'question-bounce'}
    >
      <defs>
        <linearGradient id="questionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={MARIO_COLORS.questionYellow} />
          <stop offset="50%" stopColor={MARIO_COLORS.questionOrange} />
          <stop offset="100%" stopColor={MARIO_COLORS.questionDark} />
        </linearGradient>
      </defs>
      {/* Block body */}
      <rect x="2" y="2" width="44" height="44" rx="2" fill={hit ? MARIO_COLORS.brickDark : 'url(#questionGrad)'} stroke={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} strokeWidth="3" />
      {/* 3D edge - top/left highlight */}
      <path d="M4,4 L44,4 L44,6 L6,6 L6,44 L4,44 Z" fill={hit ? MARIO_COLORS.brickRed : '#FFEC80'} opacity="0.6" />
      {/* 3D edge - bottom/right shadow */}
      <path d="M44,6 L44,44 L42,44 L42,6 Z" fill="#000" opacity="0.3" />
      <path d="M6,44 L44,44 L44,42 L6,42 Z" fill="#000" opacity="0.3" />
      {/* Corner rivets */}
      <circle cx="10" cy="10" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      <circle cx="38" cy="10" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      <circle cx="10" cy="38" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      <circle cx="38" cy="38" r="3" fill={hit ? MARIO_COLORS.groundDarkest : MARIO_COLORS.groundBrown} />
      {/* Question mark or empty */}
      {!hit ? (
        <>
          <text x="24" y="32" textAnchor="middle" fontSize="22" fontWeight="bold" fill={MARIO_COLORS.groundBrown} fontFamily="Arial Black, sans-serif">?</text>
          <text x="24" y="31" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#FFF" fontFamily="Arial Black, sans-serif">?</text>
        </>
      ) : (
        <rect x="18" y="20" width="12" height="8" fill={MARIO_COLORS.groundDarkest} opacity="0.5" />
      )}
    </svg>
  )
}

// === BRICK BLOCK - Breakable brick pattern ===
function BrickBlock({ size = 48 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Brick Block"
      role="img"
    >
      <rect width="48" height="48" fill={MARIO_COLORS.brickRed} />
      {/* Brick pattern - mortar lines */}
      <rect x="0" y="0" width="22" height="14" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="24" y="0" width="24" height="14" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="0" y="16" width="48" height="14" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="0" y="32" width="22" height="16" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      <rect x="24" y="32" width="24" height="16" fill={MARIO_COLORS.brickRed} stroke={MARIO_COLORS.brickDark} strokeWidth="2" />
      {/* Highlight on bricks */}
      <rect x="2" y="2" width="18" height="3" fill="#D08040" opacity="0.5" />
      <rect x="26" y="2" width="20" height="3" fill="#D08040" opacity="0.5" />
      <rect x="2" y="18" width="44" height="3" fill="#D08040" opacity="0.5" />
      <rect x="2" y="34" width="18" height="3" fill="#D08040" opacity="0.5" />
      <rect x="26" y="34" width="20" height="3" fill="#D08040" opacity="0.5" />
    </svg>
  )
}

// === GREEN PIPE - Classic warp pipe with rim ===
function GreenPipe({ height = 80, width = 64 }: { height?: number; width?: number }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 64 ${height}`}
      aria-label="Warp Pipe"
      role="img"
    >
      <defs>
        <linearGradient id="pipeBodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MARIO_COLORS.pipeDark} />
          <stop offset="20%" stopColor={MARIO_COLORS.pipeMid} />
          <stop offset="50%" stopColor={MARIO_COLORS.pipeGreen} />
          <stop offset="80%" stopColor={MARIO_COLORS.pipeMid} />
          <stop offset="100%" stopColor={MARIO_COLORS.pipeDark} />
        </linearGradient>
        <linearGradient id="pipeLipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={MARIO_COLORS.pipeDark} />
          <stop offset="15%" stopColor={MARIO_COLORS.pipeGreen} />
          <stop offset="50%" stopColor="#7BC847" />
          <stop offset="85%" stopColor={MARIO_COLORS.pipeGreen} />
          <stop offset="100%" stopColor={MARIO_COLORS.pipeDark} />
        </linearGradient>
      </defs>
      {/* Pipe body */}
      <rect x="8" y="20" width="48" height={height - 20} fill="url(#pipeBodyGrad)" />
      {/* Pipe rim/lip */}
      <rect x="0" y="0" width="64" height="24" rx="2" fill="url(#pipeLipGrad)" />
      {/* Rim top highlight */}
      <rect x="4" y="2" width="56" height="4" rx="1" fill="#8FD860" opacity="0.6" />
      {/* Inner darkness */}
      <ellipse cx="32" cy="10" rx="20" ry="6" fill={MARIO_COLORS.pipeDark} />
      {/* Body vertical lines */}
      <line x1="20" y1="24" x2="20" y2={height} stroke={MARIO_COLORS.pipeDark} strokeWidth="1" opacity="0.3" />
      <line x1="44" y1="24" x2="44" y2={height} stroke={MARIO_COLORS.pipeDark} strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

// === SPINNING COIN - Golden coin with spin animation ===
function Coin({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-label="Gold Coin"
      role="img"
      className="coin-spin"
    >
      <defs>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEC80" />
          <stop offset="30%" stopColor={MARIO_COLORS.coinGold} />
          <stop offset="70%" stopColor={MARIO_COLORS.coinOrange} />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
      </defs>
      <ellipse cx="12" cy="12" rx="10" ry="10" fill="url(#coinGrad)" stroke="#CC9900" strokeWidth="1.5" />
      {/* Inner circle */}
      <ellipse cx="12" cy="12" rx="7" ry="7" fill="none" stroke="#CC9900" strokeWidth="1" opacity="0.5" />
      {/* Shine */}
      <ellipse cx="8" cy="8" rx="3" ry="4" fill="#FFF" opacity="0.5" transform="rotate(-30 8 8)" />
    </svg>
  )
}

// === MARIO SILHOUETTE - Iconic cap and mustache ===
function MarioSilhouette({ size = 60, color = MARIO_COLORS.marioRed }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      aria-label="Mario"
      role="img"
    >
      {/* Cap */}
      <ellipse cx="30" cy="18" rx="22" ry="12" fill={color} />
      <rect x="8" y="14" width="44" height="8" fill={color} />
      {/* Cap bill */}
      <ellipse cx="42" cy="22" rx="12" ry="4" fill={color} />
      {/* Face circle */}
      <circle cx="30" cy="35" r="16" fill="#FFD8B0" />
      {/* Mustache */}
      <path d="M18,38 Q22,42 30,40 Q38,42 42,38 Q40,46 30,44 Q20,46 18,38" fill="#3D2314" />
      {/* Nose */}
      <ellipse cx="30" cy="36" rx="6" ry="5" fill="#FFD8B0" stroke="#E8C090" strokeWidth="1" />
      {/* Eyes */}
      <ellipse cx="24" cy="32" rx="3" ry="4" fill="#000" />
      <ellipse cx="36" cy="32" rx="3" ry="4" fill="#000" />
      <circle cx="23" cy="31" r="1" fill="#FFF" />
      <circle cx="35" cy="31" r="1" fill="#FFF" />
      {/* Cap "M" emblem */}
      <circle cx="30" cy="12" r="6" fill="#FFF" />
      <text x="30" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill={color} fontFamily="Arial Black">M</text>
    </svg>
  )
}

// === SUPER MUSHROOM - Red cap with white dots ===
function SuperMushroom({ size = 40, is1UP = false }: { size?: number; is1UP?: boolean }) {
  const capColor = is1UP ? MARIO_COLORS.luigiGreen : MARIO_COLORS.marioRed
  const capDark = is1UP ? MARIO_COLORS.pipeMid : MARIO_COLORS.marioDarkRed

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-label={is1UP ? "1-UP Mushroom" : "Super Mushroom"}
      role="img"
    >
      {/* Cap */}
      <ellipse cx="20" cy="14" rx="18" ry="12" fill={capColor} stroke={capDark} strokeWidth="2" />
      {/* White spots */}
      <ellipse cx="10" cy="10" rx="5" ry="4" fill="#FFF" />
      <ellipse cx="28" cy="12" rx="4" ry="3" fill="#FFF" />
      <ellipse cx="20" cy="6" rx="3" ry="2" fill="#FFF" />
      {/* Stem */}
      <path d="M10,16 Q8,28 12,36 L28,36 Q32,28 30,16" fill="#F5E6C8" stroke="#D4C4A8" strokeWidth="1" />
      {/* Face */}
      <ellipse cx="15" cy="26" rx="2.5" ry="3.5" fill="#000" />
      <ellipse cx="25" cy="26" rx="2.5" ry="3.5" fill="#000" />
      <circle cx="14" cy="25" r="1" fill="#FFF" />
      <circle cx="24" cy="25" r="1" fill="#FFF" />
    </svg>
  )
}

// === FIRE FLOWER - White and red flower ===
function FireFlower({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-label="Fire Flower"
      role="img"
    >
      {/* Stem */}
      <rect x="18" y="22" width="4" height="16" fill={MARIO_COLORS.pipeGreen} />
      {/* Leaves */}
      <ellipse cx="12" cy="32" rx="6" ry="3" fill={MARIO_COLORS.pipeGreen} transform="rotate(-20 12 32)" />
      <ellipse cx="28" cy="32" rx="6" ry="3" fill={MARIO_COLORS.pipeGreen} transform="rotate(20 28 32)" />
      {/* Petals - orange/red */}
      <circle cx="20" cy="8" r="6" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="10" cy="14" r="6" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="30" cy="14" r="6" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="12" cy="22" r="5" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      <circle cx="28" cy="22" r="5" fill={MARIO_COLORS.questionOrange} stroke={MARIO_COLORS.marioRed} strokeWidth="1" />
      {/* Center - white face */}
      <circle cx="20" cy="15" r="6" fill="#FFF" stroke="#DDD" strokeWidth="1" />
      <ellipse cx="18" cy="14" rx="1.5" ry="2" fill="#000" />
      <ellipse cx="22" cy="14" rx="1.5" ry="2" fill="#000" />
    </svg>
  )
}

// === STARMAN - Five-pointed star with eyes ===
function Starman({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      aria-label="Starman"
      role="img"
      className="starman-flash"
    >
      <defs>
        <linearGradient id="starmanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFF80" />
          <stop offset="50%" stopColor={MARIO_COLORS.coinGold} />
          <stop offset="100%" stopColor="#CC9900" />
        </linearGradient>
      </defs>
      {/* Five-pointed star */}
      <polygon
        points="22,2 27,16 42,16 30,26 35,40 22,32 9,40 14,26 2,16 17,16"
        fill="url(#starmanGrad)"
        stroke="#CC9900"
        strokeWidth="2"
      />
      {/* Eyes */}
      <ellipse cx="17" cy="20" rx="3" ry="4" fill="#000" />
      <ellipse cx="27" cy="20" rx="3" ry="4" fill="#000" />
      <circle cx="16" cy="19" r="1" fill="#FFF" />
      <circle cx="26" cy="19" r="1" fill="#FFF" />
      {/* Smile */}
      <path d="M17,26 Q22,30 27,26" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// === FLAG POLE with Flag ===
function FlagPole({ height = 160 }: { height?: number }) {
  return (
    <svg
      width={40}
      height={height}
      viewBox={`0 0 40 ${height}`}
      aria-label="Goal Flag Pole"
      role="img"
    >
      {/* Pole */}
      <rect x="18" y="0" width="4" height={height} fill={MARIO_COLORS.flagGrey} />
      <rect x="19" y="0" width="1" height={height} fill={MARIO_COLORS.flagLight} />
      {/* Top ball */}
      <circle cx="20" cy="6" r="6" fill={MARIO_COLORS.coinGold} stroke="#CC9900" strokeWidth="1" />
      {/* Flag */}
      <polygon
        points={`22,10 40,18 40,34 22,26`}
        fill={MARIO_COLORS.pipeGreen}
        stroke={MARIO_COLORS.pipeDark}
        strokeWidth="1"
      />
      {/* Base */}
      <rect x="10" y={height - 16} width="20" height="16" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="2" />
    </svg>
  )
}

// === CLOUD (same shape as bush, different colors) ===
function MarioCloud({ width = 120 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 120 60"
      aria-label="Cloud"
      role="img"
      className="cloud-float"
    >
      <defs>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={MARIO_COLORS.cloudWhite} />
          <stop offset="100%" stopColor={MARIO_COLORS.cloudGrey} />
        </linearGradient>
      </defs>
      {/* Triple-bump shape */}
      <ellipse cx="60" cy="40" rx="55" ry="18" fill="url(#cloudGrad)" />
      <ellipse cx="35" cy="30" rx="30" ry="22" fill="url(#cloudGrad)" />
      <ellipse cx="85" cy="30" rx="30" ry="22" fill="url(#cloudGrad)" />
      <ellipse cx="60" cy="22" rx="25" ry="18" fill={MARIO_COLORS.cloudWhite} />
      {/* Eyes and smile (clouds have faces in Mario!) */}
      <ellipse cx="45" cy="32" rx="4" ry="5" fill="#000" />
      <ellipse cx="75" cy="32" rx="4" ry="5" fill="#000" />
      <circle cx="43" cy="30" r="1.5" fill="#FFF" />
      <circle cx="73" cy="30" r="1.5" fill="#FFF" />
      <path d="M50,42 Q60,48 70,42" fill="none" stroke="#AAA" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// === BUSH (same shape as cloud, green colors) ===
function MarioBush({ width = 100 }: { width?: number }) {
  return (
    <svg
      width={width}
      height={width * 0.5}
      viewBox="0 0 100 50"
      aria-label="Bush"
      role="img"
    >
      <defs>
        <linearGradient id="bushGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={MARIO_COLORS.bushLight} />
          <stop offset="100%" stopColor={MARIO_COLORS.bushGreen} />
        </linearGradient>
      </defs>
      {/* Triple-bump shape */}
      <ellipse cx="50" cy="38" rx="48" ry="12" fill="url(#bushGrad)" />
      <ellipse cx="28" cy="28" rx="26" ry="20" fill="url(#bushGrad)" />
      <ellipse cx="72" cy="28" rx="26" ry="20" fill="url(#bushGrad)" />
      <ellipse cx="50" cy="20" rx="22" ry="16" fill={MARIO_COLORS.bushLight} />
    </svg>
  )
}

// === GROUND/FLOOR PATTERN ===
function GroundPattern() {
  return (
    <svg className="w-full h-20" viewBox="0 0 800 80" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="groundBricks" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
          <rect width="32" height="16" fill={MARIO_COLORS.groundBrown} />
          <rect x="0" y="0" width="15" height="7" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="16" y="0" width="16" height="7" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="8" y="8" width="16" height="8" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="0" y="8" width="8" height="8" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
          <rect x="24" y="8" width="8" height="8" fill={MARIO_COLORS.groundBrown} stroke={MARIO_COLORS.groundDark} strokeWidth="1" />
        </pattern>
      </defs>
      {/* Top grass strip */}
      <rect x="0" y="0" width="800" height="8" fill={MARIO_COLORS.pipeGreen} />
      {/* Ground bricks */}
      <rect x="0" y="8" width="800" height="72" fill="url(#groundBricks)" />
    </svg>
  )
}

// =============================================================================
// DECORATIVE ART SECTIONS
// =============================================================================

// === ART SECTION 1: Mushroom Kingdom Scene (after About) ===
function MushroomKingdomScene() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: MARIO_COLORS.skyBlue }}>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARIO_COLORS.skyLight} 0%, ${MARIO_COLORS.skyBlue} 100%)` }} />

      {/* Clouds */}
      <div className="absolute top-4 left-[5%]"><MarioCloud width={100} /></div>
      <div className="absolute top-8 left-[40%]"><MarioCloud width={140} /></div>
      <div className="absolute top-2 right-[10%]"><MarioCloud width={90} /></div>

      {/* Hills in background */}
      <svg className="absolute bottom-20 left-0 w-full" height="60" viewBox="0 0 800 60" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx="150" cy="60" rx="120" ry="50" fill={MARIO_COLORS.bushGreen} />
        <ellipse cx="500" cy="60" rx="180" ry="60" fill={MARIO_COLORS.bushGreen} />
        <ellipse cx="720" cy="60" rx="100" ry="40" fill={MARIO_COLORS.bushGreen} />
      </svg>

      {/* Scene elements */}
      <div className="relative z-10 max-w-4xl mx-auto flex items-end justify-between px-4" style={{ height: '200px' }}>
        {/* Left: Question blocks and coins */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <Coin size={20} />
            <Coin size={20} />
            <Coin size={20} />
          </div>
          <div className="flex gap-1">
            <QuestionBlock size={40} />
            <BrickBlock size={40} />
            <QuestionBlock size={40} />
          </div>
        </div>

        {/* Center: Pipe with Piranha Plant silhouette */}
        <div className="flex flex-col items-center">
          {/* Piranha plant peeking */}
          <svg width="40" height="30" viewBox="0 0 40 30" aria-hidden="true">
            <ellipse cx="20" cy="25" rx="18" ry="12" fill={MARIO_COLORS.marioRed} />
            <ellipse cx="20" cy="15" rx="14" ry="10" fill={MARIO_COLORS.marioRed} />
            {/* White dots */}
            <circle cx="10" cy="20" r="4" fill="#FFF" />
            <circle cx="30" cy="20" r="4" fill="#FFF" />
            <circle cx="20" cy="12" r="3" fill="#FFF" />
            {/* Stem hint */}
            <rect x="16" y="26" width="8" height="4" fill={MARIO_COLORS.pipeGreen} />
          </svg>
          <GreenPipe height={100} width={64} />
        </div>

        {/* Right: Starman and mushroom */}
        <div className="flex items-end gap-4">
          <Starman size={40} />
          <SuperMushroom size={36} />
          <SuperMushroom size={36} is1UP />
          <FireFlower size={36} />
        </div>
      </div>

      {/* Bushes */}
      <div className="absolute bottom-20 left-[8%]"><MarioBush width={80} /></div>
      <div className="absolute bottom-20 right-[15%]"><MarioBush width={100} /></div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0">
        <GroundPattern />
      </div>
    </div>
  )
}

// === ART SECTION 2: Underground Level (after Experience) ===
function UndergroundScene() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: MARIO_COLORS.undergroundBlack }}>
      {/* Dark underground gradient */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARIO_COLORS.undergroundBlack} 0%, ${MARIO_COLORS.undergroundBlue} 50%, ${MARIO_COLORS.undergroundBlack} 100%)` }} />

      {/* Brick ceiling */}
      <svg className="absolute top-0 left-0 w-full" height="48" viewBox="0 0 800 48" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="ceilingBricks" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
            <rect width="48" height="24" fill={MARIO_COLORS.undergroundBlue} />
            <rect x="0" y="0" width="22" height="10" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="24" y="0" width="24" height="10" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="12" y="12" width="24" height="12" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="0" y="12" width="12" height="12" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
            <rect x="36" y="12" width="12" height="12" fill="#2A2A6A" stroke="#1A1A4A" strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="800" height="48" fill="url(#ceilingBricks)" />
      </svg>

      {/* Scene elements */}
      <div className="relative z-10 max-w-4xl mx-auto flex items-end justify-between px-4" style={{ height: '180px' }}>
        {/* Left: Pipes */}
        <div className="flex items-end gap-8">
          <GreenPipe height={120} width={56} />
          <GreenPipe height={80} width={56} />
        </div>

        {/* Center: Block formation with coins */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <Coin size={18} />
            <Coin size={18} />
            <Coin size={18} />
            <Coin size={18} />
            <Coin size={18} />
          </div>
          <div className="flex">
            <BrickBlock size={36} />
            <QuestionBlock size={36} />
            <BrickBlock size={36} />
            <BrickBlock size={36} />
            <QuestionBlock size={36} />
            <BrickBlock size={36} />
          </div>
        </div>

        {/* Right: Pipe with piranha silhouette */}
        <div className="flex items-end gap-4">
          <div className="relative">
            {/* Piranha shadow */}
            <svg className="absolute -top-8 left-1/2 -translate-x-1/2" width="50" height="40" viewBox="0 0 50 40" opacity="0.8" aria-hidden="true">
              <path d="M10,40 L10,30 Q25,20 40,30 L40,40 Z" fill={MARIO_COLORS.pipeGreen} />
              <ellipse cx="25" cy="15" rx="20" ry="15" fill={MARIO_COLORS.marioRed} />
              <circle cx="15" cy="12" r="4" fill="#FFF" />
              <circle cx="35" cy="12" r="4" fill="#FFF" />
            </svg>
            <GreenPipe height={100} width={64} />
          </div>
        </div>
      </div>

      {/* Underground floor */}
      <svg className="absolute bottom-0 left-0 w-full" height="32" viewBox="0 0 800 32" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="undergroundFloor" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
            <rect width="32" height="16" fill="#2A2A6A" />
            <rect x="0" y="0" width="15" height="7" stroke="#1A1A4A" strokeWidth="1" fill="none" />
            <rect x="16" y="0" width="16" height="7" stroke="#1A1A4A" strokeWidth="1" fill="none" />
            <rect x="8" y="8" width="16" height="8" stroke="#1A1A4A" strokeWidth="1" fill="none" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="800" height="32" fill="url(#undergroundFloor)" />
      </svg>
    </div>
  )
}

// === ART SECTION 3: Castle/Flag Pole Victory Scene (after Projects) ===
function CastleVictoryScene() {
  return (
    <div className="relative w-full py-12 overflow-hidden" style={{ background: MARIO_COLORS.skyBlue }}>
      {/* Sky */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${MARIO_COLORS.skyLight} 0%, ${MARIO_COLORS.skyBlue} 60%, #FFB347 100%)` }} />

      {/* Clouds */}
      <div className="absolute top-6 left-[20%]"><MarioCloud width={80} /></div>
      <div className="absolute top-4 right-[25%]"><MarioCloud width={100} /></div>

      {/* Castle */}
      <svg className="absolute bottom-20 right-[15%]" width="200" height="160" viewBox="0 0 200 160" aria-label="Castle" role="img">
        <defs>
          <pattern id="castleBricks" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <rect width="20" height="10" fill={MARIO_COLORS.castleGrey} />
            <rect x="0" y="0" width="9" height="4" stroke={MARIO_COLORS.castleDark} strokeWidth="0.5" fill="none" />
            <rect x="10" y="0" width="10" height="4" stroke={MARIO_COLORS.castleDark} strokeWidth="0.5" fill="none" />
            <rect x="5" y="5" width="10" height="5" stroke={MARIO_COLORS.castleDark} strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        {/* Main castle body */}
        <rect x="20" y="60" width="160" height="100" fill="url(#castleBricks)" />
        {/* Towers */}
        <rect x="10" y="40" width="30" height="120" fill="url(#castleBricks)" />
        <rect x="160" y="40" width="30" height="120" fill="url(#castleBricks)" />
        {/* Tower tops (crenellations) */}
        <rect x="10" y="30" width="10" height="15" fill="url(#castleBricks)" />
        <rect x="30" y="30" width="10" height="15" fill="url(#castleBricks)" />
        <rect x="160" y="30" width="10" height="15" fill="url(#castleBricks)" />
        <rect x="180" y="30" width="10" height="15" fill="url(#castleBricks)" />
        {/* Center tower */}
        <rect x="70" y="20" width="60" height="80" fill="url(#castleBricks)" />
        <rect x="70" y="8" width="20" height="18" fill="url(#castleBricks)" />
        <rect x="110" y="8" width="20" height="18" fill="url(#castleBricks)" />
        {/* Door */}
        <rect x="80" y="100" width="40" height="60" fill="#1A1A1A" rx="20" />
        {/* Windows */}
        <rect x="85" y="50" width="12" height="16" fill="#1A1A1A" />
        <rect x="103" y="50" width="12" height="16" fill="#1A1A1A" />
        {/* Flag on castle */}
        <line x1="100" y1="8" x2="100" y2="-15" stroke={MARIO_COLORS.flagGrey} strokeWidth="2" />
        <polygon points="100,-15 120,-10 100,0" fill={MARIO_COLORS.marioRed} />
      </svg>

      {/* Flag pole */}
      <div className="absolute bottom-20 left-[20%]">
        <FlagPole height={140} />
      </div>

      {/* Victory coins and stars */}
      <div className="absolute bottom-32 left-[35%] flex gap-4 items-center">
        <Coin size={28} />
        <Starman size={48} />
        <Coin size={28} />
      </div>

      {/* Mario reaching flag */}
      <div className="absolute bottom-24 left-[18%]">
        <MarioSilhouette size={50} />
      </div>

      {/* Bushes */}
      <div className="absolute bottom-20 left-[5%]"><MarioBush width={70} /></div>
      <div className="absolute bottom-20 left-[45%]"><MarioBush width={90} /></div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0">
        <GroundPattern />
      </div>
    </div>
  )
}

// =============================================================================
// SECTION CARD STYLES
// =============================================================================

// Question Block Panel Style
function QuestionBlockPanel({ children, title, icon }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner question blocks */}
      <div className="absolute -top-4 -left-4 z-10" aria-hidden="true"><QuestionBlock size={32} /></div>
      <div className="absolute -top-4 -right-4 z-10" aria-hidden="true"><QuestionBlock size={32} /></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, transparent, ${MARIO_COLORS.questionYellow}80, ${MARIO_COLORS.questionYellow})` }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`,
            border: `3px solid ${MARIO_COLORS.questionYellow}`,
            borderRadius: '4px',
            boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionYellow}80, transparent)` }} aria-hidden="true" />
      </div>

      {/* Content with brick texture */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #FFF9E6 0%, #FFF3CC 100%)`,
          border: `4px solid ${MARIO_COLORS.groundBrown}`,
          borderRadius: '4px',
          boxShadow: `inset 0 2px 0 #FFECB3, 0 4px 0 ${MARIO_COLORS.groundDarkest}`,
        }}
      >
        {/* Subtle brick texture overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5" aria-hidden="true">
          <defs>
            <pattern id="subtleBrick" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="28" height="13" stroke={MARIO_COLORS.brickDark} strokeWidth="0.5" fill="none" />
              <rect x="30" y="0" width="30" height="13" stroke={MARIO_COLORS.brickDark} strokeWidth="0.5" fill="none" />
              <rect x="15" y="15" width="30" height="15" stroke={MARIO_COLORS.brickDark} strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#subtleBrick)" />
        </svg>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// Underground/Castle variant panel
function UndergroundPanel({ children, title, icon }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner coins */}
      <div className="absolute -top-3 -left-3 z-10" aria-hidden="true"><Coin size={24} /></div>
      <div className="absolute -top-3 -right-3 z-10" aria-hidden="true"><Coin size={24} /></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, transparent, ${MARIO_COLORS.coinGold}60, ${MARIO_COLORS.coinGold})` }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
            border: `3px solid ${MARIO_COLORS.coinGold}`,
            borderRadius: '4px',
            boxShadow: `0 4px 0 ${MARIO_COLORS.pipeDark}`,
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, ${MARIO_COLORS.coinGold}, ${MARIO_COLORS.coinGold}60, transparent)` }} aria-hidden="true" />
      </div>

      {/* Dark content area */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${MARIO_COLORS.undergroundBlue} 0%, ${MARIO_COLORS.undergroundBlack} 100%)`,
          border: `4px solid #3A3A8A`,
          borderRadius: '4px',
          boxShadow: `inset 0 2px 0 #4A4A9A, 0 4px 0 #0A0A20`,
        }}
      >
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// Castle variant panel
function CastlePanel({ children, title, icon }: {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
}) {
  return (
    <div className="relative" role="region" aria-label={title}>
      {/* Corner stars */}
      <div className="absolute -top-4 -left-4 z-10" aria-hidden="true"><Starman size={32} /></div>
      <div className="absolute -top-4 -right-4 z-10" aria-hidden="true"><Starman size={32} /></div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, transparent, ${MARIO_COLORS.flagLight}80, ${MARIO_COLORS.flagLight})` }} aria-hidden="true" />
        <div
          className="flex items-center gap-2 px-5 py-2"
          style={{
            background: `linear-gradient(180deg, ${MARIO_COLORS.castleGrey}, ${MARIO_COLORS.castleDark})`,
            border: `3px solid ${MARIO_COLORS.flagLight}`,
            borderRadius: '4px',
            boxShadow: `0 4px 0 #2A2A2A`,
          }}
        >
          {icon}
          <h2 className="text-sm tracking-[0.15em] uppercase font-bold text-white" style={{ textShadow: '2px 2px 0 #000', fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{title}</h2>
        </div>
        <div className="flex-1 h-1" style={{ background: `linear-gradient(90deg, ${MARIO_COLORS.flagLight}, ${MARIO_COLORS.flagLight}80, transparent)` }} aria-hidden="true" />
      </div>

      {/* Stone content area */}
      <div
        className="p-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${MARIO_COLORS.castleGrey} 0%, ${MARIO_COLORS.castleDark} 100%)`,
          border: `4px solid #5A5A5A`,
          borderRadius: '4px',
          boxShadow: `inset 0 2px 0 #8A8A8A, 0 4px 0 #2A2A2A`,
        }}
      >
        {/* Castle brick texture */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" aria-hidden="true">
          <defs>
            <pattern id="castleBrickBg" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="18" height="9" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
              <rect x="20" y="0" width="20" height="9" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
              <rect x="10" y="10" width="20" height="10" stroke="#3A3A3A" strokeWidth="0.5" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#castleBrickBg)" />
        </svg>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// UI COMPONENTS
// =============================================================================

// The power-up each profession's block holds.
const PROFESSION_POWER_UPS: Record<Profession, React.ReactNode> = {
  drummer: <Starman size={50} />,
  engineer: <FireFlower size={50} />,
  fighter: <SuperMushroom size={50} />,
}

const PROFESSION_GLOW: Record<Profession, string> = {
  drummer: MARIO_COLORS.coinGold,
  engineer: MARIO_COLORS.questionOrange,
  fighter: MARIO_COLORS.marioRed,
}

// Profession option styled as a power-up block, drawn for the shared ProfessionSwitch
function ProfessionPowerUp({ id, label, selected, optionProps }: ProfessionOption) {
  return (
    <button
      type="button"
      {...optionProps}
      className={`relative flex flex-col items-center transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-400 cursor-pointer ${
        selected ? 'scale-110' : 'hover:scale-105 opacity-80 hover:opacity-100'
      }`}
    >
      {/* Power-up block */}
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center relative"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionDark})`
            : `linear-gradient(180deg, ${MARIO_COLORS.brickRed}, ${MARIO_COLORS.brickDark})`,
          border: `4px solid ${selected ? MARIO_COLORS.groundBrown : MARIO_COLORS.groundDarkest}`,
          borderRadius: '4px',
          boxShadow: selected
            ? `0 4px 0 ${MARIO_COLORS.groundDarkest}, 0 0 20px ${PROFESSION_GLOW[id]}60`
            : `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
        }}
        aria-hidden="true"
      >
        {PROFESSION_POWER_UPS[id]}
        {selected && (
          <div className="absolute -top-2 -right-2">
            <Coin size={20} />
          </div>
        )}
      </div>

      {/* Label */}
      <div
        className="mt-3 px-2 sm:px-3 py-1 text-sm font-bold tracking-wider text-center"
        style={{
          background: selected
            ? `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`
            : `linear-gradient(180deg, ${MARIO_COLORS.castleGrey}, ${MARIO_COLORS.castleDark})`,
          color: '#FFF',
          border: `2px solid ${selected ? MARIO_COLORS.questionYellow : MARIO_COLORS.flagGrey}`,
          borderRadius: '2px',
          textShadow: '1px 1px 0 #000',
        }}
      >
        {label}
      </div>
    </button>
  )
}

// Tech inventory - Question block style
function TechInventory({ categories }: { categories: CVData['techStack'] }) {
  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <div key={category.id}>
          <h3 className="text-sm tracking-wider mb-2 flex items-center gap-2" style={{ color: MARIO_COLORS.groundBrown }}>
            <span aria-hidden="true"><Coin size={16} /></span>
            <span style={{ fontFamily: '"Press Start 2P", monospace, sans-serif' }}>{category.name.toUpperCase()}</span>
          </h3>
          <ul className="flex flex-wrap gap-2" aria-label={`${category.name} technologies`}>
            {category.items.map((tech) => (
              <li
                key={tech}
                className="px-3 py-1.5 text-sm transition-transform hover:scale-105 cursor-default"
                style={{
                  background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
                  border: `2px solid ${MARIO_COLORS.pipeMid}`,
                  color: '#FFF',
                  borderRadius: '2px',
                  boxShadow: `0 2px 0 ${MARIO_COLORS.pipeDark}`,
                  textShadow: '1px 1px 0 #000',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// Project card - Star style: his role, the result line and the links that open the project
function ProjectCard({ project, years, links }: ProjectSlot) {
  return (
    <article
      className="relative h-full p-4"
      style={{
        background: `linear-gradient(180deg, #FFF9E6, #FFF3CC)`,
        border: `3px solid ${MARIO_COLORS.groundBrown}`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 ${MARIO_COLORS.groundDarkest}`,
      }}
    >
      {project.highlight && (
        <div className="absolute -top-3 -right-3" aria-hidden="true">
          <Starman size={28} />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-sm font-bold" style={{ color: MARIO_COLORS.groundDarkest }}>
            {project.name}
          </h3>
          {years && (
            <span className="text-sm whitespace-nowrap" style={{ color: MARIO_COLORS.groundDark }}>{years}</span>
          )}
        </div>
        <p className="text-sm font-semibold mb-1" style={{ color: MARIO_COLORS.marioDarkRed }}>
          {project.role}
        </p>
        <p className="text-sm mb-2" style={{ color: MARIO_COLORS.groundDark }}>
          {project.tagline}
        </p>
        {project.impact && (
          <p className="text-sm mb-2 italic flex items-start gap-1" style={{ color: MARIO_COLORS.pipeDark }}>
            <span className="shrink-0 mt-0.5" aria-hidden="true"><Coin size={10} /></span>
            {project.impact}
          </p>
        )}
        {project.techStack.length > 0 && (
          <ul className="flex gap-1 flex-wrap" aria-label="Technologies used">
            {project.techStack.slice(0, 4).map((tech) => (
              <li
                key={tech}
                className="text-sm px-2 py-0.5 rounded"
                style={{
                  background: MARIO_COLORS.pipeDark,
                  color: '#FFF',
                }}
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
        {links.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {links.map(({ kind, label, linkProps }) => (
              <a
                key={kind}
                {...linkProps}
                className="inline-flex items-center min-h-[44px] px-3 text-sm font-bold transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400"
                style={{
                  background: `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`,
                  border: `2px solid ${MARIO_COLORS.groundBrown}`,
                  color: '#FFF',
                  borderRadius: '4px',
                }}
              >
                {label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-sm mt-3" style={{ color: MARIO_COLORS.groundDark }}>No public link</p>
        )}
      </div>
    </article>
  )
}

// Company card - Pipe style
function PipeCard({ company }: { company: CVData['companies'][number] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.name}: ${company.tagline} (opens in a new tab)`}
      className="block p-4 transition-transform hover:scale-[1.02] group focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400 relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
        border: `3px solid ${MARIO_COLORS.pipeMid}`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 ${MARIO_COLORS.pipeDark}`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <GreenPipe height={40} width={32} />
          <div>
            <h3 className="text-sm text-white group-hover:text-yellow-200 transition-colors">
              {company.name}
            </h3>
            <p className="text-sm" style={{ color: MARIO_COLORS.coinGold }}>{company.tagline}</p>
          </div>
        </div>
        <p className="text-sm" style={{ color: '#C8E8C8' }}>{company.description}</p>
      </div>
    </a>
  )
}

// Band card - Music note style
function MusicCard({ band, years, linkProps }: BandSlot) {
  const content = (
    <article
      className="h-full p-4 transition-transform hover:scale-[1.02] group relative"
      style={{
        background: `linear-gradient(180deg, #FFF9E6, #FFF3CC)`,
        border: `3px solid ${MARIO_COLORS.groundBrown}`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 ${MARIO_COLORS.groundDarkest}`,
      }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span aria-hidden="true"><Starman size={24} /></span>
          <h3 className="text-sm font-bold" style={{ color: MARIO_COLORS.groundDarkest }}>
            {band.name}
          </h3>
        </div>
        <p className="text-sm mt-1" style={{ color: MARIO_COLORS.groundDark }}>
          {band.role}
          {years && <span aria-hidden="true"> | </span>}
          {years && <span>{years}</span>}
        </p>
        {band.release && (
          <p className="text-sm mt-2" style={{ color: MARIO_COLORS.groundDarkest }}>
            Released <cite>&ldquo;{band.release}&rdquo;</cite>
          </p>
        )}
      </div>
    </article>
  )

  if (!linkProps) return content
  return (
    <a {...linkProps} className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400">
      {content}
    </a>
  )
}

// Experience entry - Quest log style. Dates are date only strings (UTC midnight), so the year is read in UTC.
function QuestEntry({ entry }: { entry: Job }) {
  const endDisplay = entry.endDate ? entry.endDate.getUTCFullYear() : 'NOW'
  const startDisplay = entry.startDate.getUTCFullYear()

  return (
    <article
      className="p-4 transition-transform hover:scale-[1.01] relative"
      style={{
        background: `linear-gradient(180deg, #3A3A8A, ${MARIO_COLORS.undergroundBlack})`,
        border: `3px solid #5A5A9A`,
        borderRadius: '4px',
        boxShadow: `0 3px 0 #1A1A4A`,
      }}
      aria-label={`${entry.title} at ${entry.company}, ${startDisplay} to ${endDisplay}`}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
          <div className="flex items-start gap-2">
            <span aria-hidden="true"><Coin size={18} /></span>
            <div>
              <h3 className="text-sm font-bold text-white">{entry.title}</h3>
              <p className="text-sm" style={{ color: MARIO_COLORS.coinGold }}>{entry.company}</p>
            </div>
          </div>
          <span
            className="text-sm px-2 py-1"
            style={{
              background: MARIO_COLORS.pipeDark,
              color: '#FFF',
              border: `1px solid ${MARIO_COLORS.pipeMid}`,
              borderRadius: '2px',
            }}
          >
            {startDisplay}-{endDisplay}
          </span>
        </div>
        {entry.description && <p className="text-sm mb-2" style={{ color: '#D8D8F8' }}>{entry.description}</p>}
        {entry.highlights.length > 0 && (
          <ul className="space-y-1 mt-2" aria-label="Key achievements">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="text-sm flex items-start gap-2" style={{ color: '#D8D8F8' }}>
                <span style={{ color: MARIO_COLORS.coinGold }} aria-hidden="true">*</span>
                {highlight}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

// Divider with Mario elements
function MarioDivider() {
  return (
    <div className="flex justify-center items-center py-6 gap-3" aria-hidden="true">
      <Coin size={20} />
      <BrickBlock size={32} />
      <QuestionBlock size={36} />
      <Coin size={20} />
      <Coin size={20} />
      <QuestionBlock size={36} />
      <BrickBlock size={32} />
      <Coin size={20} />
    </div>
  )
}

const PRESS_START = '"Press Start 2P", monospace'

// Email is the red primary block, LinkedIn the green pipe one.
const HERO_ACTION_LOOK: Record<HeroActionSlot['id'], React.CSSProperties> = {
  email: {
    background: `linear-gradient(180deg, ${MARIO_COLORS.marioRed}, ${MARIO_COLORS.marioDarkRed})`,
    border: `3px solid ${MARIO_COLORS.groundBrown}`,
    color: '#FFF',
    boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
  },
  linkedin: {
    background: `linear-gradient(180deg, ${MARIO_COLORS.pipeGreen}, ${MARIO_COLORS.pipeDark})`,
    border: `3px solid ${MARIO_COLORS.pipeMid}`,
    color: '#FFF',
    boxShadow: `0 4px 0 ${MARIO_COLORS.pipeDark}`,
  },
}

const MARIO_BUTTON =
  'mario-button inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 text-sm tracking-wider rounded transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-400'

function HeroAction({ action }: { action: HeroActionSlot }) {
  return (
    <a {...action.linkProps} className={MARIO_BUTTON} style={HERO_ACTION_LOOK[action.id]}>
      {action.label}
    </a>
  )
}

function CVLink() {
  return (
    <Link
      href="/cv"
      className={MARIO_BUTTON}
      style={{
        background: `linear-gradient(180deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionDark})`,
        border: `3px solid ${MARIO_COLORS.groundBrown}`,
        color: MARIO_COLORS.groundDarkest,
        boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
      }}
    >
      <QuestionBlock size={16} hit />
      CV
    </Link>
  )
}

function EngineerLevels({ sections }: { sections: SectionsOf<'engineer'> }) {
  const { professionalSummary } = useCVData()

  return (
    <>
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="About" icon={<MarioSilhouette size={24} />}>
              <p className="text-sm leading-relaxed" style={{ color: MARIO_COLORS.groundDarkest }}>
                {professionalSummary.bio}
              </p>
            </QuestionBlockPanel>
          </section>
        </div>
      </div>

      <MushroomKingdomScene />

      {sections.jobs.length > 0 && (
        <div className="relative z-20 px-4 sm:px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <section className="mb-8">
              <UndergroundPanel title="Work Experience" icon={<Coin size={24} />}>
                <div className="space-y-4">
                  {sections.jobs.map((entry) => (
                    <QuestEntry key={entry.id} entry={entry} />
                  ))}
                </div>
              </UndergroundPanel>
            </section>
          </div>
        </div>
      )}

      <UndergroundScene />

      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="Tech Stack" icon={<FireFlower size={28} />}>
              <TechInventory categories={sections.techStack} />
            </QuestionBlockPanel>
          </section>

          <MarioDivider />

          <section className="mb-8">
            <CastlePanel title="Projects" icon={<Starman size={28} />}>
              <ProjectList
                projects={sections.projects}
                className="grid md:grid-cols-2 gap-4"
                renderProject={(slot) => <ProjectCard {...slot} />}
              />
            </CastlePanel>
          </section>
        </div>
      </div>

      <CastleVictoryScene />

      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="Ventures" icon={<GreenPipe height={28} width={24} />}>
              <div className="grid md:grid-cols-3 gap-4">
                {sections.companies.map((company) => (
                  <PipeCard key={company.id} company={company} />
                ))}
              </div>
            </QuestionBlockPanel>
          </section>
        </div>
      </div>
    </>
  )
}

function MusicianLevel({ sections }: { sections: SectionsOf<'drummer'> }) {
  const { musician, bands } = sections

  return (
    <>
      <MushroomKingdomScene />
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <QuestionBlockPanel title="Bands" icon={<Starman size={28} />}>
              <p className="text-sm mb-4" style={{ color: MARIO_COLORS.groundDarkest }}>
                Drums since {musician.since}, {musician.yearsPlaying} years
              </p>
              <BandList
                bands={bands}
                className="grid md:grid-cols-2 gap-4"
                renderBand={(slot) => <MusicCard {...slot} />}
              />
              <p className="text-sm mt-4" style={{ color: MARIO_COLORS.groundDarkest }}>
                {musician.line}
              </p>
            </QuestionBlockPanel>
          </section>
        </div>
      </div>
    </>
  )
}

function MartialArtistLevel({ sections }: { sections: SectionsOf<'fighter'> }) {
  const { martialArts } = sections

  return (
    <>
      <MushroomKingdomScene />
      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <UndergroundPanel title="Muay Thai" icon={<SuperMushroom size={28} />}>
              <h3 className="text-base font-bold text-white mb-4">{martialArts.primary.title}</h3>
              <MuayThaiRecord
                martialArts={martialArts}
                classNames={{
                  facts: 'grid sm:grid-cols-2 gap-3 mb-4',
                  fact: 'p-3 rounded border-2 border-[#5A5A9A] bg-[#3A3A8A]',
                  term: 'text-sm font-bold tracking-wider text-[#FFD700] uppercase',
                  value: 'text-sm text-white mt-1',
                  achievements: 'space-y-1',
                  achievement: 'text-sm text-[#D8D8F8] flex items-start gap-2',
                }}
                renderAchievement={(achievement) => (
                  <>
                    <span className="text-[#FFD700]" aria-hidden="true">*</span>
                    <span>{achievement}</span>
                  </>
                )}
              />
            </UndergroundPanel>
          </section>
        </div>
      </div>
    </>
  )
}

const SECTION_VIEWS: ProfessionSectionViews = {
  engineer: EngineerLevels,
  drummer: MusicianLevel,
  fighter: MartialArtistLevel,
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AdventurePathsTheme() {
  const { active } = useProfession()
  const view = useWorldView()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${MARIO_COLORS.skyLight} 0%, ${MARIO_COLORS.skyBlue} 100%)`,
        fontFamily: '"Nunito", "Segoe UI", sans-serif',
      }}
    >
      {/* Floating clouds background */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
        <div className="absolute top-[5%] left-[10%] cloud-float-1"><MarioCloud width={120} /></div>
        <div className="absolute top-[15%] right-[15%] cloud-float-2"><MarioCloud width={100} /></div>
        <div className="absolute top-[8%] left-[50%] cloud-float-3"><MarioCloud width={80} /></div>
        <div className="absolute top-[20%] left-[30%] cloud-float-2"><MarioCloud width={90} /></div>
        <div className="absolute top-[12%] right-[40%] cloud-float-1"><MarioCloud width={110} /></div>
      </div>

      {/* Header - the recruiter first screen */}
      <header className="relative z-30 px-4 py-5 sm:p-6">
        <RecruiterHero
          render={({ name, headline, tagline, line, actions }) => (
            <div className="max-w-6xl mx-auto flex justify-between items-start flex-wrap gap-4">
              <div className="flex items-start gap-4">
                <div className="hidden sm:block shrink-0" aria-hidden="true">
                  <MarioSilhouette size={70} />
                </div>
                <div>
                  <h1
                    className="text-xl sm:text-2xl tracking-wider font-bold uppercase"
                    style={{
                      color: '#FFF',
                      textShadow: `3px 3px 0 ${MARIO_COLORS.marioRed}, 6px 6px 0 #000`,
                      fontFamily: '"Press Start 2P", "Arial Black", sans-serif',
                    }}
                  >
                    {name}
                  </h1>
                  <p className="text-sm font-semibold tracking-wide mt-3" style={{ color: MARIO_COLORS.groundDarkest }}>
                    {headline}
                  </p>
                  <p className="text-sm tracking-wide mt-1 italic" style={{ color: MARIO_COLORS.groundDarkest }}>
                    {tagline}
                  </p>
                  <p className="text-sm mt-1" style={{ color: MARIO_COLORS.groundDarkest }}>
                    {line}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-3">
                {/* Coin/Star counters */}
                <div className="hidden sm:flex items-center gap-4" aria-hidden="true">
                  <div
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      background: `linear-gradient(180deg, #2A2A2A, #1A1A1A)`,
                      border: `2px solid ${MARIO_COLORS.coinGold}`,
                      borderRadius: '4px',
                    }}
                  >
                    <Coin size={20} />
                    <span className="text-sm font-bold" style={{ color: '#FFF', fontFamily: PRESS_START }}>x99</span>
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5"
                    style={{
                      background: `linear-gradient(180deg, #2A2A2A, #1A1A1A)`,
                      border: `2px solid ${MARIO_COLORS.coinGold}`,
                      borderRadius: '4px',
                    }}
                  >
                    <Starman size={20} />
                    <span className="text-sm font-bold" style={{ color: '#FFF', fontFamily: PRESS_START }}>x7</span>
                  </div>
                </div>

                {/* Action buttons */}
                <nav className="flex gap-3 items-center flex-wrap" aria-label="Contact and CV">
                  {actions.map((action) => (
                    <HeroAction key={action.id} action={action} />
                  ))}
                  <CVLink />
                  <Link
                    href="/personal-projects/game-engine"
                    className={MARIO_BUTTON}
                    style={{
                      background: `linear-gradient(180deg, ${MARIO_COLORS.questionYellow}, ${MARIO_COLORS.questionDark})`,
                      border: `3px solid ${MARIO_COLORS.groundBrown}`,
                      color: MARIO_COLORS.groundDarkest,
                      boxShadow: `0 4px 0 ${MARIO_COLORS.groundDarkest}`,
                    }}
                  >
                    <Starman size={16} />
                    PLAY
                  </Link>
                </nav>
              </div>
            </div>
          )}
        />
      </header>

      {/* Profession Selector - Power-up blocks, System Engineer in the centre */}
      <section className="relative z-20 py-6 sm:py-8 px-4" aria-label="Profession Selection">
        <ProfessionSwitch
          className="max-w-3xl mx-auto flex justify-center items-start gap-4 sm:gap-12"
          label="Profession"
          renderOption={(option) => <ProfessionPowerUp {...option} />}
        />
      </section>

      {/* The picked profession's levels, and only those */}
      <div role="region" aria-label={`${active} profession details`}>
        <ProfessionSectionsView views={SECTION_VIEWS} sections={view.sections} />
      </div>

      <div className="relative z-20 px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* === POSTS (placeholder) === */}
          <section className="mb-8">
            <UndergroundPanel title="Posts" icon={<QuestionBlock size={24} />}>
              <div className="text-center py-8">
                <QuestionBlock size={60} hit />
                <p className="mt-4 text-sm" style={{ color: '#C8C8E8' }}>Coming soon... check back for blog posts!</p>
              </div>
            </UndergroundPanel>
          </section>
        </div>
      </div>

      {/* Contact CTA */}
      <section className="relative z-20 py-16 px-4 sm:px-6" aria-labelledby="mario-contact-heading">
        <RecruiterHero
          render={({ line, actions }) => (
            <div className="max-w-2xl mx-auto text-center">
              <div className="mb-8">
                <div className="flex justify-center gap-2 mb-4" aria-hidden="true">
                  <Coin size={20} />
                  <QuestionBlock size={32} />
                  <Coin size={20} />
                </div>
                <h2
                  id="mario-contact-heading"
                  className="text-lg tracking-[0.15em] mb-3"
                  style={{
                    color: MARIO_COLORS.marioRed,
                    textShadow: `2px 2px 0 ${MARIO_COLORS.groundDarkest}`,
                    fontFamily: '"Press Start 2P", monospace, sans-serif',
                  }}
                >
                  READY TO TEAM UP?
                </h2>
                <p className="text-sm" style={{ color: MARIO_COLORS.groundDarkest }}>
                  {line}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {actions.map((action) => (
                  <HeroAction key={action.id} action={action} />
                ))}
                <CVLink />
              </div>
            </div>
          )}
        />
      </section>

      

      {/* Footer with ground */}
      <footer className="relative z-20">
        <div className="text-center py-8">
          <div
            className="inline-flex items-center justify-center gap-4 px-6 py-3"
            style={{
              background: `linear-gradient(180deg, #2A2A2A, #1A1A1A)`,
              border: `3px solid ${MARIO_COLORS.coinGold}`,
              borderRadius: '4px',
              boxShadow: `0 4px 0 #0A0A0A`,
            }}
          >
            <GreenPipe height={40} width={32} />
            <div className="flex items-center gap-2">
              <Starman size={24} />
              <span className="text-[10px] tracking-wider text-white" style={{ fontFamily: '"Press Start 2P", monospace' }}>PLAYER ONE</span>
              <Starman size={24} />
            </div>
            <GreenPipe height={40} width={32} />
          </div>
          <p
            className="text-[8px] mt-3 px-3 py-1 inline-block"
            style={{
              color: MARIO_COLORS.castleGrey,
              background: '#1A1A1A',
              border: `1px solid ${MARIO_COLORS.castleDark}`,
              borderRadius: '2px',
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            WORLD 1-1 CLEAR * COINS: 99 * LIVES: 99
          </p>
        </div>
        <GroundPattern />
      </footer>

      {/* CSS Animations */}
      <style jsx global>{`
        /* === COIN SPIN === */
        @keyframes coinSpinAnim {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.2); }
        }
        .coin-spin {
          animation: coinSpinAnim 0.8s ease-in-out infinite;
        }

        /* === QUESTION BLOCK BOUNCE === */
        @keyframes questionBounceAnim {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .question-bounce {
          animation: questionBounceAnim 2s ease-in-out infinite;
        }

        /* === STARMAN FLASH === */
        @keyframes starmanFlashAnim {
          0%, 100% { filter: brightness(1) hue-rotate(0deg); }
          25% { filter: brightness(1.3) hue-rotate(60deg); }
          50% { filter: brightness(1.1) hue-rotate(120deg); }
          75% { filter: brightness(1.3) hue-rotate(180deg); }
        }
        .starman-flash {
          animation: starmanFlashAnim 0.5s linear infinite;
        }

        /* === CLOUD FLOAT === */
        @keyframes cloudFloatAnim {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(20px) translateY(-5px); }
        }
        .cloud-float {
          animation: cloudFloatAnim 8s ease-in-out infinite;
        }
        .cloud-float-1 {
          animation: cloudFloatAnim 12s ease-in-out infinite;
        }
        .cloud-float-2 {
          animation: cloudFloatAnim 10s ease-in-out infinite;
          animation-delay: -3s;
        }
        .cloud-float-3 {
          animation: cloudFloatAnim 14s ease-in-out infinite;
          animation-delay: -6s;
        }

        /* === MARIO BUTTON === */
        .mario-button {
          position: relative;
          overflow: hidden;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        .mario-button:active {
          transform: translateY(4px) scale(0.98) !important;
          box-shadow: none !important;
        }

        /* === REDUCED MOTION SUPPORT === */
        @media (prefers-reduced-motion: reduce) {
          .coin-spin,
          .question-bounce,
          .starman-flash,
          .cloud-float,
          .cloud-float-1,
          .cloud-float-2,
          .cloud-float-3,
          .mario-button {
            animation: none !important;
            transition: none !important;
          }
        }

        /* === GOOGLE FONT FALLBACK === */
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
      `}</style>
    </div>
  )
}
