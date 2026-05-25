import { Profession } from '@/contexts/ProfessionContext'
import { TECH_STACK, TechCategory } from './techStack'

export interface Skill {
  name: string
  proficiency: number // 1-5, kept for themes that want visual indicators
}

export interface SkillCategory {
  name: string
  profession: Profession
  skills: Skill[]
  icon?: string
}

// Engineer uses the comprehensive tech stack (no proficiency bars)
export function getEngineerSkills(): TechCategory[] {
  return TECH_STACK
}

// Drummer and Fighter skills with proficiency for visual themes
export const SKILLS_DATA: SkillCategory[] = [
  // Drummer skills
  {
    name: 'Genres',
    profession: 'drummer',
    icon: '🎵',
    skills: [
      { name: 'Rock/Metal', proficiency: 5 },
      { name: 'Progressive', proficiency: 5 },
      { name: 'Latin/Salsa', proficiency: 4 },
      { name: 'Jazz Fusion', proficiency: 4 },
      { name: 'Funk/Soul', proficiency: 5 },
    ],
  },
  {
    name: 'Techniques',
    profession: 'drummer',
    icon: '🥁',
    skills: [
      { name: 'Double Bass', proficiency: 5 },
      { name: 'Polyrhythms', proficiency: 4 },
      { name: 'Odd Time Signatures', proficiency: 4 },
      { name: 'Ghost Notes', proficiency: 5 },
      { name: 'Linear Drumming', proficiency: 4 },
    ],
  },
  {
    name: 'Experience',
    profession: 'drummer',
    icon: '🎤',
    skills: [
      { name: 'Studio Recording', proficiency: 5 },
      { name: 'Live Touring', proficiency: 5 },
      { name: 'Session Work', proficiency: 4 },
      { name: 'Music Production', proficiency: 3 },
    ],
  },
  // Fighter skills
  {
    name: 'Disciplines',
    profession: 'fighter',
    icon: '🥊',
    skills: [
      { name: 'Muay Thai (3 years)', proficiency: 4 },
      { name: 'Brazilian Jiu-Jitsu (2 years)', proficiency: 4 },
      { name: 'MMA (1 year)', proficiency: 3 },
      { name: 'Wrestling', proficiency: 3 },
    ],
  },
  {
    name: 'Specialties',
    profession: 'fighter',
    icon: '⚔️',
    skills: [
      { name: 'Striking', proficiency: 4 },
      { name: 'Clinch Work', proficiency: 4 },
      { name: 'Ground Game', proficiency: 4 },
      { name: 'Submissions', proficiency: 4 },
    ],
  },
  {
    name: 'Teaching',
    profession: 'fighter',
    icon: '🎓',
    skills: [
      { name: 'Fundamentals Instruction', proficiency: 5 },
      { name: 'Competition Prep', proficiency: 4 },
      { name: 'Self Defense', proficiency: 5 },
      { name: 'Private Coaching', proficiency: 4 },
    ],
  },
]

export function getSkillsByProfession(profession: Profession): SkillCategory[] {
  return SKILLS_DATA.filter(cat => cat.profession === profession)
}
