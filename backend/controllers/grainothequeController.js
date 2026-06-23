// backend/controllers/grainothequeController.js
const grainothequeService = require("../services/grainothequeService");

/**
 * Controleur de gestion des grainotheques.
 * Responsabilite : extraire les donnees de req, appeler grainothequeService, formater res.
 * Aucune logique metier ici -- tout est delegue au service.
 */

const grainothequeController = {
  /**
   * @desc    Recupere toutes les grainotheques de l'utilisateur connecte
   * @route   GET /api/grainotheques
   * @access  Prive
   */
  async getAll(req, res) {
    try {
      const grainotheques = await grainothequeService.getAllByUser(req.user.id);
      res.json(grainotheques);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere une grainotheque par son ID
   * @route   GET /api/grainotheques/:id
   * @access  Prive
   */
  async getById(req, res) {
    try {
      const grainotheque = await grainothequeService.getById(req.params.id);
      res.json(grainotheque);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere toutes les fiches d'une grainotheque
   * @route   GET /api/grainotheques/:id/fiches
   * @access  Prive
   */
  async getFiches(req, res) {
    try {
      const fiches = await grainothequeService.getFiches(req.params.id);
      res.json(fiches);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Cree une nouvelle grainotheque pour l'utilisateur connecte
   * @route   POST /api/grainotheques
   * @access  Prive
   */
  async create(req, res) {
    try {
      // Attache l'ID de l'utilisateur connecte aux donnees
      const grainotheque = await grainothequeService.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(grainotheque);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Cree une nouvelle fiche dans une grainotheque
   * @route   POST /api/grainotheques/:id/fiches
   * @access  Prive
   */
  async createFiche(req, res) {
    try {
      // Attache l'ID de la grainotheque depuis l'URL
      const fiche = await grainothequeService.createFiche({
        ...req.body,
        grainotheque_id: req.params.id,
      });
      res.status(201).json(fiche);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Supprime une grainotheque
   * @route   DELETE /api/grainotheques/:id
   * @access  Prive
   */
  async delete(req, res) {
    try {
      await grainothequeService.delete(req.params.id);
      res.json({ message: "Grainothèque supprimée" });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};

module.exports = grainothequeController;
