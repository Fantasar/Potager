// backend/repositories/planteRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `plantes`.
 * Gere le catalogue de plantes disponibles sur la plateforme.
 * Chaque plante reference les tables de reference (exposition, besoin_en_eau, type_de_sol, seeds).
 */

const planteRepository = {
  /**
   * Recupere toutes les plantes du catalogue, triees par nom
   * @returns {Array}
   */
  async findAll() {
    const result = await pool.query(
      `SELECT * FROM plantes ORDER BY name`
    );
    return result.rows;
  },

  /**
   * Recupere une plante par son ID
   * @param {number} id - Identifiant de la plante
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM plantes WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Ajoute une nouvelle plante au catalogue
   * @param {Object} data - { name, variete, emoji, exposition_id, besoin_en_eau_id, type_de_sol_id, semis_id, hauteur, besoin_occupation_sol, temps_occupation_sol }
   * @returns {Object}    - La plante creee
   */
  async create(data) {
    const result = await pool.query(
      `INSERT INTO plantes (name, variete, emoji, exposition_id, besoin_en_eau_id, type_de_sol_id, semis_id, hauteur, besoin_occupation_sol, temps_occupation_sol)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        data.name,
        data.variete,
        data.emoji,
        data.exposition_id,
        data.besoin_en_eau_id,
        data.type_de_sol_id,
        data.semis_id,
        data.hauteur,
        data.besoin_occupation_sol,
        data.temps_occupation_sol,
      ]
    );
    return result.rows[0];
  },

  /**
   * Met a jour une plante existante dans le catalogue
   * @param {number} id   - Identifiant de la plante
   * @param {Object} data - { name, variete, emoji, exposition_id, besoin_en_eau_id, type_de_sol_id, semis_id, hauteur, besoin_occupation_sol, temps_occupation_sol }
   * @returns {Object}    - La plante mise a jour
   */
  async update(id, data) {
    const result = await pool.query(
      `UPDATE plantes
       SET name = $1, variete = $2, emoji = $3, exposition_id = $4, besoin_en_eau_id = $5,
           type_de_sol_id = $6, semis_id = $7, hauteur = $8, besoin_occupation_sol = $9, temps_occupation_sol = $10
       WHERE id = $11 RETURNING *`,
      [
        data.name,
        data.variete,
        data.emoji,
        data.exposition_id,
        data.besoin_en_eau_id,
        data.type_de_sol_id,
        data.semis_id,
        data.hauteur,
        data.besoin_occupation_sol,
        data.temps_occupation_sol,
        id,
      ]
    );
    return result.rows[0];
  },

  /**
   * Supprime une plante du catalogue par son ID
   * @param {number} id - Identifiant de la plante
   */
  async delete(id) {
    await pool.query(`DELETE FROM plantes WHERE id = $1`, [id]);
  },
};

module.exports = planteRepository;
