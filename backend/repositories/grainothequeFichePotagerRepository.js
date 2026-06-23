// backend/repositories/grainothequeFichePotagerRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `grainotheque_fiche_potager`.
 * Table de liaison entre les fiches de grainotheque et les potagers.
 * Stocke la position (x, y) de chaque fiche dans un carre de potager.
 */

const grainothequeFichePotagerRepository = {
  /**
   * Recupere toutes les fiches positionnees dans un potager donne
   * @param {number} potagerId - Identifiant du potager
   * @returns {Array}
   */
  async findByPotagerId(potagerId) {
    const result = await pool.query(
      `SELECT * FROM grainotheque_fiche_potager WHERE potager_id = $1`,
      [potagerId]
    );
    return result.rows;
  },

  /**
   * Recupere toutes les positions d'une fiche dans les differents potagers
   * @param {number} ficheId - Identifiant de la fiche de grainotheque
   * @returns {Array}
   */
  async findByFicheId(ficheId) {
    const result = await pool.query(
      `SELECT * FROM grainotheque_fiche_potager WHERE grainotheque_fiche_id = $1`,
      [ficheId]
    );
    return result.rows;
  },

  /**
   * Positionne une fiche de grainotheque dans un potager a une position donnee
   * @param {Object} data - { grainotheque_fiche_id, potager_id, position_x, position_y }
   * @returns {Object}    - L'association creee
   */
  async create({ grainotheque_fiche_id, potager_id, position_x, position_y }) {
    const result = await pool.query(
      `INSERT INTO grainotheque_fiche_potager (grainotheque_fiche_id, potager_id, position_x, position_y)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [grainotheque_fiche_id, potager_id, position_x, position_y]
    );
    return result.rows[0];
  },

  /**
   * Supprime une association fiche-potager par son ID
   * @param {number} id - Identifiant de l'association
   */
  async delete(id) {
    await pool.query(
      `DELETE FROM grainotheque_fiche_potager WHERE id = $1`,
      [id]
    );
  },
};

module.exports = grainothequeFichePotagerRepository;
