// frontend/src/assets/grass-pattern.js

/**
 * Genere un pattern SVG d'herbe realiste encode en data URI.
 * Le SVG contient des brins d'herbe de differentes teintes et tailles
 * qui se repetent en mosaique pour couvrir toute la surface.
 */

const TILE_SIZE = 60;
const BLADE_COUNT = 40;

/**
 * Genere un nombre pseudo-aleatoire a partir d'une seed
 * @param {number} seed
 * @returns {number} entre 0 et 1
 */
function seededRandom(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/**
 * Genere le contenu SVG du pattern d'herbe
 * @returns {string} - Data URI du SVG
 */
export function generateGrassPattern() {
  const blades = [];

  for (let i = 0; i < BLADE_COUNT; i++) {
    const x = seededRandom(i * 3) * TILE_SIZE;
    const y = seededRandom(i * 3 + 1) * TILE_SIZE;
    const h = 4 + seededRandom(i * 3 + 2) * 10;
    const lean = (seededRandom(i * 7) - 0.5) * 6;

    const greens = ["#2d7a3a", "#3a8f47", "#327d3f", "#469950", "#2e8040", "#3b9148", "#287035"];
    const color = greens[i % greens.length];
    const opacity = 0.5 + seededRandom(i * 11) * 0.5;

    blades.push(
      `<line x1="${x}" y1="${y}" x2="${x + lean}" y2="${y - h}" stroke="${color}" stroke-width="${0.8 + seededRandom(i * 5) * 0.8}" stroke-linecap="round" opacity="${opacity}"/>`
    );
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_SIZE}" height="${TILE_SIZE}">
    <rect width="${TILE_SIZE}" height="${TILE_SIZE}" fill="#3a8a45"/>
    ${blades.join("")}
  </svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const grassBackground = {
  backgroundColor: "#3a8a45",
  backgroundImage: generateGrassPattern(),
  backgroundRepeat: "repeat",
  backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
};
