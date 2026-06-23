// backend/repositories/potagerRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `potager`.
 * Gere les carres de potager crees par les utilisateurs.
 * Chaque potager est lie a un utilisateur via user_id.
 */

const potagerRepository = {
  /**
   * Recupere tous les potagers
   * @returns {Array} - Liste de tous les potagers
   */
  async findAll() {
    const result = await pool.query(
      `SELECT * FROM potager ORDER BY created_at DESC`
    );
    return result.rows;
  },

  /**
   * Recupere un potager par son ID
   * @param {number} id - Identifiant du potager
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM potager WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Recupere tous les potagers d'un utilisateur
   * @param {number} userId - Identifiant de l'utilisateur
   * @returns {Array} - Liste des potagers de l'utilisateur
   */
  async findByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM potager WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Cree un nouveau potager avec une position dans le jardin
   * @param {Object} data - { user_id, name, longueur, largeur, garden_x, garden_y }
   * @returns {Object}    - Le potager cree
   */
  async create({ user_id, name, longueur, largeur, garden_x, garden_y }) {
    const result = await pool.query(
      `INSERT INTO potager (user_id, name, longueur, largeur, garden_x, garden_y)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, name, longueur, largeur, garden_x || 50, garden_y || 50]
    );
    return result.rows[0];
  },

  /**
   * Met a jour un potager existant
   * @param {number} id   - Identifiant du potager
   * @param {Object} data - { name, longueur, largeur }
   * @returns {Object}    - Le potager mis a jour
   */
  async update(id, { name, longueur, largeur }) {
    const result = await pool.query(
      `UPDATE potager SET name = $1, longueur = $2, largeur = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [name, longueur, largeur, id]
    );
    return result.rows[0];
  },

  /**
   * Met a jour la position d'un potager dans le jardin
   * Position stockee en pourcentage (0-100) pour s'adapter a toutes les tailles d'ecran
   * @param {number} id   - Identifiant du potager
   * @param {Object} data - { garden_x, garden_y }
   * @returns {Object}    - Le potager mis a jour
   */
  async updatePosition(id, { garden_x, garden_y }) {
    const result = await pool.query(
      `UPDATE potager SET garden_x = $1, garden_y = $2, updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [garden_x, garden_y, id]
    );
    return result.rows[0];
  },

  /**
   * Supprime un potager par son ID
   * @param {number} id - Identifiant du potager
   */
  async delete(id) {
    await pool.query(`DELETE FROM potager WHERE id = $1`, [id]);
  },
};

module.exports = potagerRepository;
