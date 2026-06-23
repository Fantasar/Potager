// frontend/src/config/api.js
import axios from "axios";

/**
 * Instance Axios centralisee pour toutes les requetes vers l'API backend.
 * Ajoute automatiquement le token JWT dans le header Authorization si present.
 */
const api = axios.create({
  baseURL: "/api",
});

// Intercepteur de requetes -- injecte le token JWT avant chaque appel
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
