import {
  NUKA_RED,
  PANEL_BG,
  PIPBOY_GREEN,
  PIPBOY_GREEN_DIM,
  PIPBOY_GREEN_GLOW,
  PIPBOY_SCREEN_BG,
  RUST_DARK,
  RUST_ORANGE,
  TERMINAL_BG,
  VAULT_BG,
  VAULT_BLUE,
  VAULT_BLUE_DARK,
  VAULT_YELLOW,
  VAULT_YELLOW_DIM,
  WASTELAND_BROWN,
  WASTELAND_BROWN_DARK,
  WASTELAND_BROWN_MED,
  hazardStripes,
  pipboyScreenBg,
  rustTexture,
  wornPaperBg,
} from './palette'
import { RadiationSymbol, VaultBoy } from './icons'

// The section panels: the Pip-Boy frame, the Vault-Tec panel, the rusted panel and the worn document.

export function PipBoyFrame({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative rounded-lg overflow-hidden"
      aria-label={title}
    >
      {/* Screen background with CRT effect */}
      <div
        className="absolute inset-0"
        style={{
          background: pipboyScreenBg,
          backgroundColor: TERMINAL_BG,
        }}
      />

      {/* Green glow border */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          border: `3px solid ${PIPBOY_GREEN}`,
          boxShadow: `
            0 0 20px ${PIPBOY_GREEN_GLOW},
            inset 0 0 40px ${PIPBOY_SCREEN_BG},
            inset 0 0 80px ${PIPBOY_GREEN}10
          `,
        }}
      />

      {/* Corner brackets (Pip-Boy UI style) */}
      {[
        'top-2 left-2',
        'top-2 right-2 rotate-90',
        'bottom-2 left-2 -rotate-90',
        'bottom-2 right-2 rotate-180'
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${pos}`}
          style={{
            borderLeft: `2px solid ${PIPBOY_GREEN}`,
            borderTop: `2px solid ${PIPBOY_GREEN}`,
          }}
        />
      ))}

      {/* Title bar */}
      <div
        className="absolute -top-px left-6 px-4 py-1 flex items-center gap-2"
        style={{ background: TERMINAL_BG }}
      >
        <span className="font-mono text-sm" style={{ color: PIPBOY_GREEN_DIM }}>&gt;&gt;</span>
        <h2
          className="font-mono text-sm font-bold uppercase tracking-[0.3em]"
          style={{
            color: PIPBOY_GREEN,
            textShadow: `0 0 10px ${PIPBOY_GREEN_GLOW}`,
          }}
        >
          {title}
        </h2>
        <span className="font-mono text-sm" style={{ color: PIPBOY_GREEN_DIM }}>&lt;&lt;</span>
      </div>

      <div className="relative pt-8 pb-6 px-6">
        {children}
      </div>
    </section>
  )
}

export function VaultTecPanel({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label={title}
    >
      {/* Vault-Tec blue background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${VAULT_BLUE_DARK} 0%, ${VAULT_BLUE} 50%, ${VAULT_BLUE_DARK} 100%)`,
        }}
      />

      {/* Yellow border */}
      <div
        className="absolute inset-0"
        style={{
          border: `3px solid ${VAULT_YELLOW}`,
          boxShadow: `inset 0 0 30px ${VAULT_BLUE_DARK}`,
        }}
      />

      {/* Header bar */}
      <div
        className="relative flex items-center justify-center gap-4 py-3 border-b-2"
        style={{
          background: `linear-gradient(90deg, ${VAULT_YELLOW}, ${VAULT_YELLOW_DIM}, ${VAULT_YELLOW})`,
          borderColor: VAULT_BLUE_DARK,
        }}
      >
        <VaultBoy size={30} expression="thumbsUp" />
        <h2
          className="font-mono text-sm font-bold uppercase tracking-[0.4em]"
          style={{ color: VAULT_BLUE_DARK }}
        >
          {title}
        </h2>
        <VaultBoy size={30} expression="thumbsUp" />
      </div>

      <div className="relative py-6 px-6">
        {children}
      </div>
    </section>
  )
}

export function RustedPanel({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label={title}
    >
      {/* Rusted metal texture */}
      <div
        className="absolute inset-0"
        style={{
          background: rustTexture,
          backgroundColor: PANEL_BG,
        }}
      />

      {/* Rust border with bolts */}
      <div
        className="absolute inset-0"
        style={{
          border: `3px solid ${RUST_ORANGE}`,
          boxShadow: `inset 0 0 25px ${RUST_DARK}60`,
        }}
      />

      {/* Corner bolts/rivets */}
      {['top-1 left-1', 'top-1 right-1', 'bottom-1 left-1', 'bottom-1 right-1'].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full ${pos}`}
          style={{
            background: `radial-gradient(circle at 35% 35%, ${WASTELAND_BROWN}, ${RUST_DARK})`,
            border: `2px solid ${RUST_DARK}`,
            boxShadow: `inset 1px 1px 2px ${VAULT_YELLOW}30`,
          }}
        />
      ))}

      {/* Title with hazard stripes */}
      <div
        className="absolute -top-3 left-8 px-4 py-1 flex items-center gap-2"
        style={{
          background: hazardStripes,
          backgroundColor: TERMINAL_BG,
          border: `2px solid ${VAULT_YELLOW}`,
        }}
      >
        <RadiationSymbol size={14} color={VAULT_YELLOW} />
        <h2
          className="font-mono text-sm font-bold uppercase tracking-[0.25em]"
          style={{
            color: VAULT_YELLOW,
            textShadow: `0 0 6px ${VAULT_YELLOW}60`,
          }}
        >
          {title}
        </h2>
      </div>

      <div className="relative pt-10 pb-6 px-6">
        {children}
      </div>
    </section>
  )
}

export function WornDocumentPanel({
  children,
  title
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section
      className="relative overflow-hidden"
      aria-label={title}
    >
      {/* Worn paper texture */}
      <div
        className="absolute inset-0"
        style={{
          background: wornPaperBg,
          backgroundColor: VAULT_BG,
        }}
      />

      {/* Aged border */}
      <div
        className="absolute inset-0"
        style={{
          border: `2px solid ${WASTELAND_BROWN_MED}`,
          boxShadow: `inset 0 0 30px ${WASTELAND_BROWN_DARK}40`,
        }}
      />

      {/* Stamped header */}
      <div className="relative px-6 pt-4 pb-2 border-b" style={{ borderColor: WASTELAND_BROWN_MED }}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono px-2 py-1" style={{
            border: `1px solid ${NUKA_RED}`,
            color: NUKA_RED,
            transform: 'rotate(-3deg)',
          }}>
            CLASSIFIED
          </span>
          <h2
            className="font-mono text-sm font-bold uppercase tracking-wider"
            style={{ color: WASTELAND_BROWN }}
          >
            {title}
          </h2>
        </div>
      </div>

      <div className="relative py-4 px-6">
        {children}
      </div>
    </section>
  )
}
