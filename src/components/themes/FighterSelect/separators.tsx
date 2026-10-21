import { ClashEmblem, KoBadge, WinOrb } from './badges'

// The art between sections: the HUD's life bar run across the page with the KO badge at its heart, the
// VS burst, and a band of three round win orbs like the rounds of a match.

export function LightningLine() {
  return (
    <div className="my-10 flex items-center gap-2" aria-hidden="true">
      <span className="h-3 flex-1 border-2 border-black bg-[color:var(--fs-hud-yellow)] shadow-[0_0_0_1px_#fff]" />
      <KoBadge />
      <span className="h-3 flex-1 border-2 border-black bg-[color:var(--fs-hud-red)] shadow-[0_0_0_1px_#fff]" />
    </div>
  )
}

export function ClashSeparator() {
  return (
    <div className="flex justify-center py-8">
      <ClashEmblem large />
    </div>
  )
}

export function RoundWins() {
  return (
    <div className="my-8 flex h-16 items-center justify-center gap-6" aria-hidden="true">
      {[0, 1, 2].map((win) => (
        <WinOrb key={win} className="h-8 w-8" />
      ))}
    </div>
  )
}
