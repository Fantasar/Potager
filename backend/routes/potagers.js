// backend/routes/potagers.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const potagerController = require("../controllers/potagerController");
const potagerPlanteController = require("../controllers/potagerPlanteController");

/**
 * Routes de gestion des potagers -- acces prive (token JWT requis)
 * Inclut les sous-routes de placement des plantes dans la grille.
 * Base : /api/potagers
 */

// GET    /api/potagers     -- Liste tous les potagers de l'utilisateur connecte
router.get("/", authenticate, potagerController.getAll);

// GET    /api/potagers/:id -- Recupere un potager par son ID
router.get("/:id", authenticate, potagerController.getById);

// POST   /api/potagers     -- Cree un nouveau potager
router.post("/", authenticate, potagerController.create);

// PUT    /api/potagers/:id          -- Met a jour un potager existant
router.put("/:id", authenticate, potagerController.update);

// PATCH  /api/potagers/:id/position -- Met a jour la position dans le jardin
router.patch("/:id/position", authenticate, potagerController.updatePosition);

// DELETE /api/potagers/:id          -- Supprime un potager
router.delete("/:id", authenticate, potagerController.delete);

// --- Sous-routes : plantes positionnees dans la grille du potager ---

// GET    /api/potagers/:id/plantes           -- Liste les plantes positionnees dans un potager
router.get("/:id/plantes", authenticate, potagerPlanteController.getPlantes);

// POST   /api/potagers/:id/plantes           -- Ajoute une plante dans une case du potager
router.post("/:id/plantes", authenticate, potagerPlanteController.addPlante);

// PUT    /api/potagers/:id/plantes/:planteId -- Deplace une plante vers une nouvelle position
router.put("/:id/plantes/:planteId", authenticate, potagerPlanteController.movePlante);

// DELETE /api/potagers/:id/plantes/:planteId -- Retire une plante d'une case du potager
router.delete("/:id/plantes/:planteId", authenticate, potagerPlanteController.removePlante);

module.exports = router;
