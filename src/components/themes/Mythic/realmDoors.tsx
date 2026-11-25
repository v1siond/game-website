// The bronze doors of the temple on the mountain of the gods, drawn once: an arched opening with an ink rim
// and two leaves of bronze banded in gold, a key pattern cut in each, that open by folding toward their
// hinges. The last door (gate.tsx) uses it; the caller places the arch, sets what shows behind the leaves and passes the leaf
// classes that time their opening.

// The key pattern cut in a leaf, in gold.
function KeyPattern() {
  return (
    <svg viewBox="0 0 20 40" className="absolute left-1/2 top-1/3 h-16 w-8 -translate-x-1/2" aria-hidden="true">
      <path d="M2 38 V2 H18 V30 H6 V10 H14 V22 H10" fill="none" stroke="var(--myth-gold)" strokeWidth={2.4} strokeLinecap="square" />
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
      <div className={`absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--myth-ink)] bg-[repeating-linear-gradient(180deg,transparent_0_46px,var(--myth-gold-deep)_46px_54px),linear-gradient(90deg,var(--myth-bronze),var(--myth-bronze-shade))] ${leaves.left}`}>
        <KeyPattern />
      </div>
      <div className={`absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--myth-ink)] bg-[repeating-linear-gradient(180deg,transparent_0_46px,var(--myth-gold-deep)_46px_54px),linear-gradient(270deg,var(--myth-bronze),var(--myth-bronze-shade))] ${leaves.right}`}>
        <KeyPattern />
      </div>
    </div>
  )
}
