// backend/repositories/roleRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `roles`.
 * Gere les roles de la plateforme (utilisateur, admin).
 * Utilise par authService pour attribuer un role a l'inscription.
 */

const roleRepository = {
  /**
   * Recupere tous les roles disponibles
   * @returns {Array} - Liste des roles
   */
  async findAll() {
    const result = await pool.query(`SELECT * FROM roles ORDER BY id`);
    return result.rows;
  },

  /**
   * Recupere un role par son ID
   * @param {number} id - Identifiant du role
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(`SELECT * FROM roles WHERE id = $1`, [id]);
    return result.rows[0];
  },
};

module.exports = roleRepository;
