// backend/controllers/referenceController.js
const referenceService = require("../services/referenceService");
const emojiRepository = require("../repositories/emojiRepository");

/**
 * Controleur des donnees de reference.
 * Expose les tables de reference (type_de_sol, exposition, besoin_en_eau, seeds, emojis).
 * Ces routes sont publiques -- utilisees par les formulaires du frontend.
 */

const referenceController = {
  /**
   * @desc    Recupere tous les types de sol
   * @route   GET /api/references/types-de-sol
   * @access  Public
   */
  async getTypesDeSol(req, res) {
    try {
      const types = await referenceService.getTypesDeSol();
      res.json(types);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere toutes les expositions
   * @route   GET /api/references/expositions
   * @access  Public
   */
  async getExpositions(req, res) {
    try {
      const expositions = await referenceService.getExpositions();
      res.json(expositions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere tous les niveaux de besoin en eau
   * @route   GET /api/references/besoins-en-eau
   * @access  Public
   */
  async getBesoinsEnEau(req, res) {
    try {
      const besoins = await referenceService.getBesoinsEnEau();
      res.json(besoins);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere tous les types de semis
   * @route   GET /api/references/seeds
   * @access  Public
   */
  async getSeeds(req, res) {
    try {
      const seeds = await referenceService.getSeeds();
      res.json(seeds);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * @desc    Recupere le catalogue d'emojis pour les plantes
   * @route   GET /api/references/emojis
   * @access  Public
   */
  async getEmojis(req, res) {
    try {
      const emojis = await emojiRepository.findAll();
      res.json(emojis);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = referenceController;
