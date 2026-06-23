CREATE TABLE grainotheque_fiche (
    id SERIAL PRIMARY KEY,
    grainotheque_id INTEGER NOT NULL REFERENCES grainotheque(id) ON DELETE CASCADE,
    numero_uniqid INTEGER,
    variete VARCHAR(100),
    hauteur DECIMAL,
    floraison VARCHAR(100),
    besoin_occupation_sol INTEGER,
    besoin_en_eau_id INTEGER REFERENCES besoin_en_eau(id),
    type_de_sol_id INTEGER REFERENCES type_de_sol(id),
    semis_id INTEGER REFERENCES seeds(id),
    exposition_id INTEGER REFERENCES exposition(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
