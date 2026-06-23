// backend/controllers/potagerController.js
const potagerService = require("../services/potagerService");

/**
 * Controleur de gestion des potagers.
 * Responsabilite : extraire les donnees de req, appeler potagerService, formater res.
 * Aucune logique metier ici -- tout est delegue au service.
 */

const potagerController = {
  /**
   * @desc    Recupere tous les potagers de l'utilisateur connecte
   * @route   GET /api/potagers
   * @access  Prive
   */
  async getAll(req, res) {
    try {
      const potagers = await potagerService.getAllByUser(req.user.id);
      res.json(potagers);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere un potager par son ID
   * @route   GET /api/potagers/:id
   * @access  Prive
   */
  async getById(req, res) {
    try {
      const potager = await potagerService.getById(req.params.id);
      res.json(potager);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Cree un nouveau potager pour l'utilisateur connecte
   * @route   POST /api/potagers
   * @access  Prive
   */
  async create(req, res) {
    try {
      // Attache l'ID de l'utilisateur connecte aux donnees du potager
      const potager = await potagerService.create({
        ...req.body,
        user_id: req.user.id,
      });
      res.status(201).json(potager);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Met a jour un potager existant
   * @route   PUT /api/potagers/:id
   * @access  Prive
   */
  async update(req, res) {
    try {
      const potager = await potagerService.update(req.params.id, req.body);
      res.json(potager);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Met a jour la position d'un potager dans le jardin
   * @route   PATCH /api/potagers/:id/position
   * @access  Prive
   */
  async updatePosition(req, res) {
    try {
      const potager = await potagerService.updatePosition(req.params.id, req.body);
      res.json(potager);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Supprime un potager
   * @route   DELETE /api/potagers/:id
   * @access  Prive
   */
  async delete(req, res) {
    try {
      await potagerService.delete(req.params.id);
      res.json({ message: "Potager supprimé" });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};

module.exports = potagerController;
