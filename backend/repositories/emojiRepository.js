// backend/repositories/emojiRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `emoji_catalogue`.
 * Fournit l'acces au catalogue d'emojis de fruits, legumes, plantes et fleurs.
 * Utilise par le formulaire de creation de plantes pour choisir une icone.
 */

const emojiRepository = {
  /**
   * Recupere tous les emojis, tries par categorie puis par nom
   * @returns {Array}
   */
  async findAll() {
    const result = await pool.query(
      `SELECT * FROM emoji_catalogue ORDER BY categorie, name`
    );
    return result.rows;
  },

  /**
   * Recupere les emojis d'une categorie donnee (fruit, legume, aromatique, fleur)
   * @param {string} categorie - Nom de la categorie
   * @returns {Array}
   */
  async findByCategorie(categorie) {
    const result = await pool.query(
      `SELECT * FROM emoji_catalogue WHERE categorie = $1 ORDER BY name`,
      [categorie]
    );
    return result.rows;
  },
};

module.exports = emojiRepository;
