// backend/repositories/potagerPlanteRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `potager_plante`.
 * Table de liaison entre les plantes du catalogue et les cases d'un potager.
 * Stocke la position (x, y) de chaque plante dans la grille du potager.
 */

const potagerPlanteRepository = {
  /**
   * Recupere toutes les plantes positionnees dans un potager donne
   * Inclut le nom, la variete, l'emoji et l'occupation au sol via un JOIN
   * @param {number} potagerId - Identifiant du potager
   * @returns {Array}
   */
  async findByPotagerId(potagerId) {
    const result = await pool.query(
      `SELECT pp.*, p.name AS plante_name, p.variete AS plante_variete,
              p.emoji AS plante_emoji, p.besoin_occupation_sol AS plante_occupation
       FROM potager_plante pp
       JOIN plantes p ON pp.plante_id = p.id
       WHERE pp.potager_id = $1
       ORDER BY pp.position_y, pp.position_x`,
      [potagerId]
    );
    return result.rows;
  },

  /**
   * Place une plante dans une case du potager
   * La contrainte UNIQUE(potager_id, position_x, position_y) empeche les doublons
   * @param {Object} data - { potager_id, plante_id, position_x, position_y }
   * @returns {Object}    - Le placement cree
   */
  async create({ potager_id, plante_id, position_x, position_y }) {
    const result = await pool.query(
      `INSERT INTO potager_plante (potager_id, plante_id, position_x, position_y)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [potager_id, plante_id, position_x, position_y]
    );
    return result.rows[0];
  },

  /**
   * Deplace un placement vers une nouvelle position dans la grille
   * @param {number} id - Identifiant du placement
   * @param {number} position_x - Nouvelle coordonnee X
   * @param {number} position_y - Nouvelle coordonnee Y
   * @returns {Object} - Le placement mis a jour
   */
  async updatePosition(id, position_x, position_y) {
    const result = await pool.query(
      `UPDATE potager_plante SET position_x = $1, position_y = $2
       WHERE id = $3 RETURNING *`,
      [position_x, position_y, id]
    );
    return result.rows[0];
  },

  /**
   * Recupere un placement par son ID
   * @param {number} id - Identifiant du placement
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT pp.*, p.besoin_occupation_sol AS plante_occupation
       FROM potager_plante pp
       JOIN plantes p ON pp.plante_id = p.id
       WHERE pp.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Retire une plante d'une case du potager
   * @param {number} id - Identifiant du placement a supprimer
   */
  async delete(id) {
    await pool.query(`DELETE FROM potager_plante WHERE id = $1`, [id]);
  },
};

module.exports = potagerPlanteRepository;
