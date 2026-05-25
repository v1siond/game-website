'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/themes/ThemeContext'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { useProfession } from '@/contexts/ProfessionContext'
import { ABOUT_DATA, PROFESSIONAL_SUMMARY } from '@/data/about'
import { PROJECTS_DATA } from '@/data/projects'
import { getSkillsByProfession, getEngineerSkills } from '@/data/skills'
import { CURRENT_ROLES } from '@/data/roles'
import { COMPANIES } from '@/data/companies'
import { BANDS } from '@/data/bands'
import { EXPERIENCE_DATA, filterExperienceByProfession } from '@/data/experience'

// Comic book halftone pattern
function HalftoneBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle, #1a1a1a 1px, transparent 1px)`,
        backgroundSize: '4px 4px',
      }}
    />
  )
}

// Wasteland grunge texture overlay
function WastelandTexture() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[2] opacity-[0.08]"
      style={{
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 90, 43, 0.3) 2px, transparent 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 90, 43, 0.2) 2px, transparent 4px)
        `,
      }}
    />
  )
}

// Ink splatter decoration
function InkSplatter({ x, y, size, color = '#1a1a1a' }: { x: number; y: number; size: number; color?: string }) {
  return (
    <div
      className="fixed pointer-events-none z-[2]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        borderRadius: '60% 40% 50% 50%',
        transform: `rotate(${Math.random() * 360}deg)`,
        boxShadow: `2px 2px 0 #1a1a1a`,
      }}
    />
  )
}

// Floating damage numbers
function DamageNumber({ x, y, value, color }: { x: number; y: number; value: string; color: string }) {
  return (
    <div
      className="fixed pointer-events-none z-[3] font-black text-2xl animate-damage-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        color: color,
        textShadow: '3px 3px 0 #1a1a1a, -1px -1px 0 #1a1a1a',
        fontFamily: '"Bangers", "Impact", sans-serif',
      }}
    >
      +{value}
    </div>
  )
}

// Gun silhouette decoration
function GunSilhouette({ x, y, rotation, flip }: { x: number; y: number; rotation: number; flip?: boolean }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `rotate(${rotation}deg) ${flip ? 'scaleX(-1)' : ''}`,
      }}
    >
      <svg width="120" height="50" viewBox="0 0 120 50" fill="#1a1a1a">
        <path d="M5,25 L40,25 L45,20 L90,20 L95,15 L115,15 L115,25 L105,25 L105,30 L95,30 L95,35 L60,35 L55,30 L45,30 L40,35 L30,35 L30,30 L5,30 Z" />
        <rect x="25" y="30" width="15" height="15" rx="2" />
      </svg>
    </div>
  )
}

// Vault symbol
function VaultSymbol({ x, y, size }: { x: number; y: number; size: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-15"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="#ffcc00" strokeWidth="4">
        <circle cx="50" cy="50" r="45" />
        <circle cx="50" cy="50" r="30" />
        <line x1="50" y1="5" x2="50" y2="20" />
        <line x1="50" y1="80" x2="50" y2="95" />
        <line x1="5" y1="50" x2="20" y2="50" />
        <line x1="80" y1="50" x2="95" y2="50" />
        <path d="M35,35 L50,50 L35,65" strokeLinecap="round" />
        <path d="M65,35 L50,50 L65,65" strokeLinecap="round" />
      </svg>
    </div>
  )
}

// Claptrap robot silhouette
function ClaptrapSilhouette({ x, y }: { x: number; y: number }) {
  return (
    <div
      className="fixed pointer-events-none z-[2] opacity-20"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <svg width="80" height="100" viewBox="0 0 80 100" fill="#1a1a1a">
        {/* Body */}
        <rect x="15" y="30" width="50" height="45" rx="5" />
        {/* Eye */}
        <circle cx="40" cy="50" r="12" fill="#f5f0e0" />
        <circle cx="40" cy="50" r="8" fill="#3366cc" />
        <circle cx="43" cy="47" r="3" fill="#fff" />
        {/* Antenna */}
        <rect x="37" y="10" width="6" height="20" />
        <circle cx="40" cy="10" r="5" />
        {/* Wheel */}
        <circle cx="40" cy="85" r="12" />
        <circle cx="40" cy="85" r="6" fill="#f5f0e0" />
        {/* Arms */}
        <rect x="0" y="40" width="15" height="8" rx="2" />
        <rect x="65" y="40" width="15" height="8" rx="2" />
      </svg>
    </div>
  )
}

// Explosion burst decoration
function ExplosionBurst({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <div
      className="fixed pointer-events-none z-[4]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <svg width="120" height="80" viewBox="0 0 120 80">
        <polygon
          points="60,5 70,25 95,20 80,40 100,55 70,50 60,75 50,50 20,55 40,40 25,20 50,25"
          fill="#ffcc00"
          stroke="#1a1a1a"
          strokeWidth="3"
        />
        <text
          x="60"
          y="45"
          textAnchor="middle"
          fill="#1a1a1a"
          fontSize="14"
          fontWeight="bold"
          fontFamily="Bangers, Impact, sans-serif"
        >
          {text}
        </text>
      </svg>
    </div>
  )
}

// Comic panel style container with heavy outlines
function ComicPanel({
  children,
  rotation = 0,
  accentColor = '#ff6600',
  title,
}: {
  children: React.ReactNode
  rotation?: number
  accentColor?: string
  title?: string
}) {
  return (
    <div
      className="relative p-6"
      style={{
        background: '#f5f0e0',
        border: '6px solid #1a1a1a',
        boxShadow: '8px 8px 0 #1a1a1a',
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Heavy corner marks */}
      <div className="absolute -top-2 -left-2 w-6 h-6" style={{ background: accentColor, border: '3px solid #1a1a1a' }} />
      <div className="absolute -bottom-2 -right-2 w-6 h-6" style={{ background: accentColor, border: '3px solid #1a1a1a' }} />
      <div className="absolute -top-2 -right-2 w-3 h-3" style={{ background: '#1a1a1a' }} />
      <div className="absolute -bottom-2 -left-2 w-3 h-3" style={{ background: '#1a1a1a' }} />

      {/* Title banner */}
      {title && (
        <div
          className="absolute -top-5 left-1/2 transform -translate-x-1/2 px-6 py-1"
          style={{
            background: accentColor,
            border: '4px solid #1a1a1a',
            transform: 'translateX(-50%) rotate(-2deg)',
          }}
        >
          <span className="text-sm tracking-wider font-black" style={{ color: '#1a1a1a' }}>
            {title}
          </span>
        </div>
      )}

      {children}
    </div>
  )
}

// Character card with bold outlines - Vault Hunter style
function VaultHunterCard({
  profession,
  isActive,
  onClick,
}: {
  profession: 'engineer' | 'drummer' | 'fighter'
  isActive: boolean
  onClick: () => void
}) {
  const hunters = {
    engineer: { name: 'TECH WIZARD', icon: '💻', color: '#3366cc', tagline: 'SYSTEMS ONLINE', level: 'LVL 50' },
    drummer: { name: 'BEAT MASTER', icon: '🥁', color: '#ff6600', tagline: 'DROP THE BEAT', level: 'LVL 45' },
    fighter: { name: 'BRAWLER', icon: '🥋', color: '#ff0066', tagline: 'FISTS OF FURY', level: 'LVL 40' },
  }
  const hunter = hunters[profession]

  return (
    <button
      onClick={onClick}
      className={`relative transition-all duration-200 ${
        isActive ? 'scale-110 z-10' : 'hover:scale-105'
      }`}
      style={{
        transform: isActive ? 'scale(1.1) rotate(-2deg)' : '',
      }}
    >
      <div
        className="p-6 text-center"
        style={{
          background: isActive ? hunter.color : '#ebe5d5',
          border: '6px solid #1a1a1a',
          boxShadow: '5px 5px 0 #1a1a1a',
        }}
      >
        <span className="text-5xl block mb-2" style={{ filter: 'drop-shadow(4px 4px 0 #1a1a1a)' }}>
          {hunter.icon}
        </span>
        <span
          className="text-lg font-black tracking-wider block"
          style={{ color: isActive ? '#fff' : '#1a1a1a', textShadow: isActive ? '2px 2px 0 #1a1a1a' : 'none' }}
        >
          {hunter.name}
        </span>
        <span
          className="text-[10px] block mt-1 font-bold"
          style={{
            color: isActive ? '#ffcc00' : hunter.color,
            fontStyle: 'italic',
          }}
        >
          {hunter.tagline}
        </span>
        <span
          className="text-[8px] block mt-2 font-black tracking-widest"
          style={{ color: isActive ? '#fff' : '#555' }}
        >
          {hunter.level}
        </span>
      </div>

      {/* Selection burst */}
      {isActive && (
        <div className="absolute -top-5 -right-5">
          <svg width="50" height="50" viewBox="0 0 50 50">
            <polygon
              points="25,0 30,18 50,18 34,28 40,50 25,36 10,50 16,28 0,18 20,18"
              fill="#ffcc00"
              stroke="#1a1a1a"
              strokeWidth="3"
            />
            <text x="25" y="28" textAnchor="middle" fill="#1a1a1a" fontSize="8" fontWeight="bold">NEW!</text>
          </svg>
        </div>
      )}
    </button>
  )
}

// Tech tag with comic styling
function TechTag({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-[9px] font-bold transition-transform hover:scale-110 hover:rotate-2 cursor-default"
      style={{
        background: color,
        color: '#1a1a1a',
        border: '2px solid #1a1a1a',
        boxShadow: '2px 2px 0 #1a1a1a',
      }}
    >
      {name}
    </span>
  )
}

// Tech stack cloud for engineer (Borderlands style)
function TechStackCloud({ categories }: { categories: ReturnType<typeof getEngineerSkills> }) {
  const colors = ['#ff6600', '#3366cc', '#ff0066', '#ffcc00', '#00cc66', '#9966cc']

  return (
    <div className="space-y-4">
      {categories.map((category, catIndex) => (
        <div key={category.name} className="mb-3">
          <h3
            className="text-xs tracking-widest mb-2 flex items-center gap-2 font-black"
            style={{ color: colors[catIndex % colors.length] }}
          >
            <span className="text-lg">{category.icon}</span>
            {category.name.toUpperCase()}
            <span className="text-[8px] px-2 py-0.5 bg-[#1a1a1a] text-white">{category.items.length} ITEMS</span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {category.items.map((tech) => (
              <TechTag key={tech} name={tech} color={colors[catIndex % colors.length]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Skill bar with bold styling
function SkillBar({ name, level, color }: { name: string; level: number; color: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-xs font-bold w-28 truncate" style={{ color: '#1a1a1a' }}>
        {name}
      </span>
      <div
        className="flex-1 h-5 flex"
        style={{ border: '4px solid #1a1a1a' }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              background: i < level ? color : '#e0d8c8',
              borderRight: i < 4 ? '3px solid #1a1a1a' : 'none',
            }}
          />
        ))}
      </div>
      <span
        className="text-sm font-black px-2 py-0.5"
        style={{ background: color, color: '#1a1a1a', border: '2px solid #1a1a1a' }}
      >
        {level}/5
      </span>
    </div>
  )
}

// Experience Card - work history styled as mission briefing
function ExperienceCard({ entry, index }: { entry: typeof EXPERIENCE_DATA[0]; index: number }) {
  const borderColors = ['#ff6600', '#3366cc', '#ff0066']
  const color = borderColors[index % 3]

  return (
    <div
      className="relative p-4 mb-4 transition-transform hover:scale-[1.01]"
      style={{
        background: '#f5f0e0',
        border: '5px solid #1a1a1a',
        boxShadow: '4px 4px 0 #1a1a1a',
        transform: `rotate(${index % 2 === 0 ? -0.5 : 0.5}deg)`,
      }}
    >
      <div
        className="absolute top-0 left-0 px-3 py-1 text-xs font-black tracking-wider"
        style={{
          background: color,
          color: '#fff',
          border: '3px solid #1a1a1a',
          transform: 'translate(-8px, -8px) rotate(-3deg)',
          textShadow: '1px 1px 0 #1a1a1a',
        }}
      >
        {entry.startDate} - {entry.endDate || 'NOW'}
      </div>

      <h3
        className="text-lg font-black mt-4 mb-1"
        style={{ color: '#1a1a1a', textShadow: `2px 2px 0 ${color}` }}
      >
        {entry.title}
      </h3>
      <p
        className="text-sm font-bold mb-2"
        style={{ color: color }}
      >
        {entry.organization}
      </p>

      {entry.highlights && entry.highlights.length > 0 && (
        <ul className="mt-2 space-y-1">
          {entry.highlights.map((highlight, i) => (
            <li
              key={i}
              className="text-xs flex items-start gap-2"
              style={{ color: '#1a1a1a' }}
            >
              <span style={{ color: color }}>◆</span>
              {highlight}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Loot card for projects - Borderlands weapon card style
function LootCard({ project, rarity }: { project: typeof PROJECTS_DATA[0]; rarity: 'common' | 'rare' | 'legendary' | 'pearlescent' }) {
  const rarityConfig = {
    common: { color: '#555555', label: 'COMMON', glow: false },
    rare: { color: '#3366cc', label: 'RARE', glow: false },
    legendary: { color: '#ff6600', label: 'LEGENDARY', glow: true },
    pearlescent: { color: '#00cccc', label: 'PEARLESCENT', glow: true },
  }
  const config = rarityConfig[rarity]

  return (
    <div
      className="relative p-4 group cursor-pointer transition-transform hover:scale-[1.02] hover:rotate-1"
      style={{
        background: '#ebe5d5',
        border: `5px solid ${config.color}`,
        boxShadow: config.glow
          ? `4px 4px 0 #1a1a1a, 0 0 20px ${config.color}40`
          : '4px 4px 0 #1a1a1a',
      }}
    >
      {/* Rarity banner */}
      <div
        className="absolute -top-3 left-4 px-3 py-0.5 text-[10px] font-black tracking-wider"
        style={{
          background: config.color,
          color: '#fff',
          border: '3px solid #1a1a1a',
          transform: 'rotate(-2deg)',
          textShadow: '1px 1px 0 #1a1a1a',
        }}
      >
        {config.label}
      </div>

      {/* Damage stats decoration */}
      <div className="absolute top-2 right-2 text-right">
        <span className="text-[8px] font-bold" style={{ color: '#555' }}>DMG</span>
        <span className="block text-xs font-black" style={{ color: config.color }}>
          {Math.floor(Math.random() * 500) + 200}
        </span>
      </div>

      <h3 className="text-sm font-black mt-3 mb-1 pr-12" style={{ color: '#1a1a1a' }}>
        {project.name}
      </h3>
      <p className="text-[10px] mb-2" style={{ color: '#555' }}>
        {project.tagline}
      </p>
      {project.impact && (
        <p className="text-[9px] mb-2 italic" style={{ color: config.color }}>
          +{project.impact}
        </p>
      )}
      <div className="flex gap-1 flex-wrap">
        {project.techStack.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-[8px] px-2 py-0.5 font-bold"
            style={{
              background: '#1a1a1a',
              color: '#f5f0e0',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Hover action lines */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,102,0,0.1) 10px, rgba(255,102,0,0.1) 20px)',
        }}
      />
    </div>
  )
}

// Company card - Borderlands vendor style
function CompanyCard({ company }: { company: typeof COMPANIES[0] }) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative p-4 transition-all hover:scale-[1.02] hover:-rotate-1 group"
      style={{
        background: '#ebe5d5',
        border: '5px solid #ffcc00',
        boxShadow: '5px 5px 0 #1a1a1a',
      }}
    >
      {/* Marcus-style vendor banner */}
      <div
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1"
        style={{
          background: '#ffcc00',
          border: '3px solid #1a1a1a',
        }}
      >
        <span className="text-[10px] font-black tracking-wider" style={{ color: '#1a1a1a' }}>
          VENDOR
        </span>
      </div>

      <div className="flex items-center gap-3 mb-2 mt-2">
        <span
          className="text-3xl"
          style={{ filter: 'drop-shadow(2px 2px 0 #1a1a1a)' }}
        >
          {company.icon}
        </span>
        <div>
          <h4 className="text-sm font-black group-hover:text-[#ff6600] transition-colors" style={{ color: '#1a1a1a' }}>
            {company.name}
          </h4>
          <p className="text-[9px] font-bold" style={{ color: '#ff6600' }}>{company.tagline}</p>
        </div>
      </div>
      <p className="text-[10px]" style={{ color: '#555' }}>{company.description}</p>

      {/* Services as weapon stats */}
      <div className="mt-2 space-y-1">
        {company.services.slice(0, 2).map((service) => (
          <div key={service} className="flex items-center gap-1">
            <span style={{ color: '#ff6600' }}>+</span>
            <span className="text-[8px]" style={{ color: '#1a1a1a' }}>{service}</span>
          </div>
        ))}
      </div>
    </a>
  )
}

// Band card - Borderlands Echo device style
function BandCard({ band }: { band: typeof BANDS[0] }) {
  const content = (
    <div
      className="relative p-4 transition-all hover:scale-[1.02] hover:rotate-1 group"
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a3a 100%)',
        border: '5px solid #9966cc',
        boxShadow: '5px 5px 0 #1a1a1a, 0 0 15px #9966cc30',
      }}
    >
      {/* Echo device top bar */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#00ff00', boxShadow: '0 0 8px #00ff00' }} />
        <span className="text-[8px] tracking-wider" style={{ color: '#9966cc' }}>ECHO DEVICE</span>
      </div>

      <h4 className="text-sm font-black group-hover:text-[#ff6600] transition-colors" style={{ color: '#f5f0e0' }}>
        {band.name}
      </h4>
      <p className="text-[10px] mt-1" style={{ color: '#9966cc' }}>
        {band.genre} | {band.role}
      </p>
      <p className="text-[10px] mt-2" style={{ color: '#aaa' }}>{band.description}</p>
      {!band.url && (
        <p className="text-[8px] mt-2 italic" style={{ color: '#666' }}>
          [SIGNAL INCOMING...]
        </p>
      )}

      {/* Audio wave decoration */}
      <div className="absolute bottom-2 right-2 flex items-end gap-0.5">
        {[3, 5, 2, 6, 4, 3, 5].map((h, i) => (
          <div
            key={i}
            className="w-1 animate-pulse"
            style={{
              height: h * 2,
              background: '#9966cc',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>
    </div>
  )

  if (band.url) {
    return <a href={band.url} target="_blank" rel="noopener noreferrer" className="block">{content}</a>
  }
  return content
}

// Role badge - Borderlands skill point style
function RoleBadge({ role }: { role: typeof CURRENT_ROLES[0] }) {
  const colors = {
    employment: '#3366cc',
    leadership: '#ff6600',
  }
  return (
    <div
      className="text-center px-6 py-3"
      style={{
        background: '#ebe5d5',
        border: `4px solid ${colors[role.type]}`,
        boxShadow: '4px 4px 0 #1a1a1a',
      }}
    >
      <p className="text-xs tracking-wider font-black" style={{ color: colors[role.type] }}>
        {role.title}
      </p>
      <p className="text-sm font-black" style={{ color: '#1a1a1a' }}>{role.company}</p>
      <p className="text-[8px] mt-1" style={{ color: '#555' }}>{role.description}</p>
    </div>
  )
}

// Speech bubble for bio - with heavy outlines
function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="p-6"
        style={{
          background: '#fff',
          border: '5px solid #1a1a1a',
          borderRadius: '20px',
          boxShadow: '6px 6px 0 #1a1a1a',
        }}
      >
        {children}
      </div>
      {/* Tail */}
      <div
        className="absolute -bottom-5 left-16 w-0 h-0"
        style={{
          borderLeft: '18px solid transparent',
          borderRight: '18px solid transparent',
          borderTop: '24px solid #1a1a1a',
        }}
      />
      <div
        className="absolute -bottom-2 left-16 w-0 h-0"
        style={{
          borderLeft: '14px solid transparent',
          borderRight: '14px solid transparent',
          borderTop: '18px solid #fff',
          marginLeft: '4px',
        }}
      />
    </div>
  )
}

export default function CellShadedTheme() {
  const { theme } = useTheme()
  const { active, setActive, config } = useProfession()
  const [mounted, setMounted] = useState(false)

  const aboutData = ABOUT_DATA[active]
  const engineerTech = getEngineerSkills()
  const skills = getSkillsByProfession(active)
  const projects = PROJECTS_DATA.filter(p => p.professions.includes(active) || p.featured)
  const experience = filterExperienceByProfession(EXPERIENCE_DATA, active)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const skillColors = ['#ff6600', '#3366cc', '#ff0066']

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #e8dcc0 0%, #f5f0e0 50%, #ddd5c0 100%)',
        fontFamily: '"Bangers", "Impact", sans-serif',
      }}
    >
      {/* Background layers */}
      <HalftoneBackground />
      <WastelandTexture />

      {/* Decorative elements */}
      <InkSplatter x={5} y={10} size={40} />
      <InkSplatter x={92} y={15} size={25} color="#ff6600" />
      <InkSplatter x={88} y={75} size={35} />
      <InkSplatter x={3} y={60} size={20} color="#3366cc" />

      <GunSilhouette x={-2} y={20} rotation={15} />
      <GunSilhouette x={85} y={85} rotation={-25} flip />

      <VaultSymbol x={92} y={40} size={80} />
      <VaultSymbol x={5} y={80} size={60} />

      <ClaptrapSilhouette x={88} y={60} />

      <DamageNumber x={15} y={25} value="9999" color="#ff6600" />
      <DamageNumber x={80} y={30} value="CRIT" color="#ff0066" />
      <DamageNumber x={70} y={70} value="1337" color="#3366cc" />

      <ExplosionBurst x={8} y={45} text="POW!" />
      <ExplosionBurst x={95} y={20} text="BOOM!" />

      {/* Header */}
      <header className="relative z-30 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-start">
          <div style={{ transform: 'rotate(-2deg)' }}>
            <h1
              className="text-5xl tracking-wider"
              style={{
                color: '#1a1a1a',
                textShadow: '4px 4px 0 #ff6600, 8px 8px 0 #1a1a1a',
              }}
            >
              ALEXANDER PULIDO
            </h1>
            <p
              className="text-base tracking-wide mt-2 font-bold"
              style={{ color: '#1a1a1a' }}
            >
              {PROFESSIONAL_SUMMARY.headline}
            </p>
            <p
              className="text-sm tracking-wider mt-1 italic"
              style={{ color: '#ff6600', textShadow: '1px 1px 0 #1a1a1a' }}
            >
              &quot;{PROFESSIONAL_SUMMARY.tagline}&quot;
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <Link
              href="/cv"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:-rotate-2 font-black"
              style={{
                background: '#fff',
                border: '5px solid #1a1a1a',
                color: '#1a1a1a',
                boxShadow: '4px 4px 0 #1a1a1a',
              }}
            >
              STATS
            </Link>
            <Link
              href="/personal-projects/game-engine"
              className="px-4 py-2 text-sm tracking-wider transition-all hover:scale-105 hover:rotate-2 font-black"
              style={{
                background: '#ff6600',
                border: '5px solid #1a1a1a',
                color: '#fff',
                boxShadow: '4px 4px 0 #1a1a1a',
                textShadow: '2px 2px 0 #1a1a1a',
              }}
            >
              PLAY!
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Current Roles */}
      <section className="relative z-20 py-4 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {CURRENT_ROLES.map((role) => (
              <RoleBadge key={role.id} role={role} />
            ))}
          </div>
        </div>
      </section>

      {/* Character selection */}
      <section className="relative z-20 py-8">
        <div className="text-center mb-4">
          <span
            className="text-lg tracking-widest"
            style={{
              color: '#1a1a1a',
              textShadow: '2px 2px 0 #ffcc00',
            }}
          >
            SELECT YOUR VAULT HUNTER
          </span>
        </div>
        <div className="flex justify-center gap-8">
          {(['engineer', 'drummer', 'fighter'] as const).map((prof) => (
            <VaultHunterCard
              key={prof}
              profession={prof}
              isActive={active === prof}
              onClick={() => setActive(prof)}
            />
          ))}
        </div>
      </section>

      {/* Main content */}
      <main className="relative z-20 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Bio speech bubble */}
          <section className="mb-12">
            <SpeechBubble>
              <p className="text-sm leading-relaxed" style={{ color: '#1a1a1a', fontFamily: 'Arial, sans-serif' }}>
                {aboutData.bio}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {aboutData.quickFacts.map((fact, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 font-black"
                    style={{
                      background: ['#ff6600', '#3366cc', '#ff0066', '#ffcc00'][i % 4],
                      color: '#1a1a1a',
                      border: '3px solid #1a1a1a',
                      boxShadow: '2px 2px 0 #1a1a1a',
                      transform: `rotate(${(i % 2 === 0 ? -3 : 3)}deg)`,
                    }}
                  >
                    {fact}
                  </span>
                ))}
              </div>
            </SpeechBubble>
          </section>

          {/* Work Experience */}
          {experience.length > 0 && (
            <section className="mb-12">
              <ComicPanel rotation={0.5} accentColor="#ff6600" title="Work Experience">
                <div className="mt-4">
                  {experience.map((entry, i) => (
                    <ExperienceCard key={entry.id} entry={entry} index={i} />
                  ))}
                </div>
              </ComicPanel>
            </section>
          )}

          {/* Tech Stack (Engineer) or Skills */}
          <section className="mb-12">
            {active === 'engineer' ? (
              <ComicPanel rotation={-0.5} accentColor="#3366cc" title="Tech Stack">
                <div className="mt-4">
                  <TechStackCloud categories={engineerTech} />
                </div>
              </ComicPanel>
            ) : (
              <ComicPanel rotation={-1} accentColor={active === 'drummer' ? '#9966cc' : '#ff0066'} title="Skills">
                <div className="mt-4">
                  {skills.map((category, catIndex) => (
                    <div key={category.name} className="mb-4 last:mb-0">
                      <h3
                        className="text-sm tracking-widest mb-2 flex items-center gap-2"
                        style={{ color: skillColors[catIndex % 3] }}
                      >
                        <span className="text-lg">{category.icon}</span>
                        {category.name.toUpperCase()}
                      </h3>
                      {category.skills.map((skill) => (
                        <SkillBar
                          key={skill.name}
                          name={skill.name}
                          level={skill.proficiency}
                          color={skillColors[catIndex % 3]}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </ComicPanel>
            )}
          </section>

          {/* Projects as loot */}
          <section className="mb-12">
            <div
              className="text-center mb-6"
              style={{ transform: 'rotate(1deg)' }}
            >
              <h2
                className="text-2xl inline-block px-6 py-2"
                style={{
                  color: '#1a1a1a',
                  background: '#ffcc00',
                  border: '5px solid #1a1a1a',
                  boxShadow: '5px 5px 0 #1a1a1a',
                  textShadow: '2px 2px 0 #ff6600',
                }}
              >
                Projects
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.slice(0, 6).map((project, i) => (
                <LootCard
                  key={project.id}
                  project={project}
                  rarity={project.featured ? (i === 0 ? 'pearlescent' : 'legendary') : i < 3 ? 'rare' : 'common'}
                />
              ))}
            </div>
          </section>

          {/* Companies (Engineer) / Bands (Drummer) */}
          {active === 'engineer' && (
            <section className="mb-12">
              <div className="text-center mb-6" style={{ transform: 'rotate(-1deg)' }}>
                <h2
                  className="text-2xl inline-block px-6 py-2"
                  style={{
                    color: '#1a1a1a',
                    background: '#ffcc00',
                    border: '5px solid #1a1a1a',
                    boxShadow: '5px 5px 0 #1a1a1a',
                  }}
                >
                  Companies
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {COMPANIES.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>
          )}

          {active === 'drummer' && (
            <section className="mb-12">
              <div className="text-center mb-6" style={{ transform: 'rotate(1deg)' }}>
                <h2
                  className="text-2xl inline-block px-6 py-2"
                  style={{
                    color: '#f5f0e0',
                    background: '#9966cc',
                    border: '5px solid #1a1a1a',
                    boxShadow: '5px 5px 0 #1a1a1a',
                  }}
                >
                  Bands
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {BANDS.map((band) => (
                  <BandCard key={band.id} band={band} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-8 text-center">
        <div
          className="inline-block px-8 py-3"
          style={{
            background: '#1a1a1a',
            border: '4px solid #ffcc00',
            boxShadow: '4px 4px 0 #ff6600',
          }}
        >
          <p
            className="text-sm tracking-widest"
            style={{ color: '#ffcc00' }}
          >
            CATCH-A-RIIIIDE!
          </p>
          <p className="text-xs mt-1" style={{ color: '#f5f0e0' }}>
            PANDORA | 2026
          </p>
        </div>
      </footer>

      {/* Animations */}
      <style jsx global>{`
        @keyframes damage-float {
          0% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(-10px); }
          100% { opacity: 0.3; transform: translateY(-20px); }
        }
        .animate-damage-float {
          animation: damage-float 3s ease-out infinite;
        }
      `}</style>
    </div>
  )
}
