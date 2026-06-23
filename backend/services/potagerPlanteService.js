// backend/services/potagerPlanteService.js
const potagerRepository = require("../repositories/potagerRepository");
const planteRepository = require("../repositories/planteRepository");
const potagerPlanteRepository = require("../repositories/potagerPlanteRepository");

/**
 * Service de gestion des plantes positionnees dans un potager.
 * Contient la logique metier liee au placement des plantes dans la grille.
 * Gere l'occupation multi-cases : une plante avec besoin_occupation_sol de 50cm
 * occupe un carre de 2x2 cases (chaque case fait 25cm x 25cm).
 */

// Taille d'une case en cm -- chaque case fait 25cm x 25cm
const CELL_SIZE_CM = 25;

/**
 * Calcule le nombre de cases occupees par une plante dans chaque direction
 * Une plante sans occupation definie occupe une seule case (1x1)
 * @param {number|null} occupationCm - Occupation au sol en cm
 * @returns {number} - Nombre de cases par cote (ex: 2 pour 50cm)
 */
const getSpan = (occupationCm) => {
  if (!occupationCm || occupationCm <= 0) return 1;
  return Math.ceil(occupationCm / CELL_SIZE_CM);
};

/**
 * Genere la liste de toutes les cases occupees par un placement
 * A partir de la position d'origine (coin haut-gauche) et du span
 * @param {number} originX - Colonne d'origine
 * @param {number} originY - Ligne d'origine
 * @param {number} span    - Nombre de cases par cote
 * @returns {Array}        - Liste de { x, y }
 */
const getCoveredCells = (originX, originY, span) => {
  const cells = [];
  for (let dy = 0; dy < span; dy++) {
    for (let dx = 0; dx < span; dx++) {
      cells.push({ x: originX + dx, y: originY + dy });
    }
  }
  return cells;
};

const potagerPlanteService = {
  /**
   * Recupere toutes les plantes positionnees dans un potager
   * Verifie que le potager existe avant de retourner les placements
   * @param {number} potagerId - Identifiant du potager
   * @returns {Array}
   */
  async getByPotagerId(potagerId) {
    const potager = await potagerRepository.findById(potagerId);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }
    return potagerPlanteRepository.findByPotagerId(potagerId);
  },

  /**
   * Place une plante dans le potager a la position donnee
   * Verifie que le potager et la plante existent, que les coordonnees sont dans les limites,
   * et qu'aucune case occupee par la nouvelle plante ne chevauche un placement existant
   * @param {number} potagerId - Identifiant du potager
   * @param {Object} data      - { plante_id, position_x, position_y }
   * @returns {Object}         - Le placement cree
   */
  async addPlante(potagerId, { plante_id, position_x, position_y }) {
    // Verifie que le potager existe
    const potager = await potagerRepository.findById(potagerId);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }

    // Verifie que la plante existe dans le catalogue
    const plante = await planteRepository.findById(plante_id);
    if (!plante) {
      throw { status: 404, message: "Plante non trouvée" };
    }

    const maxX = Math.floor(parseFloat(potager.longueur) * 100 / CELL_SIZE_CM);
    const maxY = Math.floor(parseFloat(potager.largeur) * 100 / CELL_SIZE_CM);
    const span = getSpan(plante.besoin_occupation_sol);

    // Verifie que toutes les cases de la plante restent dans la grille
    if (
      position_x < 0 || position_x + span > maxX ||
      position_y < 0 || position_y + span > maxY
    ) {
      throw { status: 400, message: "La plante dépasse les limites du potager" };
    }

    // Recupere les placements existants pour verifier le chevauchement
    const existingPlacements = await potagerPlanteRepository.findByPotagerId(potagerId);

    // Construit un set de toutes les cases deja occupees
    const occupiedCells = new Set();
    for (const p of existingPlacements) {
      const existingSpan = getSpan(p.plante_occupation);
      for (const cell of getCoveredCells(p.position_x, p.position_y, existingSpan)) {
        occupiedCells.add(`${cell.x}-${cell.y}`);
      }
    }

    // Verifie qu'aucune case de la nouvelle plante n'est deja prise
    const newCells = getCoveredCells(position_x, position_y, span);
    for (const cell of newCells) {
      if (occupiedCells.has(`${cell.x}-${cell.y}`)) {
        throw { status: 409, message: "Cette zone chevauche une plante existante" };
      }
    }

    return potagerPlanteRepository.create({
      potager_id: potagerId,
      plante_id,
      position_x,
      position_y,
    });
  },

  /**
   * Deplace un placement vers une nouvelle position dans la grille
   * Verifie les limites et le chevauchement en excluant le placement en cours de deplacement
   * @param {number} potagerId   - Identifiant du potager
   * @param {number} placementId - Identifiant du placement a deplacer
   * @param {Object} data        - { position_x, position_y }
   * @returns {Object}           - Le placement mis a jour
   */
  async movePlante(potagerId, placementId, { position_x, position_y }) {
    const potager = await potagerRepository.findById(potagerId);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }

    const placement = await potagerPlanteRepository.findById(placementId);
    if (!placement) {
      throw { status: 404, message: "Placement non trouvé" };
    }

    const maxX = Math.floor(parseFloat(potager.longueur) * 100 / CELL_SIZE_CM);
    const maxY = Math.floor(parseFloat(potager.largeur) * 100 / CELL_SIZE_CM);
    const span = getSpan(placement.plante_occupation);

    // Verifie que la nouvelle position reste dans la grille
    if (
      position_x < 0 || position_x + span > maxX ||
      position_y < 0 || position_y + span > maxY
    ) {
      throw { status: 400, message: "La plante dépasse les limites du potager" };
    }

    // Verifie le chevauchement en excluant le placement qu'on deplace
    const existingPlacements = await potagerPlanteRepository.findByPotagerId(potagerId);
    const occupiedCells = new Set();
    for (const p of existingPlacements) {
      if (p.id === parseInt(placementId)) continue;
      const existingSpan = getSpan(p.plante_occupation);
      for (const cell of getCoveredCells(p.position_x, p.position_y, existingSpan)) {
        occupiedCells.add(`${cell.x}-${cell.y}`);
      }
    }

    const newCells = getCoveredCells(position_x, position_y, span);
    for (const cell of newCells) {
      if (occupiedCells.has(`${cell.x}-${cell.y}`)) {
        throw { status: 409, message: "Cette zone chevauche une plante existante" };
      }
    }

    return potagerPlanteRepository.updatePosition(placementId, position_x, position_y);
  },

  /**
   * Retire une plante d'une case du potager
   * @param {number} placementId - Identifiant du placement a supprimer
   */
  async removePlante(placementId) {
    return potagerPlanteRepository.delete(placementId);
  },
};

module.exports = potagerPlanteService;
