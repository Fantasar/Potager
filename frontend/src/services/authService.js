// frontend/src/services/authService.js
import api from "../config/api";

/**
 * Service d'authentification cote frontend.
 * Encapsule les appels API lies a l'inscription et la connexion.
 */
export const authService = {
  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} data - { email, password, prenom, nom, ville }
   * @returns {Promise}   - Reponse de l'API
   */
  register(data) {
    return api.post("/auth/register", data);
  },

  /**
   * Connecte un utilisateur existant
   * @param {Object} data - { email, password }
   * @returns {Promise}   - Reponse contenant le token et les infos utilisateur
   */
  login(data) {
    return api.post("/auth/login", data);
  },
};
