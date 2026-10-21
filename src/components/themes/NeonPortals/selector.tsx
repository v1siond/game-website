import type { ProfessionOption } from '@/components/cv/ProfessionSwitch'
import type { Profession } from '@/lib/cv/professions'
import styles from './scenes.module.css'

// One portal per profession. ProfessionSwitch owns the order (Musician, System Engineer, Martial
// Artist), the pick and the keyboard; each portal only draws itself. The picked portal opens: its rim
// lights and the swirl inside it turns (the swirl stops under reduced motion, in scenes.module.css).

const PORTAL_LOOK: Record<Profession, { rim: string; text: string; swirl: string }> = {
  drummer: { rim: 'border-[#ff9a00]', text: 'text-[#ff9a00]', swirl: 'border-t-[#ff9a00] border-b-[#ff9a00]/40' },
  engineer: { rim: 'border-[#00a2ff]', text: 'text-[#00a2ff]', swirl: 'border-t-[#00a2ff] border-b-[#00a2ff]/40' },
  fighter: { rim: 'border-[#b57bff]', text: 'text-[#b57bff]', swirl: 'border-t-[#b57bff] border-b-[#b57bff]/40' },
}

const PORTAL_GLYPH: Record<Profession, string> = { drummer: '///', engineer: '</>', fighter: '+ +' }

export function PortalSelector({ option }: { option: ProfessionOption }) {
  const { id: profession, label, selected, optionProps } = option
  const look = PORTAL_LOOK[profession]

  return (
    <button
      type="button"
      {...optionProps}
      className={`relative flex flex-col items-center gap-2 p-2 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:p-4 ${
        selected ? 'scale-105' : 'hover:scale-[1.02]'
      }`}
    >
      <span
        className={`relative flex h-[110px] w-20 items-center justify-center rounded-[50%] border-[3px] bg-[#07060f] ${look.rim} ${
          selected ? '' : 'border-opacity-50'
        }`}
        aria-hidden="true"
      >
        {selected && (
          <span className={`absolute inset-2 rounded-[50%] border-2 border-transparent ${look.swirl} ${styles.swirl}`} />
        )}
        <span className={`relative font-mono text-lg ${look.text}`}>{PORTAL_GLYPH[profession]}</span>
      </span>

      <span className={`text-center text-sm font-medium uppercase tracking-[0.1em] ${look.text}`}>{label}</span>
      {selected && (
        <span className={`h-0.5 w-8 ${look.text} bg-current`} aria-hidden="true" />
      )}
    </button>
  )
}
