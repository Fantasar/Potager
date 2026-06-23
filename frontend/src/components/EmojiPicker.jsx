// frontend/src/components/EmojiPicker.jsx
import { useState, useEffect, useRef } from "react";
import api from "../config/api";

/**
 * Selecteur d'emoji pour les plantes.
 * Charge le catalogue d'emojis depuis l'API et les affiche par categorie.
 * L'utilisateur clique sur un emoji pour le selectionner.
 */

// Labels lisibles pour chaque categorie
const CATEGORIE_LABELS = {
  fruit: "Fruits",
  legume: "Légumes",
  aromatique: "Aromatiques",
  fleur: "Fleurs",
  autre: "Autres",
};

function EmojiPicker({ value, onChange }) {
  const [emojis, setEmojis] = useState([]);
  const [open, setOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const ref = useRef(null);

  // Charge le catalogue d'emojis au premier affichage du picker
  useEffect(() => {
    if (open && emojis.length === 0) {
      api.get("/references/emojis").then((res) => setEmojis(res.data));
    }
  }, [open]);

  // Ferme le picker quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Selectionne un emoji et ferme le picker
   * @param {string} emoji - L'emoji selectionne
   */
  const handleSelect = (emoji) => {
    onChange(emoji);
    setOpen(false);
  };

  // Regroupe les emojis par categorie pour l'affichage
  const grouped = {};
  emojis.forEach((e) => {
    if (!grouped[e.categorie]) grouped[e.categorie] = [];
    grouped[e.categorie].push(e);
  });

  return (
    <div ref={ref} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Icône
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-2xl text-center bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 h-[42px] flex items-center justify-center"
      >
        {value || <span className="text-sm text-gray-400">Choisir</span>}
      </button>

      {/* Bouton pour retirer l'emoji */}
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-7 right-1 text-xs text-gray-400 hover:text-red-500"
        >
          ✕
        </button>
      )}

      {open && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-72 max-h-64 overflow-y-auto">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                {CATEGORIE_LABELS[cat] || cat}
              </p>
              <div className="flex flex-wrap gap-1">
                {items.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => handleSelect(e.emoji)}
                    title={e.name}
                    className={`text-xl w-8 h-8 flex items-center justify-center rounded hover:bg-green-100 transition ${
                      value === e.emoji ? "bg-green-200 ring-2 ring-green-500" : ""
                    }`}
                  >
                    {e.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Saisie manuelle d'un emoji */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
              Saisie libre
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                maxLength={4}
                placeholder="Coller un emoji..."
                className="flex-1 border border-gray-300 rounded px-2 py-1 text-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (customInput.trim()) {
                    handleSelect(customInput.trim());
                    setCustomInput("");
                  }
                }}
                disabled={!customInput.trim()}
                className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition disabled:opacity-40"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
