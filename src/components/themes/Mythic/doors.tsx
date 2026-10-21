// The bronze double doors of the underworld, drawn once: an arched opening with an ink rim and two
// bronze leaves that open by folding toward their hinges. A chamber's doorway (chambers.tsx) and the last
// gate (gate.tsx) both use it; the caller places the arch, sets what shows behind the leaves and passes
// the leaf classes that time their opening.

interface BronzeDoorsProps {
  // the arch's placement, rim width and the light behind the leaves
  className: string
  leaves: { left: string; right: string }
}

export function BronzeDoors({ className, leaves }: BronzeDoorsProps) {
  return (
    <div className={`overflow-hidden rounded-t-full border-[var(--myth-ink)] ${className}`}>
      <div className={`absolute inset-y-0 left-0 w-1/2 border-r-2 border-[var(--myth-ink)] bg-[linear-gradient(90deg,var(--myth-bronze),var(--myth-gold-deep))] ${leaves.left}`} />
      <div className={`absolute inset-y-0 right-0 w-1/2 border-l-2 border-[var(--myth-ink)] bg-[linear-gradient(270deg,var(--myth-bronze),var(--myth-gold-deep))] ${leaves.right}`} />
    </div>
  )
}
