// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PotagerDetail from "./pages/PotagerDetail";
import Plantes from "./pages/Plantes";

/**
 * Composant racine de l'application.
 * Configure le contexte d'authentification, le routage des pages
 * et la protection des routes privees via PrivateRoute.
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes privees -- token JWT requis */}
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="/dashboard/:id" element={
            <PrivateRoute><PotagerDetail /></PrivateRoute>
          } />
          <Route path="/plantes" element={
            <PrivateRoute><Plantes /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
