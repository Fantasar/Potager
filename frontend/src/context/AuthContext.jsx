// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../config/api";

/**
 * Contexte d'authentification global.
 * Fournit l'utilisateur connecte, les fonctions login/logout,
 * et un indicateur de chargement pour eviter les flashs non-authentifie.
 */
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifie au demarrage si un token valide est present dans le localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/users/me")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Connecte un utilisateur et stocke le token JWT
   * @param {string} email    - Email de l'utilisateur
   * @param {string} password - Mot de passe en clair
   */
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  /**
   * Deconnecte l'utilisateur et supprime le token du localStorage
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
