// frontend/src/components/garden/Tree.jsx
import treePng from "../../assets/tree.png";

/**
 * Arbre aquarelle decoratif.
 * Utilise l'illustration PNG aquarelle importee depuis les assets.
 */
function Tree({ className = "" }) {
  return (
    <img
      src={treePng}
      alt="Arbre aquarelle"
      className={className}
      draggable="false"
    />
  );
}

export default Tree;
