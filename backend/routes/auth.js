// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

/**
 * Routes d'authentification -- acces public
 * Base : /api/auth
 */

// POST /api/auth/register -- Inscription d'un nouvel utilisateur
router.post("/register", authController.register);

// POST /api/auth/login -- Connexion et generation du token JWT
router.post("/login", authController.login);

module.exports = router;
