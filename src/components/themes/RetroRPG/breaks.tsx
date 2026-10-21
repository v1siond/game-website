import { CT_COLORS } from './palette'
import { CronoPixelArt, EpochPixelArt, EraBadge, FrogPixelArt, LavosEye, MarlePixelArt, TimePortal } from './art'

// =============================================================================
// ART SECTIONS - CHRONO TRIGGER THEMED
// =============================================================================

// Character Party Display
export function CharacterParty() {
  return (
    <div className="py-10 border-t-4 border-b-4 my-8" style={{ borderColor: CT_COLORS.portalBlue + '40' }}>
      <p className="text-center text-xs mb-8 tracking-widest" style={{ color: CT_COLORS.portalMagenta }}>
        ◈ The party gathers through time... ◈
      </p>
      <div className="flex justify-center items-end gap-12 flex-wrap">
        <div className="text-center">
          <CronoPixelArt size={48} />
          <p className="text-[10px] mt-3 tracking-wider" style={{ color: CT_COLORS.cronoOrange }}>CRONO</p>
          <p className="text-[8px] mt-1" style={{ color: CT_COLORS.silver }}>Leader</p>
        </div>
        <div className="text-center">
          <MarlePixelArt size={48} />
          <p className="text-[10px] mt-3 tracking-wider" style={{ color: CT_COLORS.marleBlue }}>MARLE</p>
          <p className="text-[8px] mt-1" style={{ color: CT_COLORS.silver }}>Princess</p>
        </div>
        <div className="text-center">
          <FrogPixelArt size={48} />
          <p className="text-[10px] mt-3 tracking-wider" style={{ color: CT_COLORS.frogGreen }}>FROG</p>
          <p className="text-[8px] mt-1" style={{ color: CT_COLORS.silver }}>Knight</p>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <EpochPixelArt size={120} />
      </div>
      <p className="text-center text-[9px] mt-4 tracking-wider" style={{ color: CT_COLORS.futureChrome }}>
        EPOCH - Wings of Time
      </p>
    </div>
  )
}

// Time Portal Gateway Section
export function TimePortalGateway() {
  return (
    <div className="py-12 border-t-4 border-b-4 my-8 relative overflow-hidden"
      style={{ borderColor: CT_COLORS.portalPurple + '40' }}>
      {/* Background time distortion */}
      <div className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at center, ${CT_COLORS.portalBlue} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      <p className="text-center text-xs mb-8 tracking-widest relative z-10" style={{ color: CT_COLORS.portalBlueBright }}>
        ◈ A Gate to another era opens... ◈
      </p>

      <div className="flex justify-center items-center gap-8 flex-wrap relative z-10">
        <TimePortal size={100} />
        <div className="text-center max-w-xs">
          <p className="text-sm mb-4" style={{ color: CT_COLORS.white }}>
            The flow of time is not constant...
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <EraBadge era="prehistoric" />
            <EraBadge era="medieval" />
            <EraBadge era="present" />
            <EraBadge era="future" />
          </div>
        </div>
        <TimePortal size={100} />
      </div>
    </div>
  )
}

// Lavos Dramatic Section
export function LavosDramaticSection() {
  return (
    <div className="py-10 border-t-4 border-b-4 my-8 relative"
      style={{
        borderColor: CT_COLORS.lavosRed + '60',
        background: `linear-gradient(180deg, ${CT_COLORS.voidDark} 0%, ${CT_COLORS.lavosPurple}20 50%, ${CT_COLORS.voidDark} 100%)`,
      }}>
      <p className="text-center text-xs mb-6 tracking-widest" style={{ color: CT_COLORS.lavosRed }}>
        ◈ The Day of Lavos approaches... ◈
      </p>
      <div className="flex justify-center items-center gap-8">
        <LavosEye size={60} />
        <div className="text-center">
          <p className="text-sm tracking-widest animate-lavos-text" style={{ color: CT_COLORS.red }}>
            1999 AD
          </p>
          <p className="text-[10px] mt-2" style={{ color: CT_COLORS.silver }}>
            &ldquo;But...the future refused to change.&rdquo;
          </p>
        </div>
        <LavosEye size={60} />
      </div>
    </div>
  )
}
