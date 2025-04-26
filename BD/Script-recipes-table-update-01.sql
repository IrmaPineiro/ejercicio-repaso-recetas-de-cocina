CREATE DATABASE recipes_db;

USE recipes_db;

CREATE TABLE recipes (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(50),
ingredients VARCHAR(500),
instructinos LONGTEXT
);

ALTER TABLE recipes 
CHANGE instructinos instructions LONGTEXT;

INSERT INTO recipes (name, ingredients, instructions)
VALUES ('Tarta de Manzana', '3 manzanas, 200g harina, 150g azúcar, 100g mantequilla, 2 huevos', '1. Precalienta el horno a 180°C. 2. Mezcla harina, azúcar y mantequilla para formar la masa. 3. Cubre un molde con la masa y añade las manzanas cortadas. ');

INSERT INTO recipes (name, ingredients, instructions)
VALUES (
'Spaghetti Carbonara', '200g spaghetti, 100g panceta, 2 huevos, 50g queso parmesano, pimienta negra', '1. Cocina spaghetti en agua hirviendo con sal según instrucciones. 2. En sartén, saltea panceta hasta dorarla. 3. En bol, bate huevos con queso parmesano y pimienta. 4. Escurre spaghetti y mézclalos con panceta. 5. Agrega mezcla de huevo y queso, revolviendo rápidamente.'
);

SELECT * FROM recipes;

SELECT * FROM recipes WHERE id = 2;

INSERT INTO recipes (name, ingredients, instructions)
VALUES("tortilla de patatas", "huevo, cebolla", "lorem ipsum");





