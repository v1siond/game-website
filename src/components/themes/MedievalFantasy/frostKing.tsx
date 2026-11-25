import { REALM } from './palette'

// The young prince who falls, our own, and what he becomes: the frost king, drawn front on as the world drew
// him before (the spiked pauldrons with their skull ornaments, the skull chest plate, the fur trimmed cape and
// the runeblade held point down in its cold glow), now under a jagged iron crown over a pale face, white hair and
// white eyes; never his face. The prince he was is the same body in silver plate with round pauldrons, fair hair
// under a gold circlet and the kingdom's blue cape, a plain sword in his hand. Drawn in a 200 by 320 box, his
// feet at KING_FEET. The scenes move two parts: his free arm (data-fx `${name}-hand`, turning about KING_HAND_AT)
// and his blade arm (`${name}-blade`, about KING_BLADE_AT), and light the runeblade's glow (`${name}-glow`).
// Also here: his death steed, and the ice throne on its spire of ice where he ends.

export const KING_FEET = { x: 100, y: 312 }
export const KING_HAND_AT = { x: 42, y: 102 }
export const KING_BLADE_AT = { x: 158, y: 102 }

type KingTone = 'frost' | 'prince'

interface Tone {
  plate: string
  plateLight: string
  plateDark: string
  trim: string
  cape: string
  capeInner: string
  skin: string
  hair: string
  eyes: string
}

const TONES: Record<KingTone, Tone> = {
  frost: {
    plate: REALM.night22,
    plateLight: REALM.night15a,
    plateDark: REALM.night9c,
    trim: REALM.earth48,
    cape: REALM.night6,
    capeInner: REALM.night7a,
    skin: REALM.frostPale,
    hair: REALM.frostFrostWhite,
    eyes: REALM.frostIceBright,
  },
  prince: {
    plate: REALM.steelLight,
    plateLight: REALM.steel,
    plateDark: REALM.steelShade,
    trim: REALM.princeGold,
    cape: REALM.kingdomBlueDeep,
    capeInner: REALM.kingdomBlue,
    skin: REALM.ember71,
    hair: REALM.princeGold,
    eyes: REALM.night9c,
  },
}

/** The runeblade, point down from its hilt at the origin: the cold glow, the serrated blade and its runes, the
 *  skull crossguard. */
function Runeblade({ name }: { name: string }) {
  return (
    <g>
      <ellipse data-fx={`${name}-glow`} cx="0" cy="96" rx="26" ry="110" fill={REALM.frostIceBright} opacity="0.15" />
      <path d="M0,15 L8,25 L11,70 L10,140 L7,190 L0,210 L-7,190 L-10,140 L-11,70 L-8,25 Z" fill={REALM.frostIceMid} stroke={REALM.frostIceDark} strokeWidth="2" />
      <path d="M0,25 L4,35 L4,135 L0,160 L-4,135 L-4,35 Z" fill={REALM.frostIceBright} opacity="0.6" />
      <path d="M10,60 L18,52 L13,72 Z M-10,60 L-18,52 L-13,72 Z M10,110 L17,102 L12,122 Z M-10,110 L-17,102 L-12,122 Z" fill={REALM.frostIceMid} />
      <path d="M0,50 L3,60 L0,70 L-3,60 Z M0,95 L4,108 L0,121 L-4,108 Z M0,145 L3,156 L0,167 L-3,156 Z" fill={REALM.ash100} />
      <path d="M-30,8 L0,15 L30,8 L24,20 L0,25 L-24,20 Z" fill={REALM.night15a} stroke={REALM.earth48} strokeWidth="2" />
      <ellipse cx="0" cy="12" rx="8" ry="6" fill={REALM.night9c} />
      <circle cx="-4" cy="10" r="2" fill={REALM.frostIceBright} />
      <circle cx="4" cy="10" r="2" fill={REALM.frostIceBright} />
      <rect x="-5" y="-8" width="10" height="20" fill={REALM.night7a} rx="2" />
      <circle cx="0" cy="-14" r="7" fill={REALM.night15a} stroke={REALM.earth48} strokeWidth="1.5" />
    </g>
  )
}

/** The prince's own sword, point down from its hilt at the origin. */
function PrinceSword() {
  return (
    <g>
      <path d="M-5,20 L5,20 L6,170 L0,190 L-6,170 Z" fill={REALM.steelLight} stroke={REALM.stone22} strokeWidth="2" />
      <path d="M-24,12 H24 V20 H-24 Z" fill={REALM.princeGold} />
      <rect x="-4" y="-10" width="8" height="22" fill={REALM.ember21} />
      <circle cx="0" cy="-14" r="6" fill={REALM.princeGold} />
    </g>
  )
}

function Pauldron({ cx, tone, spiked }: { cx: number; tone: Tone; spiked: boolean }) {
  const out = cx < 100 ? -1 : 1
  return (
    <g>
      <ellipse cx={cx} cy="88" rx="28" ry="18" fill={tone.plate} stroke={tone.trim} strokeWidth="2" />
      <ellipse cx={cx} cy="90" rx="22" ry="12" fill={tone.plateLight} />
      {spiked && (
        <>
          <path d={`M${cx + out * 20},82 L${cx + out * 30},55 L${cx + out * 15},78 Z M${cx + out * 10},78 L${cx + out * 23},48 L${cx + out * 7},74 Z M${cx},75 L${cx + out * 7},42 L${cx - out * 5},72 Z M${cx - out * 10},78 L${cx - out * 13},48 L${cx - out * 7},74 Z`} fill={tone.plate} stroke={tone.plateDark} strokeWidth="1.5" />
          <circle cx={cx + out * 30} cy="57" r="3" fill={tone.trim} />
          <circle cx={cx + out * 23} cy="50" r="2.5" fill={tone.trim} />
          <circle cx={cx + out * 7} cy="44" r="3" fill={tone.trim} />
          <circle cx={cx} cy="92" r="6" fill={tone.plateDark} />
          <circle cx={cx - 3} cy="90" r="1.5" fill={tone.eyes} />
          <circle cx={cx + 3} cy="90" r="1.5" fill={tone.eyes} />
        </>
      )}
    </g>
  )
}

function Head({ tone, crowned }: { tone: Tone; crowned: boolean }) {
  return (
    <g>
      <path d="M74,40 Q70,96 62,112 L80,104 Q78,70 84,46 Z M126,40 Q130,96 138,112 L120,104 Q122,70 116,46 Z" fill={tone.hair} />
      <ellipse cx="100" cy="45" rx="22" ry="27" fill={tone.skin} stroke={tone.plateDark} strokeWidth="1.5" />
      <path d="M76,40 Q76,12 100,10 Q124,12 124,40 Q114,26 100,26 Q86,26 76,40 Z" fill={tone.hair} />
      <path d="M84,36 L96,39 M104,39 L116,36" stroke={tone.plateDark} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="90" cy="44" rx="4.5" ry="3" fill={tone.eyes} />
      <ellipse cx="110" cy="44" rx="4.5" ry="3" fill={tone.eyes} />
      <path d="M100,48 L97,58 L103,58 Z" fill={tone.plateDark} opacity="0.4" />
      <path d="M93,64 Q100,62 107,64" stroke={tone.plateDark} strokeWidth="2" fill="none" />
      {crowned ? (
        <path d="M74,24 L70,-4 L82,16 L86,-14 L94,12 L100,-22 L106,12 L114,-14 L118,16 L130,-4 L126,24 Q100,16 74,24 Z" fill={REALM.night22} stroke={REALM.frostIceMid} strokeWidth="2" />
      ) : (
        <path d="M76,24 Q100,14 124,24 L124,30 Q100,20 76,30 Z" fill={REALM.princeGold} />
      )}
      {crowned && <circle cx="100" cy="10" r="5" fill={REALM.frostIceBright} />}
    </g>
  )
}

/** The frost king, or the prince he was (`tone`), named `name` for the parts a scene moves. */
export function FrostKing({ name, tone = 'frost' }: { name: string; tone?: KingTone }) {
  const t = TONES[tone]
  const fallen = tone === 'frost'
  return (
    <g data-fx={name}>
      <path d="M55,95 Q20,150 12,240 L8,310 L192,310 L188,240 Q180,150 145,95" fill={t.cape} />
      <path d="M60,100 Q28,155 22,235 L18,305 L182,305 L178,235 Q172,155 140,100" fill={t.capeInner} />
      {fallen && <path d="M8,310 L20,296 L32,312 L46,296 L60,312 L74,298 L88,312 L102,298 L116,312 L130,298 L144,312 L158,298 L172,312 L186,296 L192,310 Z" fill={t.cape} />}
      <path d="M60,215 L50,265 L45,305 L75,310 L82,272 L88,220 Z M112,215 L118,272 L125,310 L155,305 L150,265 L140,220 Z" fill={t.plate} stroke={t.plateDark} strokeWidth="2" />
      <path d="M50,265 L82,270 M150,265 L118,270" stroke={t.trim} strokeWidth="2.5" fill="none" />
      <ellipse cx="70" cy="232" rx="14" ry="10" fill={t.plateLight} />
      <ellipse cx="130" cy="232" rx="14" ry="10" fill={t.plateLight} />
      <ellipse cx="60" cy="308" rx="18" ry="7" fill={REALM.stone7} />
      <ellipse cx="140" cy="308" rx="18" ry="7" fill={REALM.stone7} />
      <path d="M60,92 L68,75 L100,68 L132,75 L140,92 L145,160 L135,200 L100,210 L65,200 L55,160 Z" fill={t.plate} stroke={t.plateDark} strokeWidth="2" />
      <path d="M60,92 L68,75 L100,68 L132,75 L140,92 M65,200 L100,210 L135,200" stroke={t.trim} strokeWidth="2.5" fill="none" />
      <path d="M75,95 L100,85 L125,95 L125,145 L100,160 L75,145 Z" fill={t.plateDark} stroke={t.trim} strokeWidth="1.5" />
      {fallen ? (
        <g>
          <ellipse cx="100" cy="125" rx="15" ry="12" fill={REALM.night22} />
          <ellipse cx="100" cy="123" rx="12" ry="10" fill={REALM.earth74} />
          <ellipse cx="94" cy="120" rx="4" ry="3" fill={REALM.night9c} />
          <ellipse cx="106" cy="120" rx="4" ry="3" fill={REALM.night9c} />
          <ellipse cx="94" cy="120" rx="2" ry="1.5" fill={REALM.frostIceBright} />
          <ellipse cx="106" cy="120" rx="2" ry="1.5" fill={REALM.frostIceBright} />
          <path d="M100,126 L97,132 L103,132 Z" fill={REALM.night9c} />
        </g>
      ) : (
        <path d="M100,104 L104,118 L118,120 L106,128 L110,142 L100,134 L90,142 L94,128 L82,120 L96,118 Z" fill={REALM.princeGold} />
      )}
      <rect x="60" y="175" width="80" height="15" fill={t.plateLight} stroke={t.trim} strokeWidth="1.5" />
      <ellipse cx="100" cy="182" rx="10" ry="7" fill={fallen ? REALM.earth74 : REALM.princeGold} />
      <Pauldron cx={45} tone={t} spiked={fallen} />
      <Pauldron cx={155} tone={t} spiked={fallen} />
      <g data-fx={`${name}-hand`}>
        <path d="M32,100 L15,138 L8,180 L32,185 L42,145 L52,105 Z" fill={t.plate} stroke={t.plateDark} strokeWidth="2" />
        <path d="M15,138 L42,143" stroke={t.trim} strokeWidth="2" />
        <path d="M8,180 L0,168 L18,175 Z M15,178 L5,165 L22,172 Z" fill={t.plateLight} />
      </g>
      <g data-fx={`${name}-blade`}>
        <path d="M168,100 L185,138 L192,175 L168,180 L158,142 L148,105 Z" fill={t.plate} stroke={t.plateDark} strokeWidth="2" />
        <path d="M185,138 L158,143" stroke={t.trim} strokeWidth="2" />
        <ellipse cx="185" cy="178" rx="12" ry="10" fill={t.plateLight} stroke={t.trim} strokeWidth="1.5" />
        <g transform="translate(185, 175) rotate(-5)">{fallen ? <Runeblade name={name} /> : <PrinceSword />}</g>
      </g>
      <ellipse cx="100" cy="68" rx="18" ry="7" fill={t.plateLight} stroke={t.trim} strokeWidth="1.5" />
      <Head tone={t} crowned={fallen} />
    </g>
  )
}

/** His death steed, from the old frost realm: an armoured dead horse, a skull head with blue fire in its eyes and
 *  nostrils, a mane and tail of cold smoke; about 280 long, its hooves on the origin's line, facing left. */
export function DeathSteed({ name }: { name: string }) {
  const hoof = (x: number) => <path d={`M${x - 6},0 L${x + 6},0 L${x + 5},-8 L${x - 5},-8 Z`} fill={REALM.stone7} />
  return (
    <g data-fx={name} transform="translate(-110 -262)">
      <ellipse cx="110" cy="262" rx="120" ry="14" fill={REALM.frostIceMid} opacity="0.18" />
      <path d="M145,130 L152,165 L156,210 L160,252 L150,254 L144,215 L140,170 L138,135 Z M165,125 L175,158 L180,200 L184,248 L174,250 L168,205 L162,162 L158,130 Z" fill={REALM.night22} />
      <path d="M50,140 L44,175 L38,215 L34,256 L44,258 L50,220 L56,180 L58,145 Z M70,135 L65,170 L60,210 L55,252 L65,254 L72,215 L78,175 L76,140 Z" fill={REALM.night15a} />
      <g transform="translate(0 262)">
        {hoof(40)}
        {hoof(60)}
        {hoof(155)}
        {hoof(179)}
      </g>
      <path d="M50,115 Q30,110 35,135 L50,145 L65,120 Q95,95 125,95 Q160,95 180,115 L195,140 Q200,120 188,105 Q170,85 125,80 Q80,85 50,115 Z" fill={REALM.night22} />
      <path d="M65,140 Q120,160 175,140 L175,125 Q120,140 65,125 Z" fill={REALM.night12a} />
      <path d="M75,100 Q125,80 175,105 L168,118 Q125,100 82,118 Z" fill={REALM.night15a} stroke={REALM.frostIceMid} strokeWidth="1.5" />
      <circle cx="125" cy="102" r="5" fill="none" stroke={REALM.frostIceMid} strokeWidth="1.5" />
      <path d="M50,115 L25,80 L10,55 L30,45 L50,65 L65,105 Z" fill={REALM.night22} />
      <g transform="translate(5, 40)">
        <path d="M5,20 L-10,5 L-25,-15 L-30,-40 L-22,-50 L-5,-45 L12,-35 L20,-15 L25,10 Z" fill={REALM.earth74} stroke={REALM.night15a} strokeWidth="2" />
        <path d="M-5,-8 L8,-28 M15,-18 L-5,-42" stroke={REALM.night15a} strokeWidth="3" fill="none" />
        <ellipse cx="0" cy="-22" rx="7" ry="5" fill={REALM.stone5a} />
        <ellipse cx="0" cy="-22" rx="4" ry="3" fill={REALM.frostIceBright} />
        <ellipse cx="12" cy="-30" rx="14" ry="6" fill={REALM.frostIceMid} opacity="0.35" />
        <ellipse cx="-32" cy="-52" rx="9" ry="5" fill={REALM.frostIceMid} opacity="0.3" />
        <path d="M12,-35 L18,-55 L26,-42 L18,-32 Z" fill={REALM.night22} />
      </g>
      <path d="M30,45 Q50,15 38,-15 Q65,10 58,45 Z" fill={REALM.frostIceDark} opacity="0.5" />
      <path d="M42,55 Q68,15 62,-20 M52,70 Q78,30 72,0" stroke={REALM.frostIceMid} strokeWidth="3" fill="none" opacity="0.45" />
      <path d="M200,120 Q225,115 245,135 Q240,160 215,155 Q222,135 200,128 Z" fill={REALM.frostIceDark} opacity="0.45" />
    </g>
  )
}

/** The ice throne on its spire, from the old frost realm: stepped ice, the flanking spires, the seat cut into the
 *  central spire and its crown of light (`${name}-crown`); about 640 wide and 560 high over the origin's line. */
export function IceThrone({ name }: { name: string }) {
  return (
    <g data-fx={name}>
      <ellipse cx="0" cy="-360" rx="300" ry="220" fill={REALM.frostIceMid} opacity="0.1" />
      <path d="M-320,0 L-270,-160 L-210,-110 L-130,-260 L-60,-210 L0,-400 L60,-210 L130,-260 L210,-110 L270,-160 L320,0 Z" fill={REALM.night21} stroke={REALM.frostIceDark} strokeWidth="3" />
      <path d="M-290,0 L-240,-90 L-160,-60 L-80,-150 L80,-150 L160,-60 L240,-90 L290,0 Z" fill={REALM.night17} />
      <path d="M-350,0 L-320,-64 L-256,-40 L-160,-96 L160,-96 L256,-40 L320,-64 L350,0 Z" fill={REALM.night14} stroke={REALM.frostIceDark} strokeWidth="2" />
      <path d="M-256,-20 L-192,-60 L-112,-36 L112,-36 L192,-60 L256,-20 L256,0 L-256,0 Z" fill={REALM.night12} />
      <path d="M-200,-120 L-176,-280 L-160,-232 L-136,-360 L-120,-264 L-96,-120 Z M96,-120 L120,-264 L136,-360 L160,-232 L176,-280 L200,-120 Z" fill={REALM.night19} stroke={REALM.frostIceDark} strokeWidth="2" />
      <path d="M-152,-330 L-136,-360 L-120,-320 Z M120,-320 L136,-360 L152,-330 Z" fill={REALM.frostIceMid} opacity="0.7" />
      <path d="M-80,-150 L-56,-280 L-32,-232 L0,-440 L32,-232 L56,-280 L80,-150 Z" fill={REALM.night23} stroke={REALM.frostIceMid} strokeWidth="2" />
      <path d="M-56,-170 L-32,-300 L0,-420 L32,-300 L56,-170 Z" fill={REALM.frostIceDark} opacity="0.8" />
      <path d="M-44,-150 L-44,-250 Q0,-300 44,-250 L44,-150 Z" fill={REALM.night9c} stroke={REALM.frostIceMid} strokeWidth="2" />
      <path d="M-32,-208 L0,-392 L32,-208 Z" fill={REALM.frostIceMid} opacity="0.55" />
      <path d="M-48,-160 L0,-400 L48,-160" stroke={REALM.frostIceBright} strokeWidth="1.5" fill="none" opacity="0.35" />
      <g data-fx={`${name}-crown`} opacity="0.4">
        <ellipse cx="0" cy="-430" rx="60" ry="46" fill={REALM.frostIceBright} opacity="0.5" />
        <path d="M-20,-400 L0,-470 L20,-400 Z" fill={REALM.frostIceBright} />
        <ellipse cx="0" cy="-440" rx="22" ry="18" fill={REALM.ash100} opacity="0.6" />
      </g>
    </g>
  )
}
