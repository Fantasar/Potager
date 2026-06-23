CREATE TABLE plantes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    variete VARCHAR(100),
    exposition_id INTEGER REFERENCES exposition(id),
    besoin_en_eau_id INTEGER REFERENCES besoin_en_eau(id),
    type_de_sol_id INTEGER REFERENCES type_de_sol(id),
    semis_id INTEGER REFERENCES seeds(id),
    hauteur DECIMAL,
    besoin_occupation_sol INTEGER,
    temps_occupation_sol INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
