// The carved wooden doors of a realm, drawn once: an arched opening with an ink rim and two leaves of dark
// wood banded in iron, a rune cut in each, that open by folding toward their hinges. The last door
// (gate.tsx) uses it; the caller places the arch, sets what shows behind the leaves and passes the leaf
// classes that time their opening.

// The rune cut in a leaf, lit with frost.
function Rune() {
  return (
    <svg viewBox="0 0 20 40" className="absolute left-1/2 top-1/3 h-16 w-8 -translate-x-1/2" aria-hidden="true">
      <path d="M10 2 V38 M10 12 L2 4 M10 12 L18 4 M10 24 L3 32 M10 24 L17 32" fill="none" stroke="var(--myth-frost)" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  )
}

interface RealmDoorsProps {
  // the arch's placement, rim width and the light behind the leaves
  className: string
  leaves: { left: string; right: string }
}

export function RealmDoors({ className, leaves }: RealmDoorsProps) {
  return (
    <div className={`overflow-hidden rounded-t-full border-[var(--myth-ink)] ${className}`}>
      <div className={`absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--myth-ink)] bg-[repeating-linear-gradient(180deg,transparent_0_46px,var(--myth-iron)_46px_54px),linear-gradient(90deg,var(--myth-wood),var(--myth-wood-shade))] ${leaves.left}`}>
        <Rune />
      </div>
      <div className={`absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--myth-ink)] bg-[repeating-linear-gradient(180deg,transparent_0_46px,var(--myth-iron)_46px_54px),linear-gradient(270deg,var(--myth-wood),var(--myth-wood-shade))] ${leaves.right}`}>
        <Rune />
      </div>
    </div>
  )
}
