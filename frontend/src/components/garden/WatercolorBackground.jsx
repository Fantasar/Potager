// frontend/src/components/garden/WatercolorBackground.jsx

/**
 * Fond aquarelle en forme de flaque irreguliere.
 * La scene (ciel, collines, herbe) est masquee par un clip-path organique
 * laissant apparaitre un fond beige autour, pour un rendu moderne.
 */
function WatercolorBackground() {
  return (
    <>
      {/* Fond beige visible autour de la flaque */}
      <div className="absolute inset-0" style={{ backgroundColor: "#f5f0e8" }} />

      {/* Flaque aquarelle -- forme irreguliere */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: `url(#splash-clip)`,
          WebkitClipPath: `url(#splash-clip)`,
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="watercolor" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
              <feGaussianBlur stdDeviation="1.2" />
            </filter>

            <filter id="watercolor-soft" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="5" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
              <feGaussianBlur stdDeviation="2" />
            </filter>

            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c5dff0" />
              <stop offset="40%" stopColor="#ddeef6" />
              <stop offset="70%" stopColor="#eaf5f0" />
              <stop offset="100%" stopColor="#f0f7e8" />
            </linearGradient>

            <linearGradient id="grass-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7cb87a" />
              <stop offset="100%" stopColor="#5a9e58" />
            </linearGradient>
          </defs>

          <rect width="1200" height="700" fill="url(#sky)" />

          <g filter="url(#watercolor-soft)" opacity="0.5">
            <ellipse cx="200" cy="120" rx="120" ry="40" fill="white" />
            <ellipse cx="250" cy="110" rx="80" ry="35" fill="white" />
            <ellipse cx="800" cy="90" rx="100" ry="30" fill="white" />
            <ellipse cx="850" cy="80" rx="70" ry="25" fill="white" />
            <ellipse cx="500" cy="150" rx="90" ry="28" fill="white" opacity="0.4" />
          </g>

          <g filter="url(#watercolor-soft)">
            <path d="M0 450 Q150 380 300 420 Q500 370 650 410 Q850 360 1000 400 Q1100 380 1200 420 L1200 700 L0 700Z"
              fill="#a8d5a0" opacity="0.5" />
            <path d="M0 480 Q200 430 400 460 Q600 420 800 450 Q1000 420 1200 460 L1200 700 L0 700Z"
              fill="#8cc98a" opacity="0.6" />
          </g>

          <g filter="url(#watercolor)">
            <path d="M0 520 Q100 500 250 510 Q400 495 550 510 Q700 500 850 515 Q1000 505 1200 520 L1200 700 L0 700Z"
              fill="url(#grass-grad)" />
          </g>

          <g filter="url(#watercolor)" opacity="0.3">
            <ellipse cx="150" cy="600" rx="100" ry="30" fill="#4a8a48" />
            <ellipse cx="500" cy="620" rx="120" ry="25" fill="#4a8a48" />
            <ellipse cx="900" cy="590" rx="80" ry="20" fill="#4a8a48" />
            <ellipse cx="700" cy="650" rx="90" ry="22" fill="#3d7a3b" />
          </g>

          <g filter="url(#watercolor-soft)" opacity="0.6">
            <circle cx="100" cy="560" r="4" fill="#f0a0b0" />
            <circle cx="130" cy="570" r="3" fill="#f5c040" />
            <circle cx="160" cy="555" r="3.5" fill="#f0a0b0" />
            <circle cx="350" cy="540" r="3" fill="#c090d0" />
            <circle cx="380" cy="550" r="4" fill="#f5c040" />
            <circle cx="750" cy="545" r="3.5" fill="#f0a0b0" />
            <circle cx="780" cy="555" r="3" fill="#c090d0" />
            <circle cx="1050" cy="550" r="4" fill="#f5c040" />
            <circle cx="1080" cy="560" r="3" fill="#f0a0b0" />
          </g>
        </svg>
      </div>

      {/* SVG invisible contenant le clip-path de la flaque */}
      <svg className="absolute" width="0" height="0">
        <defs>
          <clipPath id="splash-clip" clipPathUnits="objectBoundingBox">
            <path d={`
              M 0.02 0.15
              C 0.04 0.05, 0.12 -0.02, 0.22 0.03
              C 0.30 0.06, 0.35 0.01, 0.45 0.02
              C 0.55 0.03, 0.60 -0.01, 0.70 0.04
              C 0.78 0.08, 0.85 0.02, 0.92 0.06
              C 0.98 0.09, 1.02 0.18, 0.99 0.28
              C 0.97 0.36, 1.01 0.45, 0.98 0.55
              C 0.96 0.63, 1.00 0.72, 0.97 0.80
              C 0.95 0.88, 0.99 0.94, 0.93 0.97
              C 0.85 1.01, 0.78 0.96, 0.68 0.98
              C 0.58 1.00, 0.50 0.96, 0.40 0.99
              C 0.30 1.02, 0.22 0.97, 0.14 0.98
              C 0.06 0.99, 0.01 0.94, 0.01 0.85
              C 0.00 0.75, 0.03 0.65, 0.01 0.55
              C -0.01 0.45, 0.03 0.35, 0.01 0.25
              C -0.01 0.18, 0.00 0.20, 0.02 0.15
              Z
            `} />
          </clipPath>
        </defs>
      </svg>
    </>
  );
}

export default WatercolorBackground;
