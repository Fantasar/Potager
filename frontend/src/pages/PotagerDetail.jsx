// frontend/src/pages/PotagerDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import api from "../config/api";

/**
 * Page de detail d'un potager avec vue en grille interactive.
 * Affiche un quadrillage (cases de 25cm x 25cm) ou l'utilisateur peut
 * glisser-deposer des plantes depuis la sidebar ou deplacer les plantes
 * deja posees directement sur la grille.
 */

// Taille d'une case en cm
const CELL_SIZE_CM = 25;
// Taille d'affichage d'une case en pixels
const CELL_PX = 70;
// Epaisseur de la bordure bois du potager en pixels
const BORDER_PX = 8;

/**
 * Calcule le nombre de cases occupees par une plante dans chaque direction
 * @param {number|null} occupationCm - Occupation au sol en cm
 * @returns {number}
 */
const getSpan = (occupationCm) => {
  if (!occupationCm || occupationCm <= 0) return 1;
  return Math.ceil(occupationCm / CELL_SIZE_CM);
};

function PotagerDetail() {
  const { id } = useParams();
  const [potager, setPotager] = useState(null);
  const [plantes, setPlantes] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragOverCells, setDragOverCells] = useState(new Set());

  // Infos sur l'element en cours de drag -- soit une plante de la sidebar, soit un placement existant
  const [dragData, setDragData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  /**
   * Charge toutes les donnees necessaires en parallele
   */
  const fetchData = async () => {
    try {
      const [potagerRes, plantesRes, placementsRes] = await Promise.all([
        api.get(`/potagers/${id}`),
        api.get("/plantes"),
        api.get(`/potagers/${id}/plantes`),
      ]);
      setPotager(potagerRes.data);
      setPlantes(plantesRes.data);
      setPlacements(placementsRes.data);
    } catch (err) {
      setError("Erreur lors du chargement du potager");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Demarre le drag d'une nouvelle plante depuis la sidebar
   * @param {DragEvent} e      - Evenement de drag
   * @param {Object}    plante - La plante du catalogue
   */
  const handleSidebarDragStart = (e, plante) => {
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "new",
      planteId: plante.id,
    }));
    e.dataTransfer.effectAllowed = "copyMove";
    setDragData({
      type: "new",
      occupation: plante.besoin_occupation_sol,
      emoji: plante.emoji,
      name: plante.name,
    });
  };

  /**
   * Demarre le drag d'une plante deja posee sur la grille
   * @param {DragEvent} e         - Evenement de drag
   * @param {Object}    placement - Le placement existant a deplacer
   */
  const handlePlacementDragStart = (e, placement) => {
    e.stopPropagation();
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: "move",
      placementId: placement.id,
      planteId: placement.plante_id,
    }));
    e.dataTransfer.effectAllowed = "copyMove";
    setDragData({
      type: "move",
      placementId: placement.id,
      occupation: placement.plante_occupation,
      emoji: placement.plante_emoji,
      name: placement.plante_name,
    });
  };

  /**
   * Autorise le drop sur une case de la grille
   * @param {DragEvent} e - Evenement dragover
   */
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  /**
   * Met en surbrillance toutes les cases que la plante occuperait
   * @param {number} x - Coordonnee X de la case survolee
   * @param {number} y - Coordonnee Y de la case survolee
   */
  const handleDragEnter = (x, y) => {
    if (!dragData) return;
    const span = getSpan(dragData.occupation);
    const cells = new Set();
    for (let dy = 0; dy < span; dy++) {
      for (let dx = 0; dx < span; dx++) {
        cells.add(`${x + dx}-${y + dy}`);
      }
    }
    setDragOverCells(cells);
  };

  /**
   * Gere le depot sur une case -- soit un nouveau placement, soit un deplacement
   * @param {DragEvent} e - Evenement drop
   * @param {number}    x - Coordonnee X cible
   * @param {number}    y - Coordonnee Y cible
   */
  const handleDrop = async (e, x, y) => {
    e.preventDefault();
    setDragOverCells(new Set());
    setDragData(null);

    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData("application/json"));
    } catch {
      return;
    }

    setError("");

    if (data.type === "move") {
      // Deplacement d'un placement existant
      try {
        const res = await api.put(`/potagers/${id}/plantes/${data.placementId}`, {
          position_x: x,
          position_y: y,
        });
        // Met a jour la position dans le state en conservant les infos de la plante
        setPlacements((prev) =>
          prev.map((p) =>
            p.id === data.placementId
              ? { ...p, position_x: res.data.position_x, position_y: res.data.position_y }
              : p
          )
        );
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors du déplacement");
      }
    } else {
      // Nouveau placement depuis la sidebar
      try {
        const res = await api.post(`/potagers/${id}/plantes`, {
          plante_id: data.planteId,
          position_x: x,
          position_y: y,
        });
        const plante = plantes.find((p) => p.id === data.planteId);
        setPlacements((prev) => [
          ...prev,
          {
            ...res.data,
            plante_name: plante?.name || "Plante",
            plante_variete: plante?.variete || "",
            plante_emoji: plante?.emoji || null,
            plante_occupation: plante?.besoin_occupation_sol || null,
          },
        ]);
      } catch (err) {
        setError(err.response?.data?.error || "Erreur lors du placement");
      }
    }
  };

  /**
   * Retire une plante du potager
   * @param {number} placementId - Identifiant du placement a supprimer
   */
  const handleRemove = async (placementId) => {
    setError("");
    try {
      await api.delete(`/potagers/${id}/plantes/${placementId}`);
      setPlacements(placements.filter((p) => p.id !== placementId));
    } catch (err) {
      setError("Erreur lors du retrait de la plante");
    }
  };

  /**
   * Nettoie l'etat de drag quand le drag se termine
   */
  const handleDragEnd = () => {
    setDragOverCells(new Set());
    setDragData(null);
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-gray-500">Chargement...</p>
      </Layout>
    );
  }

  if (!potager) {
    return (
      <Layout>
        <p className="text-red-500">Potager non trouvé</p>
      </Layout>
    );
  }

  // Calcul des dimensions de la grille
  const cols = Math.floor(parseFloat(potager.longueur) * 100 / CELL_SIZE_CM);
  const rows = Math.floor(parseFloat(potager.largeur) * 100 / CELL_SIZE_CM);

  // Set des cases couvertes -- exclut le placement en cours de deplacement
  const coveredCells = new Set();
  placements.forEach((p) => {
    if (dragData?.type === "move" && dragData.placementId === p.id) return;
    const span = getSpan(p.plante_occupation);
    for (let dy = 0; dy < span; dy++) {
      for (let dx = 0; dx < span; dx++) {
        coveredCells.add(`${p.position_x + dx}-${p.position_y + dy}`);
      }
    }
  });

  return (
    <Layout>
      <div className="mb-4">
        <Link to="/dashboard" className="text-green-600 hover:underline text-sm">
          ← Retour au dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-green-800 mb-1">{potager.name}</h1>
      <p className="text-gray-500 mb-6">
        {potager.longueur}m × {potager.largeur}m — Grille {cols} × {rows} cases (25cm × 25cm)
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-center" style={{ gap: "clamp(16px, 3vw, 48px)" }}>
        {/* Sidebar -- catalogue de plantes draggables */}
        <div className="w-56 shrink-0">
          <h2 className="text-lg font-semibold text-green-800 mb-3">Plantes</h2>
          {plantes.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Aucune plante dans le catalogue.{" "}
              <Link to="/plantes" className="text-green-600 hover:underline">
                En ajouter
              </Link>
            </p>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {plantes.map((plante) => (
                <div
                  key={plante.id}
                  draggable="true"
                  onDragStart={(e) => handleSidebarDragStart(e, plante)}
                  onDragEnd={handleDragEnd}
                  className="bg-white border border-green-300 rounded px-3 py-2 cursor-grab active:cursor-grabbing hover:bg-green-50 transition select-none"
                >
                  <div className="flex items-center gap-2">
                    {plante.emoji && <span className="text-lg">{plante.emoji}</span>}
                    <p className="text-sm font-medium text-green-800">{plante.name}</p>
                  </div>
                  {plante.variete && (
                    <p className="text-xs text-gray-400 italic">{plante.variete}</p>
                  )}
                  {plante.besoin_occupation_sol && (
                    <p className="text-xs text-gray-400">
                      {plante.besoin_occupation_sol}cm
                      ({getSpan(plante.besoin_occupation_sol)}×{getSpan(plante.besoin_occupation_sol)} cases)
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grille du potager */}
        <div className="overflow-auto">
          <div
            style={{
              position: "relative",
              width: cols * CELL_PX + (cols + 1) + BORDER_PX * 2,
              height: rows * CELL_PX + (rows + 1) + BORDER_PX * 2,
            }}
          >
            {/* Couche 1 : grille de fond avec les cases vides (cibles de drop) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${CELL_PX}px)`,
                gridTemplateRows: `repeat(${rows}, ${CELL_PX}px)`,
                gap: "1px",
                backgroundColor: "#d1d5db",
                border: `${BORDER_PX}px solid #8B5E3C`,
                borderRadius: "6px",
                boxShadow: "inset 0 0 0 1px #6B4226, 0 2px 8px rgba(0,0,0,0.15)",
                position: "absolute",
                inset: 0,
              }}
            >
              {Array.from({ length: rows }, (_, y) =>
                Array.from({ length: cols }, (_, x) => {
                  const key = `${x}-${y}`;
                  const isCovered = coveredCells.has(key);
                  const isOver = dragOverCells.has(key);

                  return (
                    <div
                      key={key}
                      onDragOver={handleDragOver}
                      onDragEnter={() => handleDragEnter(x, y)}
                      onDrop={(e) => handleDrop(e, x, y)}
                      className={`
                        ${isCovered ? "bg-transparent" : "bg-white"}
                        ${isOver && !isCovered ? "bg-green-100" : ""}
                        ${!isCovered && !isOver ? "hover:bg-gray-50" : ""}
                        transition-colors
                      `}
                      style={{ width: CELL_PX, height: CELL_PX }}
                    />
                  );
                })
              )}
            </div>

            {/* Couche 2 : plantes positionnees comme blocs fusionnes et draggables */}
            {placements.map((p) => {
              const span = getSpan(p.plante_occupation);
              const left = BORDER_PX + p.position_x * (CELL_PX + 1);
              const top = BORDER_PX + p.position_y * (CELL_PX + 1);
              const width = span * CELL_PX + (span - 1);
              const height = span * CELL_PX + (span - 1);
              // Rend le bloc semi-transparent pendant qu'on le deplace
              const isBeingDragged = dragData?.type === "move" && dragData.placementId === p.id;

              return (
                <div
                  key={`plant-${p.id}`}
                  draggable="true"
                  onDragStart={(e) => handlePlacementDragStart(e, p)}
                  onDragEnd={handleDragEnd}
                  className={`absolute bg-green-200 border-2 border-green-500 rounded-md flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none ${
                    isBeingDragged ? "opacity-30" : ""
                  }`}
                  style={{ left, top, width, height }}
                >
                  {p.plante_emoji && (
                    <span
                      className="leading-none"
                      style={{ fontSize: Math.min(span * 24, 48) }}
                    >
                      {p.plante_emoji}
                    </span>
                  )}
                  <p
                    className="font-semibold text-green-900 leading-tight text-center px-1 truncate w-full"
                    style={{ fontSize: Math.max(10, Math.min(span * 7, 16)) }}
                  >
                    {p.plante_name}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(p.id);
                    }}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-400 hover:bg-red-500 text-white rounded-full text-xs leading-none flex items-center justify-center transition"
                    title="Retirer"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {/* Zone de survol de drag -- preview de la zone cible */}
            {dragData && dragOverCells.size > 0 && (() => {
              const cells = Array.from(dragOverCells).map((c) => {
                const [cx, cy] = c.split("-").map(Number);
                return { x: cx, y: cy };
              });
              const minX = Math.min(...cells.map((c) => c.x));
              const minY = Math.min(...cells.map((c) => c.y));
              const span = getSpan(dragData.occupation);
              const hasConflict = cells.some((c) => coveredCells.has(`${c.x}-${c.y}`));
              const left = BORDER_PX + minX * (CELL_PX + 1);
              const top = BORDER_PX + minY * (CELL_PX + 1);
              const width = span * CELL_PX + (span - 1);
              const height = span * CELL_PX + (span - 1);

              return (
                <div
                  className={`absolute rounded-md border-2 border-dashed pointer-events-none flex flex-col items-center justify-center ${
                    hasConflict
                      ? "bg-red-100/60 border-red-400"
                      : "bg-green-100/60 border-green-400"
                  }`}
                  style={{ left, top, width, height }}
                >
                  {dragData.emoji && (
                    <span className="text-2xl opacity-50">{dragData.emoji}</span>
                  )}
                  <p className="text-xs text-green-800 opacity-50 font-medium">
                    {dragData.name}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Sidebar droite -- recapitulatif des plantes posees dans ce potager */}
        <div className="w-64 shrink-0">
          <h2 className="text-lg font-semibold text-green-800 mb-3">Dans ce carré</h2>
          {placements.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucune plante posée</p>
          ) : (() => {
            // Compte le nombre d'occurrences de chaque plante
            const counts = {};
            placements.forEach((p) => {
              const key = p.plante_id;
              if (!counts[key]) {
                counts[key] = {
                  name: p.plante_name,
                  emoji: p.plante_emoji,
                  variete: p.plante_variete,
                  count: 0,
                };
              }
              counts[key].count++;
            });
            const sorted = Object.values(counts).sort((a, b) =>
              a.name.localeCompare(b.name)
            );

            return (
              <div className="space-y-2">
                {sorted.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded px-3 py-2 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.emoji && <span className="text-lg shrink-0">{item.emoji}</span>}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-green-800 truncate">
                          {item.name}
                        </p>
                        {item.variete && (
                          <p className="text-xs text-gray-400 italic truncate">
                            {item.variete}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                      ×{item.count}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-2 mt-2 text-sm text-gray-500">
                  {placements.length} plante{placements.length > 1 ? "s" : ""} au total
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </Layout>
  );
}

export default PotagerDetail;
