// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

/**
 * Middleware d'authentification et d'autorisation.
 * authenticate verifie le token JWT et attache les infos utilisateur a req.user.
 * authorize restreint l'acces selon le role de l'utilisateur.
 */

/**
 * Verifie la validite du token JWT present dans le header Authorization.
 * Doit etre place en premier sur toutes les routes protegees.
 * @param {Object} req  - Requete Express
 * @param {Object} res  - Reponse Express
 * @param {Function} next - Fonction next du middleware
 */
function authenticate(req, res, next) {
  // Format attendu : "Bearer TOKEN"
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }
  try {
    // Decode et verifie la signature du token
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalide" });
  }
}

/**
 * Restreint l'acces aux roles specifies.
 * Doit obligatoirement etre utilise APRES authenticate dans la chaine de middlewares.
 * @param {...string} roles - Liste des roles autorises (ex: "admin", "utilisateur")
 * @returns {Function} - Middleware Express
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Accès refusé" });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
