CREATE TABLE emoji_catalogue (
    id SERIAL PRIMARY KEY,
    emoji VARCHAR(10) NOT NULL,
    name VARCHAR(100) NOT NULL,
    categorie VARCHAR(50) NOT NULL
);

-- ============================================
-- FRUITS
-- ============================================
INSERT INTO emoji_catalogue (emoji, name, categorie) VALUES
    ('🍎', 'Pomme rouge', 'fruit'),
    ('🍏', 'Pomme verte', 'fruit'),
    ('🍐', 'Poire', 'fruit'),
    ('🍊', 'Orange', 'fruit'),
    ('🍋', 'Citron', 'fruit'),
    ('🍋‍🟩', 'Citron vert', 'fruit'),
    ('🍌', 'Banane', 'fruit'),
    ('🍉', 'Pastèque', 'fruit'),
    ('🍇', 'Raisin', 'fruit'),
    ('🍓', 'Fraise', 'fruit'),
    ('🫐', 'Myrtille', 'fruit'),
    ('🍈', 'Melon', 'fruit'),
    ('🍒', 'Cerise', 'fruit'),
    ('🍑', 'Pêche', 'fruit'),
    ('🥭', 'Mangue', 'fruit'),
    ('🍍', 'Ananas', 'fruit'),
    ('🥥', 'Noix de coco', 'fruit'),
    ('🥝', 'Kiwi', 'fruit'),
    ('🫒', 'Olive', 'fruit');

-- ============================================
-- LEGUMES
-- ============================================
INSERT INTO emoji_catalogue (emoji, name, categorie) VALUES
    ('🍅', 'Tomate', 'legume'),
    ('🥕', 'Carotte', 'legume'),
    ('🌽', 'Maïs', 'legume'),
    ('🌶️', 'Piment', 'legume'),
    ('🫑', 'Poivron', 'legume'),
    ('🥒', 'Concombre', 'legume'),
    ('🥬', 'Laitue', 'legume'),
    ('🥦', 'Brocoli', 'legume'),
    ('🧄', 'Ail', 'legume'),
    ('🧅', 'Oignon', 'legume'),
    ('🥔', 'Pomme de terre', 'legume'),
    ('🍆', 'Aubergine', 'legume'),
    ('🫘', 'Haricot', 'legume'),
    ('🥜', 'Cacahuète', 'legume'),
    ('🫛', 'Petit pois', 'legume'),
    ('🥑', 'Avocat', 'legume'),
    ('🫚', 'Gingembre', 'legume');

-- ============================================
-- PLANTES AROMATIQUES & FLEURS
-- ============================================
INSERT INTO emoji_catalogue (emoji, name, categorie) VALUES
    ('🌿', 'Herbe / Basilic', 'aromatique'),
    ('☘️', 'Trèfle / Persil', 'aromatique'),
    ('🍃', 'Feuilles / Menthe', 'aromatique'),
    ('🌱', 'Pousse / Semis', 'aromatique'),
    ('🪴', 'Plante en pot', 'aromatique'),
    ('🌾', 'Blé / Céréale', 'aromatique'),
    ('🌻', 'Tournesol', 'fleur'),
    ('🌸', 'Fleur de cerisier', 'fleur'),
    ('🌺', 'Hibiscus', 'fleur'),
    ('🌷', 'Tulipe', 'fleur'),
    ('🌹', 'Rose', 'fleur'),
    ('🪻', 'Lavande', 'fleur'),
    ('💐', 'Bouquet', 'fleur'),
    ('🪷', 'Lotus', 'fleur'),
    ('🍀', 'Trèfle à quatre feuilles', 'fleur'),
    ('🍄', 'Champignon', 'autre'),
    ('🌰', 'Châtaigne', 'autre'),
    ('🥀', 'Rose fanée', 'fleur');
