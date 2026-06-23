// frontend/src/pages/Dashboard.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import api from "../config/api";
import { grassBackground } from "../assets/grass-pattern";
import Papy from "../components/Papy";

/**
 * Vue jardin interactive.
 * Affiche un jardin delimite (taille definie par l'utilisateur) avec un fond d'herbe
 * ou les carres de potager sont des rectangles en bois positionnables librement.
 * Un clic simple sur un carre navigue vers la page de detail.
 */

// Echelle : pixels par metre
const SCALE = 100;
// Epaisseur de la bordure bois des carres
const BORDER = 6;
// Seuil en pixels pour distinguer un clic d'un drag
const DRAG_THRESHOLD = 5;

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const gardenRef = useRef(null);

  const [potagers, setPotagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dimensions du jardin en metres
  const [gardenSize, setGardenSize] = useState(null);
  const [showGardenSetup, setShowGardenSetup] = useState(false);
  const [gardenForm, setGardenForm] = useState({ longueur: "10", largeur: "10" });

  // Etat du drag en cours
  const [dragging, setDragging] = useState(null);
  const [dragPos, setDragPos] = useState(null);

  // Modale de creation / edition de potager
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", longueur: "", largeur: "" });

  // Potager survole
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Charge le profil utilisateur (pour les dimensions du jardin) et les potagers
   */
  const fetchData = async () => {
    try {
      const [userRes, potagersRes] = await Promise.all([
        api.get("/users/me"),
        api.get("/potagers"),
      ]);
      setPotagers(potagersRes.data);

      if (userRes.data.garden_longueur && userRes.data.garden_largeur) {
        setGardenSize({
          longueur: parseFloat(userRes.data.garden_longueur),
          largeur: parseFloat(userRes.data.garden_largeur),
        });
      } else {
        // Premiere visite -- afficher le dialogue de configuration
        setShowGardenSetup(true);
      }
    } catch (err) {
      setError("Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sauvegarde les dimensions du jardin
   */
  const handleGardenSetup = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/users/me/garden", {
        garden_longueur: parseFloat(gardenForm.longueur),
        garden_largeur: parseFloat(gardenForm.largeur),
      });
      setGardenSize({
        longueur: parseFloat(gardenForm.longueur),
        largeur: parseFloat(gardenForm.largeur),
      });
      setShowGardenSetup(false);
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
    }
  };

  // ============================================
  // DRAG & DROP LIBRE (mouse events)
  // ============================================

  const handleMouseDown = (e, potager) => {
    if (e.target.closest("button")) return;
    e.preventDefault();

    const garden = gardenRef.current;
    if (!garden) return;
    const gardenRect = garden.getBoundingClientRect();
    const gardenW = gardenSize.longueur * SCALE;
    const gardenH = gardenSize.largeur * SCALE;

    const potagerW = parseFloat(potager.longueur) * SCALE;
    const potagerH = parseFloat(potager.largeur) * SCALE;
    const potagerX = ((parseFloat(potager.garden_x) || 50) / 100) * gardenW - potagerW / 2;
    const potagerY = ((parseFloat(potager.garden_y) || 50) / 100) * gardenH - potagerH / 2;

    // Offset du padding du jardin dans la page
    const gardenOffsetX = (gardenRect.width - gardenW) / 2;
    const gardenOffsetY = (gardenRect.height - gardenH) / 2;

    setDragging({
      id: potager.id,
      offsetX: e.clientX - gardenRect.left - gardenOffsetX - potagerX,
      offsetY: e.clientY - gardenRect.top - gardenOffsetY - potagerY,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
      gardenOffsetX,
      gardenOffsetY,
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !gardenSize) return;
    const garden = gardenRef.current;
    if (!garden) return;
    const gardenRect = garden.getBoundingClientRect();

    const dist = Math.abs(e.clientX - dragging.startX) + Math.abs(e.clientY - dragging.startY);
    if (dist < DRAG_THRESHOLD && !dragging.hasMoved) return;

    if (!dragging.hasMoved) {
      setDragging((prev) => ({ ...prev, hasMoved: true }));
    }

    const gardenW = gardenSize.longueur * SCALE;
    const gardenH = gardenSize.largeur * SCALE;

    let x = e.clientX - gardenRect.left - dragging.gardenOffsetX - dragging.offsetX;
    let y = e.clientY - gardenRect.top - dragging.gardenOffsetY - dragging.offsetY;

    const potager = potagers.find((p) => p.id === dragging.id);
    if (!potager) return;
    const w = parseFloat(potager.longueur) * SCALE;
    const h = parseFloat(potager.largeur) * SCALE;

    x = Math.max(0, Math.min(x, gardenW - w));
    y = Math.max(0, Math.min(y, gardenH - h));

    setDragPos({ x, y });
  }, [dragging, potagers, gardenSize]);

  const handleMouseUp = useCallback(async () => {
    if (!dragging) return;

    if (!dragging.hasMoved) {
      setDragging(null);
      setDragPos(null);
      navigate(`/dashboard/${dragging.id}`);
      return;
    }

    if (gardenSize && dragPos) {
      const gardenW = gardenSize.longueur * SCALE;
      const gardenH = gardenSize.largeur * SCALE;
      const potager = potagers.find((p) => p.id === dragging.id);
      if (potager) {
        const w = parseFloat(potager.longueur) * SCALE;
        const h = parseFloat(potager.largeur) * SCALE;
        const garden_x = ((dragPos.x + w / 2) / gardenW) * 100;
        const garden_y = ((dragPos.y + h / 2) / gardenH) * 100;

        setPotagers((prev) =>
          prev.map((p) =>
            p.id === dragging.id ? { ...p, garden_x, garden_y } : p
          )
        );
        api.patch(`/potagers/${dragging.id}/position`, { garden_x, garden_y }).catch(() => {});
      }
    }

    setDragging(null);
    setDragPos(null);
  }, [dragging, dragPos, potagers, gardenSize, navigate]);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  // ============================================
  // FORMULAIRE POTAGER
  // ============================================

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editId) {
        await api.put(`/potagers/${editId}`, form);
      } else {
        await api.post("/potagers", form);
      }
      setForm({ name: "", longueur: "", largeur: "" });
      setShowModal(false);
      setEditId(null);
      const res = await api.get("/potagers");
      setPotagers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (e, potager) => {
    e.stopPropagation();
    setForm({
      name: potager.name,
      longueur: potager.longueur || "",
      largeur: potager.largeur || "",
    });
    setEditId(potager.id);
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Supprimer ce potager ?")) return;
    try {
      await api.delete(`/potagers/${id}`);
      setPotagers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  const handleCancel = () => {
    setForm({ name: "", longueur: "", largeur: "" });
    setShowModal(false);
    setEditId(null);
  };

  // ============================================
  // RENDU
  // ============================================

  // Dimensions du jardin en pixels
  const gardenW = gardenSize ? gardenSize.longueur * SCALE : 0;
  const gardenH = gardenSize ? gardenSize.largeur * SCALE : 0;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
          {error}
        </div>
      )}

      {/* Zone exterieure -- fond neutre */}
      <div
        className="flex-1 overflow-auto flex justify-center"
        style={{ backgroundColor: "#e8e0d4" }}
      >
        {loading ? (
          <p className="text-gray-500 text-lg">Chargement du jardin...</p>
        ) : !gardenSize ? (
          // Premier affichage sans jardin -- affiche juste un message d'accueil
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-600 text-xl font-bold mb-2">🌿 Bienvenue</p>
            <p className="text-gray-500 mb-4">Configurez les dimensions de votre jardin pour commencer</p>
            <button
              onClick={() => setShowGardenSetup(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition"
            >
              Configurer mon jardin
            </button>
          </div>
        ) : (
          // Jardin delimite avec fond d'herbe + papy a droite
          <div className="flex items-end gap-4" style={{ padding: 30 }}>
            {/* Le jardin lui-meme */}
            <div
              ref={gardenRef}
              className="relative select-none"
              style={{
                width: gardenW,
                height: gardenH,
                ...grassBackground,
                border: "3px solid #6B4226",
                borderRadius: 8,
                boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 0 60px rgba(0,0,0,0.1)",
                cursor: dragging?.hasMoved ? "grabbing" : "default",
              }}
            >
              {/* Bouton parametres du jardin en haut a droite */}
              <button
                onClick={() => {
                  setGardenForm({
                    longueur: gardenSize.longueur.toString(),
                    largeur: gardenSize.largeur.toString(),
                  });
                  setShowGardenSetup(true);
                }}
                className="absolute top-2 right-2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-xl hover:rotate-90 transition-all duration-300 z-50"
                title="Paramètres du jardin"
              >
                ⚙️
              </button>

              {/* Etat vide */}
              {potagers.length === 0 && !showModal && (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                    Votre jardin est vide
                  </p>
                  <p className="text-white/80 mb-4 drop-shadow">
                    Créez votre premier carré de potager
                  </p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-white text-green-700 font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-green-50 transition"
                  >
                    + Créer un potager
                  </button>
                </div>
              )}

              {/* Carres de potager */}
              {potagers.map((potager) => {
                const isBeingDragged = dragging?.id === potager.id && dragging.hasMoved;
                const w = parseFloat(potager.longueur) * SCALE;
                const h = parseFloat(potager.largeur) * SCALE;
                let left, top;

                if (isBeingDragged && dragPos) {
                  left = dragPos.x;
                  top = dragPos.y;
                } else {
                  left = ((parseFloat(potager.garden_x) || 50) / 100) * gardenW - w / 2;
                  top = ((parseFloat(potager.garden_y) || 50) / 100) * gardenH - h / 2;
                }

                return (
                  <div
                    key={potager.id}
                    onMouseDown={(e) => handleMouseDown(e, potager)}
                    onMouseEnter={() => setHoveredId(potager.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`absolute rounded-md flex flex-col items-center justify-center cursor-grab active:cursor-grabbing transition-shadow ${
                      isBeingDragged ? "z-50 opacity-90" : "z-10"
                    }`}
                    style={{
                      left,
                      top,
                      width: w,
                      height: h,
                      border: `${BORDER}px solid #8B5E3C`,
                      backgroundColor: "#f5f0e8",
                      boxShadow: isBeingDragged
                        ? "0 20px 40px rgba(0,0,0,0.35)"
                        : "inset 0 0 0 1px #6B4226, 0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    <p className="font-bold text-green-900 text-sm text-center px-2 truncate w-full">
                      {potager.name}
                    </p>
                    <p className="text-xs text-green-800/60">
                      {potager.longueur}m × {potager.largeur}m
                    </p>

                    {hoveredId === potager.id && !dragging && (
                      <div className="absolute -top-3 -right-3 flex gap-1">
                        <button
                          onClick={(e) => handleEdit(e, potager)}
                          className="w-6 h-6 bg-white border border-gray-300 rounded-full text-xs flex items-center justify-center shadow hover:bg-blue-50 transition"
                          title="Modifier"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, potager.id)}
                          className="w-6 h-6 bg-white border border-gray-300 rounded-full text-xs flex items-center justify-center shadow hover:bg-red-50 transition"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bouton flottant de creation */}
              {potagers.length > 0 && !showModal && (
                <button
                  onClick={() => setShowModal(true)}
                  className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-green-700 font-bold w-12 h-12 rounded-full shadow-lg text-2xl flex items-center justify-center hover:scale-110 transition z-50"
                  title="Nouveau potager"
                >
                  +
                </button>
              )}
            </div>

            {/* Papy jardinier a droite du jardin */}
            <Papy message={
              potagers.length === 0
                ? "Bienvenue ! Cliquez sur le + pour créer votre premier carré de potager."
                : "Cliquez sur un carré pour y planter vos légumes !"
            } />
          </div>
        )}

        {/* Modale de creation / edition */}
        {showModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-6 w-96 space-y-4"
            >
              <h2 className="text-xl font-bold text-green-800">
                {editId ? "Modifier le potager" : "Nouveau potager"}
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Mon potager"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longueur (m)</label>
                  <input
                    type="number"
                    name="longueur"
                    value={form.longueur}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="0.5"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Largeur (m)</label>
                  <input
                    type="number"
                    name="largeur"
                    value={form.largeur}
                    onChange={handleChange}
                    required
                    step="0.1"
                    min="0.5"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
                >
                  {editId ? "Enregistrer" : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modale parametres du jardin */}
        {showGardenSetup && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <form
              onSubmit={handleGardenSetup}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl p-8 w-96 space-y-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-xl font-bold text-green-800">
                  Paramètres du jardin
                </h2>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase mb-2">
                  Dimensions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longueur (m)
                    </label>
                    <input
                      type="number"
                      value={gardenForm.longueur}
                      onChange={(e) => setGardenForm({ ...gardenForm, longueur: e.target.value })}
                      required
                      step="1"
                      min="5"
                      max="100"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Largeur (m)
                    </label>
                    <input
                      type="number"
                      value={gardenForm.largeur}
                      onChange={(e) => setGardenForm({ ...gardenForm, largeur: e.target.value })}
                      required
                      step="1"
                      min="5"
                      max="100"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Surface : {(parseFloat(gardenForm.longueur) || 0) * (parseFloat(gardenForm.largeur) || 0)} m²
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
                >
                  Enregistrer
                </button>
                {gardenSize && (
                  <button
                    type="button"
                    onClick={() => setShowGardenSetup(false)}
                    className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded transition"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
