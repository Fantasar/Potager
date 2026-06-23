// backend/services/grainothequeService.js
const grainothequeRepository = require("../repositories/grainothequeRepository");
const grainothequeFicheRepository = require("../repositories/grainothequeFicheRepository");

/**
 * Service de gestion des grainotheques.
 * Contient la logique metier liee aux collections de graines et a leurs fiches detaillees.
 * Orchestre grainothequeRepository et grainothequeFicheRepository.
 */

const grainothequeService = {
  /**
   * Recupere toutes les grainotheques d'un utilisateur
   * @param {number} userId - Identifiant de l'utilisateur
   * @returns {Array}
   */
  async getAllByUser(userId) {
    return grainothequeRepository.findByUserId(userId);
  },

  /**
   * Recupere une grainotheque par son ID
   * Leve une erreur 404 si la grainotheque n'existe pas
   * @param {number} id - Identifiant de la grainotheque
   * @returns {Object}
   */
  async getById(id) {
    const grainotheque = await grainothequeRepository.findById(id);
    if (!grainotheque) {
      throw { status: 404, message: "Grainothèque non trouvée" };
    }
    return grainotheque;
  },

  /**
   * Recupere toutes les fiches d'une grainotheque donnee
   * @param {number} grainothequeId - Identifiant de la grainotheque
   * @returns {Array}
   */
  async getFiches(grainothequeId) {
    return grainothequeFicheRepository.findByGrainothequeId(grainothequeId);
  },

  /**
   * Cree une nouvelle grainotheque pour un utilisateur
   * @param {Object} data - { user_id, seed_id }
   * @returns {Object}    - La grainotheque creee
   */
  async create(data) {
    return grainothequeRepository.create(data);
  },

  /**
   * Cree une nouvelle fiche dans une grainotheque
   * @param {Object} data - Donnees de la fiche (grainotheque_id, variete, hauteur, etc.)
   * @returns {Object}    - La fiche creee
   */
  async createFiche(data) {
    return grainothequeFicheRepository.create(data);
  },

  /**
   * Met a jour une grainotheque existante
   * @param {number} id   - Identifiant de la grainotheque
   * @param {Object} data - { seed_id }
   * @returns {Object}    - La grainotheque mise a jour
   */
  async update(id, data) {
    return grainothequeRepository.update(id, data);
  },

  /**
   * Supprime une grainotheque par son ID
   * @param {number} id - Identifiant de la grainotheque
   */
  async delete(id) {
    return grainothequeRepository.delete(id);
  },
};

module.exports = grainothequeService;
