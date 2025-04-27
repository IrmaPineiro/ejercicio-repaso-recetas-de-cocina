CREATE DATABASE usuarios_db;

USE usuarios_db;

CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(250) UNIQUE NOT NULL,
nombre VARCHAR(100) NOT NULL,
hashed_password VARCHAR(250) NOT NULL
);

ALTER TABLE usuarios  
CHANGE COLUMN nombre name VARCHAR(100) NOT NULL;

ALTER TABLE usuarios RENAME TO users;

INSERT INTO users (email, name, hashed_password)
VALUES ("pedro", "pedro@gmail.com", "123456");

SELECT * FROM users WHERE email = "daniela@gmail.com";




