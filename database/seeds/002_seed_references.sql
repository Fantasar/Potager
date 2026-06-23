INSERT INTO type_de_sol (name, description) VALUES
    ('Argileux', 'Sol lourd et compact, retient bien l''eau'),
    ('Sableux', 'Sol léger et drainant'),
    ('Limoneux', 'Sol fertile et équilibré'),
    ('Calcaire', 'Sol alcalin, souvent sec'),
    ('Humifère', 'Sol riche en matière organique')
ON CONFLICT DO NOTHING;

INSERT INTO exposition (name, description) VALUES
    ('Plein soleil', '6h+ de soleil direct par jour'),
    ('Mi-ombre', '3 à 6h de soleil par jour'),
    ('Ombre', 'Moins de 3h de soleil par jour')
ON CONFLICT DO NOTHING;

INSERT INTO besoin_en_eau (name, description) VALUES
    ('Faible', 'Arrosage occasionnel'),
    ('Modéré', 'Arrosage régulier'),
    ('Élevé', 'Arrosage fréquent et abondant')
ON CONFLICT DO NOTHING;

INSERT INTO seeds (name, description) VALUES
    ('Semis intérieur', 'Semis en godet à l''intérieur'),
    ('Semis extérieur', 'Semis direct en pleine terre'),
    ('Plants', 'Plantation de plants déjà développés')
ON CONFLICT DO NOTHING;
