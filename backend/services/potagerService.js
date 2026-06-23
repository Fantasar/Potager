// backend/services/potagerService.js
const potagerRepository = require("../repositories/potagerRepository");

/**
 * Service de gestion des potagers.
 * Contient la logique metier liee aux carres de potager.
 * Orchestre potagerRepository et valide l'existence des ressources avant modification.
 */

const potagerService = {
  /**
   * Recupere tous les potagers d'un utilisateur
   * @param {number} userId - Identifiant de l'utilisateur
   * @returns {Array}       - Liste des potagers
   */
  async getAllByUser(userId) {
    return potagerRepository.findByUserId(userId);
  },

  /**
   * Recupere un potager par son ID
   * Leve une erreur 404 si le potager n'existe pas
   * @param {number} id - Identifiant du potager
   * @returns {Object}  - Le potager trouve
   */
  async getById(id) {
    const potager = await potagerRepository.findById(id);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }
    return potager;
  },

  /**
   * Cree un nouveau potager pour un utilisateur
   * @param {Object} data - { user_id, name, longueur, largeur }
   * @returns {Object}    - Le potager cree
   */
  async create(data) {
    return potagerRepository.create(data);
  },

  /**
   * Met a jour un potager existant
   * Verifie que le potager existe avant la mise a jour
   * @param {number} id   - Identifiant du potager
   * @param {Object} data - { name, longueur, largeur }
   * @returns {Object}    - Le potager mis a jour
   */
  async update(id, data) {
    const potager = await potagerRepository.findById(id);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }
    return potagerRepository.update(id, data);
  },

  /**
   * Met a jour la position d'un potager dans le jardin
   * @param {number} id   - Identifiant du potager
   * @param {Object} data - { garden_x, garden_y }
   * @returns {Object}    - Le potager mis a jour
   */
  async updatePosition(id, data) {
    const potager = await potagerRepository.findById(id);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }
    return potagerRepository.updatePosition(id, data);
  },

  /**
   * Supprime un potager
   * Verifie que le potager existe avant la suppression
   * @param {number} id - Identifiant du potager
   */
  async delete(id) {
    const potager = await potagerRepository.findById(id);
    if (!potager) {
      throw { status: 404, message: "Potager non trouvé" };
    }
    return potagerRepository.delete(id);
  },
};

module.exports = potagerService;
