import {
  FADED_TEXT,
  IRRADIATED_GREEN,
  NUKA_GLOW,
  NUKA_RED,
  NUKA_RED_DARK,
  TERMINAL_AMBER,
  VAULT_YELLOW,
  VAULT_YELLOW_DIM,
} from './palette'
import { AtomSymbol, BottleCap, NukaColaBottle, RadiationSymbol, VaultBoy, VaultDoor, WastelandSilhouette } from './icons'

// The art separators between sections: Vault-Tec, the wasteland, Nuka-Cola.

export function VaultTecArt() {
  return (
    <div className="py-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-6">
        <div style={{ transform: 'scaleX(-1)' }}>
          <VaultBoy size={60} expression="pointing" />
        </div>
        <VaultDoor size={80} />
        <VaultBoy size={60} expression="pointing" />
      </div>
      <div
        className="font-mono text-sm tracking-[0.5em] uppercase"
        style={{ color: VAULT_YELLOW }}
      >
        Vault-Tec: Prepare for the Future
      </div>
      <div className="flex items-center gap-4">
        {[...Array(5)].map((_, i) => (
          <RadiationSymbol key={i} size={16} color={VAULT_YELLOW_DIM} />
        ))}
      </div>
    </div>
  )
}

export function WastelandArt() {
  return (
    <div className="py-8">
      <WastelandSilhouette />
      <div className="flex justify-center items-center gap-6 -mt-8 relative z-10">
        <AtomSymbol size={40} color={IRRADIATED_GREEN} />
        <div className="text-center">
          <p
            className="font-mono text-sm font-bold"
            style={{
              color: TERMINAL_AMBER,
              textShadow: `0 0 10px ${TERMINAL_AMBER}60`,
            }}
          >
            CAUTION: IRRADIATED ZONE
          </p>
          <p
            className="font-mono text-sm mt-1"
            style={{ color: FADED_TEXT }}
          >
            Radiation Level: Moderate
          </p>
        </div>
        <AtomSymbol size={40} color={IRRADIATED_GREEN} />
      </div>
    </div>
  )
}

export function NukaColaArt() {
  return (
    <div
      className="py-10 flex flex-col items-center gap-4"
      style={{
        background: `linear-gradient(180deg, transparent, ${NUKA_RED}08, transparent)`,
      }}
    >
      <div className="flex items-center gap-8">
        <NukaColaBottle size={70} />
        <div className="text-center">
          <p
            className="font-serif text-2xl font-bold italic"
            style={{
              color: NUKA_RED,
              textShadow: `0 0 15px ${NUKA_GLOW}, 2px 2px 0 ${NUKA_RED_DARK}`,
            }}
          >
            Nuka-Cola
          </p>
          <p
            className="font-serif text-sm mt-1"
            style={{ color: VAULT_YELLOW }}
          >
            Take the taste of Nuka-Cola with you!
          </p>
        </div>
        <NukaColaBottle size={70} />
      </div>
      <div className="flex items-center gap-3">
        {[...Array(7)].map((_, i) => (
          <BottleCap key={i} size={18} />
        ))}
      </div>
    </div>
  )
}
