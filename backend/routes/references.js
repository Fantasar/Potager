// backend/routes/references.js
const express = require("express");
const router = express.Router();
const referenceController = require("../controllers/referenceController");

/**
 * Routes des donnees de reference -- acces public
 * Utilisees par les formulaires du frontend pour peupler les listes deroulantes.
 * Base : /api/references
 */

// GET /api/references/types-de-sol   -- Liste tous les types de sol
router.get("/types-de-sol", referenceController.getTypesDeSol);

// GET /api/references/expositions    -- Liste toutes les expositions
router.get("/expositions", referenceController.getExpositions);

// GET /api/references/besoins-en-eau -- Liste tous les niveaux de besoin en eau
router.get("/besoins-en-eau", referenceController.getBesoinsEnEau);

// GET /api/references/seeds          -- Liste tous les types de semis
router.get("/seeds", referenceController.getSeeds);

// GET /api/references/emojis         -- Liste le catalogue d'emojis pour les plantes
router.get("/emojis", referenceController.getEmojis);

module.exports = router;
