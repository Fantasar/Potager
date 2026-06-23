// backend/controllers/planteController.js
const planteService = require("../services/planteService");

/**
 * Controleur de gestion du catalogue de plantes.
 * Responsabilite : extraire les donnees de req, appeler planteService, formater res.
 * Aucune logique metier ici -- tout est delegue au service.
 */

const planteController = {
  /**
   * @desc    Recupere toutes les plantes du catalogue
   * @route   GET /api/plantes
   * @access  Prive
   */
  async getAll(req, res) {
    try {
      const plantes = await planteService.getAll();
      res.json(plantes);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere une plante par son ID
   * @route   GET /api/plantes/:id
   * @access  Prive
   */
  async getById(req, res) {
    try {
      const plante = await planteService.getById(req.params.id);
      res.json(plante);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Ajoute une nouvelle plante au catalogue
   * @route   POST /api/plantes
   * @access  Prive
   */
  async create(req, res) {
    try {
      const plante = await planteService.create(req.body);
      res.status(201).json(plante);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Met a jour une plante existante
   * @route   PUT /api/plantes/:id
   * @access  Prive
   */
  async update(req, res) {
    try {
      const plante = await planteService.update(req.params.id, req.body);
      res.json(plante);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Supprime une plante du catalogue
   * @route   DELETE /api/plantes/:id
   * @access  Prive
   */
  async delete(req, res) {
    try {
      await planteService.delete(req.params.id);
      res.json({ message: "Plante supprimée" });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};

module.exports = planteController;
