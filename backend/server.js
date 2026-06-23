// backend/server.js

// ============================================
// IMPORTS
// ============================================
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// ============================================
// CONFIGURATION
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors());
app.use(express.json());

// ============================================
// ROUTES
// ============================================
const authRoutes         = require("./routes/auth");
const userRoutes         = require("./routes/users");
const potagerRoutes      = require("./routes/potagers");
const grainothequeRoutes = require("./routes/grainotheques");
const planteRoutes       = require("./routes/plantes");
const referenceRoutes    = require("./routes/references");

app.use("/api/auth",          authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/potagers",      potagerRoutes);
app.use("/api/grainotheques", grainothequeRoutes);
app.use("/api/plantes",       planteRoutes);
app.use("/api/references",    referenceRoutes);

// ============================================
// ROUTES UTILITAIRES
// ============================================

// Health check -- utilise par Render pour verifier que le serveur est actif
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Serveur operationnel",
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// GESTION DES ROUTES NON TROUVEES
// ============================================
app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvee",
    path: req.path,
  });
});

// ============================================
// DEMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log(`Serveur Potager demarre sur le port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
