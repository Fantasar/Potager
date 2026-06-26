// frontend/src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/layout/Navbar";
import WatercolorBackground from "../components/garden/WatercolorBackground";
import Tree from "../components/garden/Tree";
import potagerPng from "../assets/potager.png";
import bancPng from "../assets/banc.png";

/**
 * Page d'accueil avec scene de jardin aquarelle.
 * Affiche un decor illustre : fond de ciel et collines, arbre a gauche,
 * cabane de jardin a droite, et un carre de potager en 3D au centre.
 * Le texte et les boutons d'action sont superposes au-dessus de la scene.
 */
function Home() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />

      {/* Scene complete */}
      <div className="flex-1 relative">
        {/* Fond aquarelle */}
        <WatercolorBackground />

        {/* Contenu superpose */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Texte et CTA -- presque au milieu de l'ecran */}
          <div className="text-center px-4" style={{ paddingTop: "22vh" }}>
            <h1 className="text-5xl font-bold text-green-900 mb-3">
              Gérez vos carrés de potager
            </h1>
            <p className="text-lg text-green-800/70 mb-6 max-w-xl mx-auto">
              Organisez vos plantations, gérez votre grainothèque et planifiez
              vos semis dans une application simple et intuitive.
            </p>

            {user ? (
              <Link
                to="/dashboard"
                className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Accéder à mon jardin
              </Link>
            ) : (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Commencer gratuitement
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-white/80 hover:bg-white border-2 border-green-700 text-green-700 font-semibold px-8 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>

          {/* Scene illustree en bas */}
          <div className="flex-1 flex items-end justify-center pb-0 relative">
            {/* Arbre a gauche -- grand et debordant */}
            <div className="absolute bottom-0" style={{ left: "-1%" }}>
              <Tree className="h-[85vh] w-auto max-h-[650px]" />
            </div>

            {/* Potager au centre -- desature avec voile doux */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[15%]">
              <img
                src={potagerPng}
                alt="Carré de potager"
                className="w-[520px] max-w-[55vw] h-auto drop-shadow-xl"
                draggable="false"
                style={{ filter: "saturate(0.65) brightness(1.08)" }}
              />
            </div>

            {/* Banc a droite -- en miroir */}
            <div className="absolute bottom-0" style={{ right: "8%" }}>
              <img
                src={bancPng}
                alt="Banc de jardin"
                className="h-[40vh] max-h-[320px] w-auto drop-shadow-xl"
                draggable="false"
                style={{ transform: "scaleX(-1)", filter: "saturate(0.65) brightness(1.08)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
