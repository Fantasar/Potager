// backend/routes/users.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const userRepository = require("../repositories/userRepository");

/**
 * Routes utilisateur -- acces prive (token JWT requis)
 * Base : /api/users
 */

// GET /api/users/me -- Recupere le profil de l'utilisateur connecte
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/me/garden -- Met a jour les dimensions du jardin
router.patch("/me/garden", authenticate, async (req, res) => {
  try {
    const user = await userRepository.updateGarden(req.user.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
