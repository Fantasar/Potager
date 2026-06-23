// backend/repositories/userRepository.js
const pool = require("../config/db");

/**
 * Repository de la table `users`.
 * Gere les utilisateurs de la plateforme (utilisateur standard et admin via role_id).
 * Utilise par authService pour l'inscription et la connexion.
 */

const userRepository = {
  /**
   * Recupere tous les utilisateurs (sans le mot de passe)
   * @returns {Array} - Liste des utilisateurs
   */
  async findAll() {
    const result = await pool.query(
      `SELECT id, email, prenom, nom, ville, role_id, created_at
       FROM users ORDER BY created_at DESC`
    );
    return result.rows;
  },

  /**
   * Recupere un utilisateur par son ID (sans le mot de passe)
   * @param {number} id - Identifiant de l'utilisateur
   * @returns {Object|undefined}
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT id, email, prenom, nom, ville, role_id, garden_longueur, garden_largeur, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  /**
   * Recupere un utilisateur par son email (avec le mot de passe hashe)
   * Utilise par authService pour verifier les identifiants a la connexion
   * @param {string} email
   * @returns {Object|undefined}
   */
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  },

  /**
   * Cree un nouvel utilisateur en base de donnees
   * @param {Object} data - { email, password_hash, prenom, nom, ville, role_id }
   * @returns {Object} - L'utilisateur cree
   */
  async create({ email, password_hash, prenom, nom, ville, role_id }) {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, prenom, nom, ville, role_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, prenom, nom, ville, role_id, created_at`,
      [email, password_hash, prenom, nom, ville, role_id]
    );
    return result.rows[0];
  },

  /**
   * Met a jour les informations de profil d'un utilisateur
   * @param {number} id   - Identifiant de l'utilisateur
   * @param {Object} data - { email, prenom, nom, ville }
   * @returns {Object}    - L'utilisateur mis a jour
   */
  async update(id, { email, prenom, nom, ville }) {
    const result = await pool.query(
      `UPDATE users SET email = $1, prenom = $2, nom = $3, ville = $4, updated_at = NOW()
       WHERE id = $5 RETURNING *`,
      [email, prenom, nom, ville, id]
    );
    return result.rows[0];
  },

  /**
   * Met a jour les dimensions du jardin d'un utilisateur
   * @param {number} id   - Identifiant de l'utilisateur
   * @param {Object} data - { garden_longueur, garden_largeur }
   * @returns {Object}    - L'utilisateur mis a jour
   */
  async updateGarden(id, { garden_longueur, garden_largeur }) {
    const result = await pool.query(
      `UPDATE users SET garden_longueur = $1, garden_largeur = $2, updated_at = NOW()
       WHERE id = $3 RETURNING id, email, prenom, nom, ville, garden_longueur, garden_largeur`,
      [garden_longueur, garden_largeur, id]
    );
    return result.rows[0];
  },

  /**
   * Supprime definitivement un utilisateur par son ID
   * @param {number} id - Identifiant de l'utilisateur
   */
  async delete(id) {
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  },
};

module.exports = userRepository;
