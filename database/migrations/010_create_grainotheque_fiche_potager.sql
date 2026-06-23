CREATE TABLE grainotheque_fiche_potager (
    id SERIAL PRIMARY KEY,
    grainotheque_fiche_id INTEGER NOT NULL REFERENCES grainotheque_fiche(id) ON DELETE CASCADE,
    potager_id INTEGER NOT NULL REFERENCES potager(id) ON DELETE CASCADE,
    position_x DECIMAL,
    position_y DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);
