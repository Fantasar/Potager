// backend/services/planteService.js
const planteRepository = require("../repositories/planteRepository");

/**
 * Service de gestion du catalogue de plantes.
 * Contient la logique metier liee aux plantes disponibles sur la plateforme.
 * Orchestre planteRepository et valide l'existence des ressources avant modification.
 */

const planteService = {
  /**
   * Recupere toutes les plantes du catalogue
   * @returns {Array}
   */
  async getAll() {
    return planteRepository.findAll();
  },

  /**
   * Recupere une plante par son ID
   * Leve une erreur 404 si la plante n'existe pas
   * @param {number} id - Identifiant de la plante
   * @returns {Object}
   */
  async getById(id) {
    const plante = await planteRepository.findById(id);
    if (!plante) {
      throw { status: 404, message: "Plante non trouvée" };
    }
    return plante;
  },

  /**
   * Ajoute une nouvelle plante au catalogue
   * @param {Object} data - Donnees de la plante (name, variete, exposition_id, etc.)
   * @returns {Object}    - La plante creee
   */
  async create(data) {
    return planteRepository.create(data);
  },

  /**
   * Met a jour une plante existante dans le catalogue
   * Verifie que la plante existe avant la mise a jour
   * @param {number} id   - Identifiant de la plante
   * @param {Object} data - Nouvelles donnees de la plante
   * @returns {Object}    - La plante mise a jour
   */
  async update(id, data) {
    const plante = await planteRepository.findById(id);
    if (!plante) {
      throw { status: 404, message: "Plante non trouvée" };
    }
    return planteRepository.update(id, data);
  },

  /**
   * Supprime une plante du catalogue
   * @param {number} id - Identifiant de la plante
   */
  async delete(id) {
    return planteRepository.delete(id);
  },
};

module.exports = planteService;
