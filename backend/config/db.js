// backend/config/db.js
const { Pool } = require("pg");
require("dotenv").config();

/**
 * Pool de connexions PostgreSQL.
 * En production (Render) : utilise DATABASE_URL avec SSL.
 * En local : utilise les variables separees DB_HOST, DB_PORT, etc.
 */
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "potager",
      }
);

// Verifie la connexion au demarrage et libere immediatement le client
pool.connect((err, client, release) => {
  if (err) {
    console.error("Erreur connexion PostgreSQL:", err.stack);
    return;
  }
  release();
  console.log("Pool PostgreSQL initialise");
});

module.exports = pool;
