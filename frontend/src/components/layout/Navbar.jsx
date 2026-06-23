// frontend/src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * Barre de navigation principale.
 * Affiche les liens de connexion/inscription si non connecte,
 * ou le prenom et le bouton de deconnexion si connecte.
 */
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-green-700 text-white shadow-md relative z-50 shrink-0">
      <div className="px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Potager
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-green-200 transition">
                Mes potagers
              </Link>
              <Link to="/plantes" className="hover:text-green-200 transition">
                Plantes
              </Link>
              <span className="text-green-200 text-sm">
                {user.prenom} {user.nom}
              </span>
              <button
                onClick={logout}
                className="bg-green-800 hover:bg-green-900 px-3 py-1 rounded text-sm transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-green-200 transition"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-white text-green-700 hover:bg-green-100 px-3 py-1 rounded text-sm font-medium transition"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
