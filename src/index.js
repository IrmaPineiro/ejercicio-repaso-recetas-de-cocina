const express = require('express');
const cors = require('cors');
const mySql = require('mysql2/promise');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();


const SECRET_KEY_TOKEN = "secretToken";



// función para realizar conexión para conectarte con la base de datos MySQL de recetas:
async function getConnection() {
    const connection = await mySql.createConnection({
        host: 'localhost',
        database: 'recipes_db',
        user: 'root',
        password: 'irmitate',
        port: 3306,
    });
    await connection.connect();
    return connection;
}

// función para realizar conexión para conectarte con la base de datos MySQL de users:
async function getUsersConnection() {
    const connection = await mySql.createConnection({
        host: 'localhost',
        database: 'usuarios_db',
        user: 'root',
        password: 'irmitate',
        port: 3306,
    });
    await connection.connect();
    return connection;
}





//Crear el servidor web:
const server = express();

//Permitir que el servidor acepte peticiones:
server.use(cors());
server.use(express.json());


//Endpoints:
//Acceder a todas las recetas:
server.get("/api/recipes", async (req, res) => {
    const connection = await getConnection();
    const sqlQuery = "SELECT * FROM recipes";
    const [recipeResult] = await connection.query(sqlQuery);
    //console.log(recipeResult);

    connection.end();

    res.status(200).json({
        info: {
            count: recipeResult.length
        },
        results: recipeResult

    });
});
//Acceder a una receta en particular con manejo de errores:
server.get("/api/recipe/:id", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;
        const query = "SELECT * FROM recipes WHERE id = ?";
        const [resultRecipe] = await connection.query(query, [id]);

        if (resultRecipe.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Recipe not found"
            });
        }

        res.status(200).json({
            status: "success",
            result: resultRecipe[0]
        });

    } catch (error) {
        console.error("Error obteniendo receta:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    } finally {
        if (connection) await connection.end();
    }

});

//Crear una nueva receta con manejo de errores:
server.post("/api/recipe", async (req, res) => {
    const connection = await getConnection();
    const { nameRecipe, ingredients, instructions } = req.body;

    if (!nameRecipe || !ingredients || !instructions) {
        res.status(400).json({
            success: false,
            message: "Bad params. Provide 'nameRecipe', 'ingredients', 'instructions'"
        })

    } else {
        const sqlQuery = "INSERT INTO recipes (name, ingredients, instructions) VALUES(?, ?, ?)";
        const [result] = await connection.query(sqlQuery, [nameRecipe, ingredients, instructions]);
        //console.log(result);

        connection.end();

        res.status(201).json({
            success: true,
            id: result.insertId,
        });

    }
});

//Editar una receta existente con manejo de errores:
server.put("/api/recipe/:id", async (req, res) => {
    try {
        const connection = await getConnection();
        const { id } = req.params;
        const { nameRecipe, ingredients, instructions } = req.body;
        const sqlQuery = "UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id = ?";
        const [result] = await connection.query(sqlQuery, [nameRecipe, ingredients, instructions, id]);
        //console.log(result);
        connection.end();

        res.status(200).json({
            success: true,
            id: result.insertId
        })
    } catch (error) {
        console.error("Error actualizando receta", error);
        res.status(500).json({
            success: false,
            message: "Error actualizando receta"
        });
    }

});

//Borrar una receta existente con con manejo de errores:
server.delete("/api/recipe/:id", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const { id } = req.params;
        const sqlQuery = "DELETE FROM recipes WHERE id = ?";
        const [result] = await connection.query(sqlQuery, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "Recipe not found"
            });
        }

        res.status(200).json({
            status: "success",
            message: "Removed resource"
        });

    } catch (error) {
        console.error("Error eliminando receta:", error);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    } finally {
        if (connection) connection.end();
    }
});


//Endpoint Registro de usuario:
server.post("/api/register", async (req, res) => {
    const connection = await getUsersConnection();
    const { email, name, password } = req.body;
    console.log(email, name, password);

    const passwordHashed = await bcrypt.hash(password, 10);
    console.log(passwordHashed);

    const sqlQuery = "INSERT INTO users (email, name, hashed_password) VALUES(?, ?, ?)";
    const [result] = await connection.query(sqlQuery, [email, name, passwordHashed]);
    //console.log(result);
    connection.end();

    res.status(201).json({
        success: true,
        message: `Register completed. Id user: ${result.insertId}`,
    });
});


//Endpoint login usuario:
server.post("/api/login", async (req, res) => {
    const connection = await getUsersConnection();
    const { email, password } = req.body;
    const emailQuery = "SELECT * FROM users WHERE email = ?";
    const [resultUser] = await connection.query(emailQuery, [email]);
    console.log(resultUser);

    if (resultUser.length > 0) {

        //comprobar la contraseña:
        const isSamePassword = await bcrypt.compare(password, resultUser[0].hashed_password);
        //console.log(isSamePassword);

        if (isSamePassword) {
            const infoToken = {
                id: resultUser[0].id,
                email: resultUser[0].email,
            }
            const token = jwt.sign(infoToken, SECRET_KEY_TOKEN, { expiresIn: "1h" });
            console.log(token);
            res.status(200).json({
                success: true,
                token: token
            });

        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }


    } else {
        res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    connection.end();
});





const port = process.env.PORT || 3001;
//Establecer el puerto de conexión:
server.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});



