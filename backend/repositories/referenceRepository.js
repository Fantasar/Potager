// backend/repositories/referenceRepository.js
const pool = require("../config/db");

/**
 * Repository des tables de reference.
 * Regroupe l'acces aux donnees de reference partagees : type_de_sol, exposition, besoin_en_eau, seeds.
 * Ces tables sont utilisees par les fiches de grainotheque et le catalogue de plantes.
 */

const referenceRepository = {
  /**
   * Recupere tous les types de sol disponibles
   * @returns {Array}
   */
  async findAllTypesDeSol() {
    const result = await pool.query(`SELECT * FROM type_de_sol ORDER BY id`);
    return result.rows;
  },

  /**
   * Recupere toutes les expositions disponibles
   * @returns {Array}
   */
  async findAllExpositions() {
    const result = await pool.query(`SELECT * FROM exposition ORDER BY id`);
    return result.rows;
  },

  /**
   * Recupere tous les niveaux de besoin en eau
   * @returns {Array}
   */
  async findAllBesoinsEnEau() {
    const result = await pool.query(`SELECT * FROM besoin_en_eau ORDER BY id`);
    return result.rows;
  },

  /**
   * Recupere tous les types de semis disponibles
   * @returns {Array}
   */
  async findAllSeeds() {
    const result = await pool.query(`SELECT * FROM seeds ORDER BY id`);
    return result.rows;
  },
};

module.exports = referenceRepository;
