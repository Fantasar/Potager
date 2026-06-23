// frontend/src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/layout/Layout";

/**
 * Page d'accueil.
 * Affiche un message de bienvenue et un appel a l'action.
 * Redirige vers le dashboard si l'utilisateur est connecte.
 */
function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="text-center mt-20">
        <h1 className="text-5xl font-bold text-green-800 mb-4">
          Gérez vos carrés de potager
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Organisez vos plantations, gérez votre grainothèque et planifiez
          vos semis dans une application simple et intuitive.
        </p>

        {user ? (
          <Link
            to="/dashboard"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg text-lg transition"
          >
            Accéder à mes potagers
          </Link>
        ) : (
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg text-lg transition"
            >
              Commencer gratuitement
            </Link>
            <Link
              to="/login"
              className="inline-block border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium px-8 py-3 rounded-lg text-lg transition"
            >
              Se connecter
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
