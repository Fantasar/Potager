// backend/routes/plantes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const planteController = require("../controllers/planteController");

/**
 * Routes de gestion du catalogue de plantes -- acces prive (token JWT requis)
 * Base : /api/plantes
 */

// GET    /api/plantes     -- Liste toutes les plantes du catalogue
router.get("/", authenticate, planteController.getAll);

// GET    /api/plantes/:id -- Recupere une plante par son ID
router.get("/:id", authenticate, planteController.getById);

// POST   /api/plantes     -- Ajoute une nouvelle plante au catalogue
router.post("/", authenticate, planteController.create);

// PUT    /api/plantes/:id -- Met a jour une plante existante
router.put("/:id", authenticate, planteController.update);

// DELETE /api/plantes/:id -- Supprime une plante du catalogue
router.delete("/:id", authenticate, planteController.delete);

module.exports = router;
