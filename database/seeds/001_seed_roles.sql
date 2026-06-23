INSERT INTO roles (name, description) VALUES
    ('utilisateur', 'Utilisateur standard'),
    ('admin', 'Administrateur')
ON CONFLICT DO NOTHING;
