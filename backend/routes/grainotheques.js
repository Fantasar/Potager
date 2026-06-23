// backend/routes/grainotheques.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const grainothequeController = require("../controllers/grainothequeController");

/**
 * Routes de gestion des grainotheques -- acces prive (token JWT requis)
 * Base : /api/grainotheques
 */

// GET    /api/grainotheques          -- Liste toutes les grainotheques de l'utilisateur
router.get("/", authenticate, grainothequeController.getAll);

// GET    /api/grainotheques/:id      -- Recupere une grainotheque par son ID
router.get("/:id", authenticate, grainothequeController.getById);

// GET    /api/grainotheques/:id/fiches -- Liste les fiches d'une grainotheque
router.get("/:id/fiches", authenticate, grainothequeController.getFiches);

// POST   /api/grainotheques          -- Cree une nouvelle grainotheque
router.post("/", authenticate, grainothequeController.create);

// POST   /api/grainotheques/:id/fiches -- Ajoute une fiche a une grainotheque
router.post("/:id/fiches", authenticate, grainothequeController.createFiche);

// DELETE /api/grainotheques/:id      -- Supprime une grainotheque
router.delete("/:id", authenticate, grainothequeController.delete);

module.exports = router;
