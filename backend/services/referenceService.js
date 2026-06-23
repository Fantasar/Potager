// backend/services/referenceService.js
const referenceRepository = require("../repositories/referenceRepository");

/**
 * Service des donnees de reference.
 * Fournit l'acces aux tables de reference partagees par les fiches et les plantes.
 * Pas de logique metier complexe -- sert principalement de passe-plat vers le repository.
 */

const referenceService = {
  /**
   * Recupere tous les types de sol
   * @returns {Array}
   */
  async getTypesDeSol() {
    return referenceRepository.findAllTypesDeSol();
  },

  /**
   * Recupere toutes les expositions
   * @returns {Array}
   */
  async getExpositions() {
    return referenceRepository.findAllExpositions();
  },

  /**
   * Recupere tous les niveaux de besoin en eau
   * @returns {Array}
   */
  async getBesoinsEnEau() {
    return referenceRepository.findAllBesoinsEnEau();
  },

  /**
   * Recupere tous les types de semis
   * @returns {Array}
   */
  async getSeeds() {
    return referenceRepository.findAllSeeds();
  },
};

module.exports = referenceService;
