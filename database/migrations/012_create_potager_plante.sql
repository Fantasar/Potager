CREATE TABLE potager_plante (
    id SERIAL PRIMARY KEY,
    potager_id INTEGER NOT NULL REFERENCES potager(id) ON DELETE CASCADE,
    plante_id INTEGER NOT NULL REFERENCES plantes(id) ON DELETE CASCADE,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (potager_id, position_x, position_y)
);
