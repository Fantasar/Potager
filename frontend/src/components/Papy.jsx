// frontend/src/components/Papy.jsx

/**
 * Personnage mascotte du jardin -- un papy jardinier avec chapeau de paille et fourche.
 * Affiche une bulle de dialogue au-dessus de lui pour servir de tutoriel.
 * Le personnage est entierement dessine en SVG avec des animations CSS.
 */
function Papy({ message }) {
  return (
    <div className="flex flex-col items-center w-48 shrink-0 select-none">
      {/* Bulle de dialogue */}
      {message && (
        <div className="relative bg-white rounded-xl shadow-lg px-4 py-3 mb-3 text-sm text-gray-700 leading-snug max-w-[180px]">
          {message}
          {/* Triangle de la bulle */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid white",
            }}
          />
        </div>
      )}

      {/* Espace reserve pour la bulle quand pas de message */}
      {!message && <div className="h-20" />}

      {/* Personnage SVG anime */}
      <svg
        viewBox="0 0 200 320"
        width="160"
        height="256"
        className="drop-shadow-lg"
      >
        {/* Fourche -- main droite */}
        <g className="origin-bottom" style={{ animation: "sway 3s ease-in-out infinite" }}>
          <line x1="145" y1="100" x2="155" y2="280" stroke="#8B6914" strokeWidth="4" strokeLinecap="round" />
          <line x1="145" y1="95" x2="145" y2="110" stroke="#666" strokeWidth="3" strokeLinecap="round" />
          <line x1="155" y1="95" x2="155" y2="110" stroke="#666" strokeWidth="3" strokeLinecap="round" />
          <line x1="165" y1="95" x2="165" y2="110" stroke="#666" strokeWidth="3" strokeLinecap="round" />
          <line x1="142" y1="110" x2="168" y2="110" stroke="#666" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Chapeau de paille */}
        <g style={{ animation: "bob 3s ease-in-out infinite" }}>
          {/* Bord large du chapeau */}
          <ellipse cx="100" cy="62" rx="52" ry="12" fill="#DEB867" stroke="#C4983B" strokeWidth="1.5" />
          {/* Dome du chapeau */}
          <ellipse cx="100" cy="55" rx="32" ry="22" fill="#E8C96A" />
          {/* Ruban */}
          <rect x="68" y="56" width="64" height="6" rx="2" fill="#D4432A" />
          {/* Reflet */}
          <ellipse cx="90" cy="46" rx="12" ry="6" fill="#F0DA82" opacity="0.5" />
        </g>

        {/* Tete */}
        <g style={{ animation: "bob 3s ease-in-out infinite" }}>
          <circle cx="100" cy="95" r="30" fill="#F5D0A9" />
          {/* Yeux */}
          <g style={{ animation: "blink 4s ease-in-out infinite" }}>
            <circle cx="89" cy="90" r="3" fill="#333" />
            <circle cx="111" cy="90" r="3" fill="#333" />
            {/* Sourcils */}
            <line x1="84" y1="84" x2="93" y2="85" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
            <line x1="107" y1="85" x2="116" y2="84" stroke="#8B6914" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Nez */}
          <ellipse cx="100" cy="97" rx="4" ry="3" fill="#E8B88A" />
          {/* Moustache */}
          <path d="M88 105 Q94 108 100 104 Q106 108 112 105" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" />
          {/* Sourire */}
          <path d="M91 110 Q100 118 109 110" fill="none" stroke="#A0522D" strokeWidth="2" strokeLinecap="round" />
          {/* Joues roses */}
          <circle cx="80" cy="100" r="6" fill="#F5A0A0" opacity="0.3" />
          <circle cx="120" cy="100" r="6" fill="#F5A0A0" opacity="0.3" />
        </g>

        {/* Corps -- chemise a carreaux */}
        <g style={{ animation: "bob 3s ease-in-out infinite", animationDelay: "0.1s" }}>
          {/* Torse */}
          <path d="M70 125 L65 210 L135 210 L130 125 Z" fill="#4A7C3F" stroke="#3A6230" strokeWidth="1" />
          {/* Carreaux de la chemise */}
          <line x1="85" y1="125" x2="82" y2="210" stroke="#3A6230" strokeWidth="1" opacity="0.3" />
          <line x1="100" y1="125" x2="100" y2="210" stroke="#3A6230" strokeWidth="1" opacity="0.3" />
          <line x1="115" y1="125" x2="118" y2="210" stroke="#3A6230" strokeWidth="1" opacity="0.3" />
          <line x1="65" y1="150" x2="135" y2="150" stroke="#3A6230" strokeWidth="1" opacity="0.3" />
          <line x1="65" y1="175" x2="135" y2="175" stroke="#3A6230" strokeWidth="1" opacity="0.3" />
          {/* Col */}
          <path d="M85 125 L100 140 L115 125" fill="none" stroke="#3A6230" strokeWidth="2" />
          {/* Boutons */}
          <circle cx="100" cy="150" r="2.5" fill="#E8C96A" />
          <circle cx="100" cy="170" r="2.5" fill="#E8C96A" />
          <circle cx="100" cy="190" r="2.5" fill="#E8C96A" />
        </g>

        {/* Bras gauche -- le long du corps */}
        <path d="M70 130 Q50 170 60 210" fill="none" stroke="#F5D0A9" strokeWidth="12" strokeLinecap="round" />
        {/* Manche gauche */}
        <path d="M70 130 Q58 150 55 165" fill="none" stroke="#4A7C3F" strokeWidth="14" strokeLinecap="round" />

        {/* Bras droit -- tient la fourche */}
        <path d="M130 130 Q150 160 148 190" fill="none" stroke="#F5D0A9" strokeWidth="12" strokeLinecap="round" />
        {/* Manche droit */}
        <path d="M130 130 Q142 150 145 165" fill="none" stroke="#4A7C3F" strokeWidth="14" strokeLinecap="round" />

        {/* Pantalon */}
        <path d="M65 210 L60 290 L90 290 L100 230 L110 290 L140 290 L135 210 Z" fill="#6B4E30" stroke="#5A3E20" strokeWidth="1" />
        {/* Ceinture */}
        <rect x="64" y="208" width="72" height="8" rx="2" fill="#5A3E20" />
        <rect x="96" y="207" width="8" height="10" rx="2" fill="#C4983B" />

        {/* Bottes */}
        <ellipse cx="75" cy="295" rx="18" ry="8" fill="#4A3520" />
        <ellipse cx="125" cy="295" rx="18" ry="8" fill="#4A3520" />
      </svg>

      {/* Animations CSS */}
      <style>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>
    </div>
  );
}

export default Papy;
