// backend/services/authService.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");

/**
 * Service d'authentification.
 * Gere l'inscription et la connexion des utilisateurs.
 * Orchestre userRepository, hash les mots de passe via bcrypt et genere les tokens JWT.
 * Aucune logique d'acces aux donnees ici -- tout est delegue au repository.
 */

// Nombre de passes de hachage bcrypt -- 10 est le standard recommande
const SALT_ROUNDS = 10;

/**
 * Genere un token JWT pour un utilisateur authentifie
 * Factorise pour eviter la duplication entre register et login
 * @param {Object} user - { id, email, role_id }
 * @returns {string}    - Token JWT signe
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role_id: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const authService = {
  /**
   * Inscrit un nouvel utilisateur
   * Hash le mot de passe et connecte automatiquement via JWT
   * @param {Object} userData - { email, password, prenom, nom, ville, role_id }
   * @returns {Object}        - L'utilisateur cree
   */
  async register({ email, password, prenom, nom, ville, role_id }) {
    // Verifie que l'email n'est pas deja utilise
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw { status: 409, message: "Cet email est déjà utilisé" };
    }

    // Hash le mot de passe et cree l'utilisateur
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.create({
      email,
      password_hash,
      prenom,
      nom,
      ville,
      role_id: role_id || 1,
    });
    return user;
  },

  /**
   * Connecte un utilisateur existant
   * Verifie les identifiants et retourne un token JWT
   * @param {Object} credentials - { email, password }
   * @returns {Object}           - { token, user }
   */
  async login({ email, password }) {
    // Verifie que l'utilisateur existe -- message volontairement generique pour la securite
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: "Email ou mot de passe incorrect" };
    }

    // Verifie le mot de passe
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      throw { status: 401, message: "Email ou mot de passe incorrect" };
    }

    const token = generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
      },
    };
  },
};

module.exports = authService;
