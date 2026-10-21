import { CT_COLORS } from './palette'

// The world's ambient keyframes, set globally once.
export function AnimationStyles() {
  return (
  <style jsx global>{`
    /* Portal spin animation */
    @keyframes portal-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Portal ring animations */
    @keyframes portal-ring-1 {
      0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.7; }
      50% { transform: rotate(180deg) scale(1.1); opacity: 0.5; }
    }
    @keyframes portal-ring-2 {
      0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.6; }
      50% { transform: rotate(-180deg) scale(0.9); opacity: 0.4; }
    }
    @keyframes portal-ring-3 {
      0%, 100% { transform: rotate(0deg) scale(1); opacity: 0.5; }
      50% { transform: rotate(90deg) scale(1.2); opacity: 0.3; }
    }

    /* Sparkle animations */
    @keyframes sparkle-1 {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(0.5); }
    }
    @keyframes sparkle-2 {
      0%, 100% { opacity: 0.3; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1); }
    }
    @keyframes sparkle-3 {
      0%, 100% { opacity: 0.8; transform: scale(0.8); }
      50% { opacity: 0.2; transform: scale(0.4); }
    }
    @keyframes sparkle-4 {
      0%, 100% { opacity: 0.5; transform: scale(0.7); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* Engine pulse */
    @keyframes engine-pulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    /* Lavos pulse */
    @keyframes lavos-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.8); }
    }

    /* Lavos text glow */
    @keyframes lavos-text {
      0%, 100% {
        text-shadow: 0 0 8px ${CT_COLORS.lavosRed}, 0 0 16px ${CT_COLORS.lavosPurple};
      }
      50% {
        text-shadow: 0 0 16px ${CT_COLORS.lavosRed}, 0 0 32px ${CT_COLORS.lavosPurple}, 0 0 48px ${CT_COLORS.red};
      }
    }

    .animate-portal-spin { animation: portal-spin 20s linear infinite; }
    .animate-portal-ring-1 { animation: portal-ring-1 4s ease-in-out infinite; }
    .animate-portal-ring-2 { animation: portal-ring-2 5s ease-in-out infinite; }
    .animate-portal-ring-3 { animation: portal-ring-3 3s ease-in-out infinite; }
    .animate-sparkle-1 { animation: sparkle-1 2s ease-in-out infinite; }
    .animate-sparkle-2 { animation: sparkle-2 2.5s ease-in-out infinite; }
    .animate-sparkle-3 { animation: sparkle-3 1.8s ease-in-out infinite; }
    .animate-sparkle-4 { animation: sparkle-4 2.2s ease-in-out infinite; }
    .animate-engine-pulse { animation: engine-pulse 1.5s ease-in-out infinite; }
    .animate-lavos-pulse { animation: lavos-pulse 2s ease-in-out infinite; }
    .animate-lavos-text { animation: lavos-text 3s ease-in-out infinite; }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .animate-portal-spin,
      .animate-portal-ring-1,
      .animate-portal-ring-2,
      .animate-portal-ring-3,
      .animate-sparkle-1,
      .animate-sparkle-2,
      .animate-sparkle-3,
      .animate-sparkle-4,
      .animate-engine-pulse,
      .animate-lavos-pulse,
      .animate-lavos-text {
        animation: none !important;
      }
    }

    /* Focus visible styles for accessibility */
    :focus-visible {
      outline: 2px solid ${CT_COLORS.gold};
      outline-offset: 2px;
    }
  `}</style>
  )
}
