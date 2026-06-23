// backend/repositories/grainothequeRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `grainotheque`.
 * Gere les grainotheques des utilisateurs -- chaque utilisateur possede sa propre collection de graines.
 * Liee a la table seeds via seed_id.
 */

const grainothequeRepository = {
  /**
   * Recupere toutes les grainotheques
   * @returns {Array}
   */
  async findAll() {
    const result = await pool.query(
      `SELECT * FROM grainotheque ORDER BY created_at DESC`
    );
    return result.rows;
  },

  /**
   * Recupere une grainotheque par son ID
   * @param {number} id - Identifiant de la grainotheque
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM grainotheque WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Recupere toutes les grainotheques d'un utilisateur
   * @param {number} userId - Identifiant de l'utilisateur
   * @returns {Array}
   */
  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM grainotheque WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Cree une nouvelle grainotheque
   * @param {Object} data - { user_id, seed_id }
   * @returns {Object}    - La grainotheque creee
   */
  async create({ user_id, seed_id }) {
    const result = await pool.query(
      `INSERT INTO grainotheque (user_id, seed_id) VALUES ($1, $2) RETURNING *`,
      [user_id, seed_id]
    );
    return result.rows[0];
  },

  /**
   * Met a jour une grainotheque existante
   * @param {number} id   - Identifiant de la grainotheque
   * @param {Object} data - { seed_id }
   * @returns {Object}    - La grainotheque mise a jour
   */
  async update(id, { seed_id }) {
    const result = await pool.query(
      `UPDATE grainotheque SET seed_id = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [seed_id, id]
    );
    return result.rows[0];
  },

  /**
   * Supprime une grainotheque par son ID
   * @param {number} id - Identifiant de la grainotheque
   */
  async delete(id) {
    await pool.query(`DELETE FROM grainotheque WHERE id = $1`, [id]);
  },
};

module.exports = grainothequeRepository;
