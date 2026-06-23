// frontend/src/pages/Plantes.jsx
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import EmojiPicker from "../components/EmojiPicker";
import api from "../config/api";

/**
 * Page du catalogue de plantes.
 * Affiche toutes les plantes disponibles avec leurs caracteristiques.
 * Permet d'ajouter, modifier et supprimer des plantes.
 * Chaque plante peut avoir un emoji affiche sur la grille du potager.
 */
function Plantes() {
  const [plantes, setPlantes] = useState([]);
  const [references, setReferences] = useState({
    expositions: [],
    besoinsEnEau: [],
    typesDeSol: [],
    seeds: [],
  });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    variete: "",
    emoji: "",
    exposition_id: "",
    besoin_en_eau_id: "",
    type_de_sol_id: "",
    semis_id: "",
    hauteur: "",
    besoin_occupation_sol: "",
    temps_occupation_sol: "",
  });
  const [error, setError] = useState("");

  // Charge les plantes et les donnees de reference au montage
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Charge les plantes et toutes les donnees de reference en parallele
   */
  const fetchData = async () => {
    try {
      const [plantesRes, expoRes, eauRes, solRes, seedsRes] = await Promise.all([
        api.get("/plantes"),
        api.get("/references/expositions"),
        api.get("/references/besoins-en-eau"),
        api.get("/references/types-de-sol"),
        api.get("/references/seeds"),
      ]);
      setPlantes(plantesRes.data);
      setReferences({
        expositions: expoRes.data,
        besoinsEnEau: eauRes.data,
        typesDeSol: solRes.data,
        seeds: seedsRes.data,
      });
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Met a jour un champ du formulaire
   * @param {Event} e - Evenement de changement du champ
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Soumet le formulaire de creation ou de modification d'une plante
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await api.put(`/plantes/${editId}`, form);
      } else {
        await api.post("/plantes", form);
      }
      setForm({
        name: "", variete: "", emoji: "", exposition_id: "", besoin_en_eau_id: "",
        type_de_sol_id: "", semis_id: "", hauteur: "",
        besoin_occupation_sol: "", temps_occupation_sol: "",
      });
      setShowForm(false);
      setEditId(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement");
    }
  };

  /**
   * Pre-remplit le formulaire avec les donnees d'une plante a modifier
   * @param {Object} plante - La plante a editer
   */
  const handleEdit = (plante) => {
    setForm({
      name: plante.name,
      variete: plante.variete || "",
      emoji: plante.emoji || "",
      exposition_id: plante.exposition_id || "",
      besoin_en_eau_id: plante.besoin_en_eau_id || "",
      type_de_sol_id: plante.type_de_sol_id || "",
      semis_id: plante.semis_id || "",
      hauteur: plante.hauteur || "",
      besoin_occupation_sol: plante.besoin_occupation_sol || "",
      temps_occupation_sol: plante.temps_occupation_sol || "",
    });
    setEditId(plante.id);
    setShowForm(true);
  };

  /**
   * Supprime une plante apres confirmation
   * @param {number} id - Identifiant de la plante a supprimer
   */
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette plante ?")) return;
    try {
      await api.delete(`/plantes/${id}`);
      fetchData();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  /**
   * Retrouve le nom d'une reference par son ID dans une liste
   * @param {Array}  list - Liste des references
   * @param {number} id   - Identifiant de la reference
   * @returns {string}    - Nom de la reference ou chaine vide
   */
  const getRefName = (list, id) => {
    const item = list.find((r) => r.id === id);
    return item ? item.name : "";
  };

  const handleCancel = () => {
    setForm({
      name: "", variete: "", emoji: "", exposition_id: "", besoin_en_eau_id: "",
      type_de_sol_id: "", semis_id: "", hauteur: "",
      besoin_occupation_sol: "", temps_occupation_sol: "",
    });
    setShowForm(false);
    setEditId(null);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-green-800">Catalogue de plantes</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            + Nouvelle plante
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-6 space-y-4">
          <h2 className="text-xl font-semibold text-green-800">
            {editId ? "Modifier la plante" : "Nouvelle plante"}
          </h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <EmojiPicker
                value={form.emoji}
                onChange={(emoji) => setForm({ ...form, emoji })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text" name="name" value={form.name} onChange={handleChange} required
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Variété</label>
              <input
                type="text" name="variete" value={form.variete} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exposition</label>
              <select name="exposition_id" value={form.exposition_id} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">-- Choisir --</option>
                {references.expositions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Besoin en eau</label>
              <select name="besoin_en_eau_id" value={form.besoin_en_eau_id} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">-- Choisir --</option>
                {references.besoinsEnEau.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de sol</label>
              <select name="type_de_sol_id" value={form.type_de_sol_id} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">-- Choisir --</option>
                {references.typesDeSol.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de semis</label>
              <select name="semis_id" value={form.semis_id} onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">-- Choisir --</option>
                {references.seeds.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hauteur (cm)</label>
              <input type="number" name="hauteur" value={form.hauteur} onChange={handleChange} step="0.1" min="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Occupation sol (cm)</label>
              <input type="number" name="besoin_occupation_sol" value={form.besoin_occupation_sol} onChange={handleChange} min="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temps occupation (j)</label>
              <input type="number" name="temps_occupation_sol" value={form.temps_occupation_sol} onChange={handleChange} min="0"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
              {editId ? "Enregistrer" : "Créer"}
            </button>
            <button type="button" onClick={handleCancel}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2 rounded transition">
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : plantes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Aucune plante dans le catalogue</p>
          <p>Ajoutez votre première plante pour commencer !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plantes.map((plante) => (
            <div key={plante.id} className="bg-white shadow-md rounded-lg p-5">
              <div className="flex items-center gap-2 mb-1">
                {plante.emoji && (
                  <span className="text-2xl">{plante.emoji}</span>
                )}
                <h3 className="text-lg font-semibold text-green-800">{plante.name}</h3>
              </div>
              {plante.variete && (
                <p className="text-gray-500 text-sm italic mb-2">{plante.variete}</p>
              )}
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                {plante.exposition_id && (
                  <p>Exposition : {getRefName(references.expositions, plante.exposition_id)}</p>
                )}
                {plante.besoin_en_eau_id && (
                  <p>Eau : {getRefName(references.besoinsEnEau, plante.besoin_en_eau_id)}</p>
                )}
                {plante.type_de_sol_id && (
                  <p>Sol : {getRefName(references.typesDeSol, plante.type_de_sol_id)}</p>
                )}
                {plante.hauteur && <p>Hauteur : {plante.hauteur} cm</p>}
                {plante.besoin_occupation_sol && (
                  <p>Occupation sol : {plante.besoin_occupation_sol} cm</p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(plante)}
                  className="text-sm text-green-600 hover:text-green-800 transition">
                  Modifier
                </button>
                <button onClick={() => handleDelete(plante.id)}
                  className="text-sm text-red-500 hover:text-red-700 transition">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Plantes;
