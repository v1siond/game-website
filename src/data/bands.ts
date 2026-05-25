// Musical projects / bands

export interface Band {
  id: string
  name: string
  genre: string
  role: string
  url: string | null
  active: boolean
  description: string
}

export const BANDS: Band[] = [
  {
    id: 'eon',
    name: 'Eon',
    genre: 'Progressive Metal',
    role: 'Drummer',
    url: 'http://eonband.net/',
    active: true,
    description: 'Progressive metal with complex time signatures and atmospheric soundscapes.',
  },
  {
    id: 'sycsemper',
    name: 'Sycsemper',
    genre: 'Metal',
    role: 'Drummer',
    url: null, // Coming soon
    active: true,
    description: 'Heavy metal project exploring darker sonic territories.',
  },
  {
    id: 'retrogroove',
    name: 'Retrogroove',
    genre: 'Funk/Soul',
    role: 'Drummer',
    url: 'https://retrogrooveband.netlify.app/',
    active: true,
    description: 'Funk and soul covers with a modern twist. Groove is everything.',
  },
]
