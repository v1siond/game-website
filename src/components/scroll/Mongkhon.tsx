// The mongkhon, the corded ring a Muay Thai fighter wears on his head: the cord across his brow over
// the hair and its tail standing up behind, drawn in HeroFigure's overHair slot. A world passes its cord
// colour and, for a wound cord, the colour of the binding showing through.

interface MongkhonProps {
  cord: string
  binding?: string
}

const BROW = 'M21.4 13 Q32 7.4 42.6 13'
const TAIL = 'M41.6 11.8 Q47 6 49 1.5'

export function Mongkhon({ cord, binding }: MongkhonProps) {
  return (
    <>
      <path d={BROW} fill="none" stroke={cord} strokeWidth={2.4} strokeLinecap="round" />
      <path d={TAIL} fill="none" stroke={cord} strokeWidth={1.8} strokeLinecap="round" />
      {binding && <path d={BROW} fill="none" stroke={binding} strokeWidth={0.7} strokeDasharray="2 2" />}
    </>
  )
}
