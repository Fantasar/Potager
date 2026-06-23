// frontend/src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Hook personnalise pour acceder au contexte d'authentification.
 * Simplifie l'import dans les composants -- evite de repeter useContext(AuthContext).
 * @returns {Object} - { user, loading, login, logout }
 */
export function useAuth() {
  return useContext(AuthContext);
}
