// frontend/src/components/garden/Shed.jsx

/**
 * Cabane de jardin aquarelle.
 * Petite cabane en bois avec toit incline, porte et fenetre.
 * Style aquarelle avec bords fondus et couleurs douces.
 */
function Shed({ className = "" }) {
  return (
    <svg viewBox="0 0 200 280" className={className}>
      <defs>
        <filter id="shed-wc" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="12" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
          <feGaussianBlur stdDeviation="0.8" />
        </filter>

        <linearGradient id="shed-roof" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="100%" stopColor="#A0522D" />
        </linearGradient>

        <linearGradient id="shed-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D2B48C" />
          <stop offset="100%" stopColor="#C4A06A" />
        </linearGradient>
      </defs>

      <g filter="url(#shed-wc)">
        {/* Ombre au sol */}
        <ellipse cx="100" cy="270" rx="75" ry="10" fill="#2a5a28" opacity="0.2" />

        {/* Mur principal */}
        <rect x="30" y="120" width="140" height="150" rx="3" fill="url(#shed-wall)" />

        {/* Planches horizontales */}
        <line x1="30" y1="150" x2="170" y2="150" stroke="#b8956a" strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="180" x2="170" y2="180" stroke="#b8956a" strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="210" x2="170" y2="210" stroke="#b8956a" strokeWidth="1" opacity="0.4" />
        <line x1="30" y1="240" x2="170" y2="240" stroke="#b8956a" strokeWidth="1" opacity="0.4" />

        {/* Toit */}
        <path d="M20 125 L100 60 L180 125Z" fill="url(#shed-roof)" />
        <path d="M20 125 L100 60 L180 125" fill="none" stroke="#6B3410" strokeWidth="2" opacity="0.5" />
        {/* Tuiles du toit */}
        <path d="M55 98 L100 60 L145 98" fill="none" stroke="#7a4015" strokeWidth="1" opacity="0.3" />
        <path d="M38 112 L100 72 L162 112" fill="none" stroke="#7a4015" strokeWidth="1" opacity="0.3" />

        {/* Porte */}
        <rect x="70" y="185" width="35" height="85" rx="2" fill="#8B5E3C" />
        <rect x="73" y="188" width="29" height="79" rx="1" fill="#7a4e30" />
        {/* Planches de porte */}
        <line x1="87" y1="188" x2="87" y2="267" stroke="#6B4226" strokeWidth="1" opacity="0.5" />
        {/* Poignee */}
        <circle cx="95" cy="230" r="3" fill="#C4983B" />

        {/* Fenetre */}
        <rect x="120" y="145" width="30" height="28" rx="2" fill="#a8d4e6" />
        <rect x="120" y="145" width="30" height="28" rx="2" fill="none" stroke="#7a4e30" strokeWidth="2.5" />
        {/* Croisillon */}
        <line x1="135" y1="145" x2="135" y2="173" stroke="#7a4e30" strokeWidth="2" />
        <line x1="120" y1="159" x2="150" y2="159" stroke="#7a4e30" strokeWidth="2" />
        {/* Reflet */}
        <rect x="123" y="148" width="10" height="9" rx="1" fill="white" opacity="0.3" />

        {/* Petite jardiniere sous la fenetre */}
        <rect x="118" y="174" width="34" height="8" rx="2" fill="#8B5E3C" />
        <circle cx="125" cy="173" r="3" fill="#e06060" opacity="0.6" />
        <circle cx="135" cy="171" r="3.5" fill="#f07070" opacity="0.5" />
        <circle cx="145" cy="173" r="3" fill="#e06060" opacity="0.6" />
        <path d="M125 174 L125 178" stroke="#4a8a42" strokeWidth="1" />
        <path d="M135 172 L135 178" stroke="#4a8a42" strokeWidth="1" />
        <path d="M145 174 L145 178" stroke="#4a8a42" strokeWidth="1" />

        {/* Outils appuyes contre la cabane */}
        <line x1="178" y1="160" x2="182" y2="270" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
        <line x1="185" y1="165" x2="188" y2="270" stroke="#666" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default Shed;
