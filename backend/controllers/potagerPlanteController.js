// backend/controllers/potagerPlanteController.js
const potagerPlanteService = require("../services/potagerPlanteService");

/**
 * Controleur de gestion des plantes dans la grille d'un potager.
 * Responsabilite : extraire les donnees de req, appeler potagerPlanteService, formater res.
 * Aucune logique metier ici -- tout est delegue au service.
 */

const potagerPlanteController = {
  /**
   * @desc    Recupere toutes les plantes positionnees dans un potager
   * @route   GET /api/potagers/:id/plantes
   * @access  Prive
   */
  async getPlantes(req, res) {
    try {
      const placements = await potagerPlanteService.getByPotagerId(req.params.id);
      res.json(placements);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Place une plante dans une case du potager
   * @route   POST /api/potagers/:id/plantes
   * @access  Prive
   */
  async addPlante(req, res) {
    try {
      const placement = await potagerPlanteService.addPlante(req.params.id, req.body);
      res.status(201).json(placement);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Deplace une plante vers une nouvelle position dans la grille
   * @route   PUT /api/potagers/:id/plantes/:planteId
   * @access  Prive
   */
  async movePlante(req, res) {
    try {
      const placement = await potagerPlanteService.movePlante(
        req.params.id,
        req.params.planteId,
        req.body
      );
      res.json(placement);
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },

  /**
   * @desc    Retire une plante d'une case du potager
   * @route   DELETE /api/potagers/:id/plantes/:planteId
   * @access  Prive
   */
  async removePlante(req, res) {
    try {
      await potagerPlanteService.removePlante(req.params.planteId);
      res.json({ message: "Plante retirée du potager" });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message });
    }
  },
};

module.exports = potagerPlanteController;
