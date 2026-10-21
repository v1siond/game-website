// Rubber Hose's keyframes and animation classes, global so the backdrop, art and cards share them.
export function RubberHoseStyles() {
  return (
    <style jsx global>{`
      /* Film grain animation - faster for authentic look */
      @keyframes cuphead-grain {
        0%, 100% { transform: translate(0, 0); }
        10% { transform: translate(-2%, -2%); }
        20% { transform: translate(2%, 2%); }
        30% { transform: translate(-2%, 2%); }
        40% { transform: translate(2%, -2%); }
        50% { transform: translate(-2%, 0%); }
        60% { transform: translate(2%, 0%); }
        70% { transform: translate(0%, -2%); }
        80% { transform: translate(0%, 2%); }
        90% { transform: translate(-2%, -2%); }
      }

      /* 1930s film flicker effect */
      @keyframes cuphead-flicker {
        0%, 100% { opacity: 0; }
        8% { opacity: 0.15; }
        9% { opacity: 0; }
        12% { opacity: 0.1; }
        13% { opacity: 0; }
        50% { opacity: 0; }
        51% { opacity: 0.08; }
        52% { opacity: 0; }
      }

      /* Sprocket hole scrolling - vertical */
      @keyframes cuphead-sprocket {
        0% { transform: translateY(0); }
        100% { transform: translateY(-256px); }
      }

      @keyframes cuphead-sprocket-reverse {
        0% { transform: translateY(-256px); }
        100% { transform: translateY(0); }
      }

      /* Sprocket hole scrolling - horizontal for art sections */
      @keyframes cuphead-sprocket-horizontal {
        0% { transform: translateX(0); }
        100% { transform: translateX(-160px); }
      }

      @keyframes cuphead-sprocket-horizontal-reverse {
        0% { transform: translateX(-160px); }
        100% { transform: translateX(0); }
      }

      /* Floating up animation for music notes */
      @keyframes cuphead-float {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 0.3; }
        90% { opacity: 0.3; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }

      /* Bobbing animation - classic cartoon idle */
      @keyframes cuphead-bob {
        0%, 100% { transform: translateY(0) rotate(-5deg); }
        50% { transform: translateY(-10px) rotate(5deg); }
      }

      /* Squash and stretch bounce */
      @keyframes cuphead-bounce-squash {
        0% { transform: translateY(0) scaleY(1) scaleX(1); }
        25% { transform: translateY(-100px) scaleY(1.2) scaleX(0.9); }
        50% { transform: translateY(0) scaleY(0.8) scaleX(1.2); }
        75% { transform: translateY(-50px) scaleY(1.1) scaleX(0.95); }
        100% { transform: translateY(0) scaleY(1) scaleX(1); }
      }

      /* Waving arm animation */
      @keyframes cuphead-wave {
        0%, 100% { transform: rotate(-5deg); }
        50% { transform: rotate(10deg); }
      }

      /* Ink splash burst */
      @keyframes cuphead-ink {
        0% { transform: scale(0); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.8; }
        100% { transform: scale(2); opacity: 0; }
      }

      /* Bouncing letter animation */
      @keyframes cuphead-letter-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      /* Slow bounce for active states */
      @keyframes cuphead-slow-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }

      /* Wiggle animation - constant slight movement */
      @keyframes cuphead-wiggle {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
      }

      /* Pop in animation for elements appearing */
      @keyframes cuphead-pop {
        0% { transform: scale(0); opacity: 0; }
        70% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }

      /* Dust particle floating */
      @keyframes cuphead-dust-float {
        0%, 100% { opacity: 0.1; transform: translateY(0); }
        50% { opacity: 0.2; transform: translateY(-20px); }
      }

      /* Hand-drawn wobble for SVG paths */
      @keyframes cuphead-wobble-path {
        0%, 100% { filter: url('#wobble'); }
      }

      /* Animation classes */
      .cuphead-grain {
        animation: cuphead-grain 0.3s steps(10) infinite;
      }

      .cuphead-flicker {
        animation: cuphead-flicker 2s ease-in-out infinite;
      }

      .cuphead-sprocket-scroll {
        animation: cuphead-sprocket 4s linear infinite;
      }

      .cuphead-sprocket-scroll-reverse {
        animation: cuphead-sprocket-reverse 4s linear infinite;
      }

      .cuphead-sprocket-scroll-horizontal {
        animation: cuphead-sprocket-horizontal 3s linear infinite;
      }

      .cuphead-sprocket-scroll-horizontal-reverse {
        animation: cuphead-sprocket-horizontal-reverse 3s linear infinite;
      }

      .cuphead-float-up {
        animation: cuphead-float 15s linear infinite;
      }

      .cuphead-bob {
        animation: cuphead-bob 3s ease-in-out infinite;
      }

      .cuphead-bounce-squash {
        animation: cuphead-bounce-squash 2s ease-in-out infinite;
      }

      .cuphead-wave-arm {
        animation: cuphead-wave 2s ease-in-out infinite;
      }

      .cuphead-ink-splash {
        animation: cuphead-ink 0.4s ease-out forwards;
      }

      .cuphead-bounce-letter {
        animation: cuphead-letter-bounce 0.6s ease-in-out infinite;
      }

      .cuphead-bounce-slow {
        animation: cuphead-slow-bounce 0.8s ease-in-out infinite;
      }

      .cuphead-wiggle {
        animation: cuphead-wiggle 0.5s ease-in-out infinite;
      }

      .cuphead-pop-in {
        animation: cuphead-pop 0.3s ease-out forwards;
        opacity: 0;
      }

      .cuphead-dust {
        animation: cuphead-dust-float 4s ease-in-out infinite;
      }

      /* Hover states with wiggle */
      .group-hover\\:cuphead-wiggle:hover {
        animation: cuphead-wiggle 0.3s ease-in-out infinite;
      }

      /* Respect reduced motion preference */
      @media (prefers-reduced-motion: reduce) {
        .cuphead-grain,
        .cuphead-flicker,
        .cuphead-sprocket-scroll,
        .cuphead-sprocket-scroll-reverse,
        .cuphead-sprocket-scroll-horizontal,
        .cuphead-sprocket-scroll-horizontal-reverse,
        .cuphead-float-up,
        .cuphead-bob,
        .cuphead-bounce-squash,
        .cuphead-wave-arm,
        .cuphead-ink-splash,
        .cuphead-bounce-letter,
        .cuphead-bounce-slow,
        .cuphead-wiggle,
        .cuphead-pop-in,
        .cuphead-dust {
          animation: none !important;
        }

        .cuphead-pop-in {
          opacity: 1 !important;
        }
      }

      /* Screen reader only class */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
      }
    `}</style>
  )
}
