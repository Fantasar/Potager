// frontend/src/components/layout/Layout.jsx
import Navbar from "./Navbar";

/**
 * Layout principal de l'application.
 * Enveloppe toutes les pages avec la barre de navigation.
 */
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-green-50">
      <Navbar />
      <main className="px-6 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
