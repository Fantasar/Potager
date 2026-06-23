// backend/repositories/grainothequeFicheRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `grainotheque_fiche`.
 * Gere les fiches detaillees de chaque graine dans une grainotheque.
 * Chaque fiche reference les tables de reference (besoin_en_eau, type_de_sol, seeds, exposition).
 */

const grainothequeFicheRepository = {
  /**
   * Recupere toutes les fiches de grainotheque
   * @returns {Array}
   */
  async findAll() {
    const result = await pool.query(
      `SELECT * FROM grainotheque_fiche ORDER BY created_at DESC`
    );
    return result.rows;
  },

  /**
   * Recupere une fiche par son ID
   * @param {number} id - Identifiant de la fiche
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT * FROM grainotheque_fiche WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Recupere toutes les fiches d'une grainotheque donnee
   * @param {number} grainothequeId - Identifiant de la grainotheque
   * @returns {Array}
   */
  async findByGrainothequeId(grainothequeId) {
    const result = await pool.query(
      `SELECT * FROM grainotheque_fiche WHERE grainotheque_id = $1 ORDER BY created_at DESC`,
      [grainothequeId]
    );
    return result.rows;
  },

  /**
   * Cree une nouvelle fiche de grainotheque
   * @param {Object} data - { grainotheque_id, numero_uniqid, variete, hauteur, floraison, besoin_occupation_sol, besoin_en_eau_id, type_de_sol_id, semis_id, exposition_id }
   * @returns {Object}    - La fiche creee
   */
  async create({
    grainotheque_id,
    numero_uniqid,
    variete,
    hauteur,
    floraison,
    besoin_occupation_sol,
    besoin_en_eau_id,
    type_de_sol_id,
    semis_id,
    exposition_id,
  }) {
    const result = await pool.query(
      `INSERT INTO grainotheque_fiche
       (grainotheque_id, numero_uniqid, variete, hauteur, floraison, besoin_occupation_sol, besoin_en_eau_id, type_de_sol_id, semis_id, exposition_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        grainotheque_id,
        numero_uniqid,
        variete,
        hauteur,
        floraison,
        besoin_occupation_sol,
        besoin_en_eau_id,
        type_de_sol_id,
        semis_id,
        exposition_id,
      ]
    );
    return result.rows[0];
  },

  /**
   * Met a jour une fiche de grainotheque existante
   * @param {number} id   - Identifiant de la fiche
   * @param {Object} data - { variete, hauteur, floraison, besoin_occupation_sol, besoin_en_eau_id, type_de_sol_id, semis_id, exposition_id }
   * @returns {Object}    - La fiche mise a jour
   */
  async update(id, data) {
    const result = await pool.query(
      `UPDATE grainotheque_fiche
       SET variete = $1, hauteur = $2, floraison = $3, besoin_occupation_sol = $4,
           besoin_en_eau_id = $5, type_de_sol_id = $6, semis_id = $7, exposition_id = $8, updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [
        data.variete,
        data.hauteur,
        data.floraison,
        data.besoin_occupation_sol,
        data.besoin_en_eau_id,
        data.type_de_sol_id,
        data.semis_id,
        data.exposition_id,
        id,
      ]
    );
    return result.rows[0];
  },

  /**
   * Supprime une fiche par son ID
   * @param {number} id - Identifiant de la fiche
   */
  async delete(id) {
    await pool.query(`DELETE FROM grainotheque_fiche WHERE id = $1`, [id]);
  },
};

module.exports = grainothequeFicheRepository;
