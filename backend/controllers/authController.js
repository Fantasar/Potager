// backend/controllers/authController.js
const authService = require("../services/authService");

/**
 * Controleur d'authentification.
 * Responsabilite : extraire les donnees de req, appeler authService, formater res.
 * Aucune logique metier ici -- tout est delegue au service.
 */

const authController = {
  /**
   * @desc    Inscription d'un nouvel utilisateur
   * @route   POST /api/auth/register
   * @access  Public
   */
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Connexion d'un utilisateur existant
   * @route   POST /api/auth/login
   * @access  Public
   */
  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};

module.exports = authController;
