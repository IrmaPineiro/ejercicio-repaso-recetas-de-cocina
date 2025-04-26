const express = require('express');
const cors = require('cors');
const mySql = require('mysql2/promise');

// función para realizar conexión para conectarte con la base de datos MySQL:
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


//Crear el servidor web:
const server = express();

//Permitir que el servidor acepte peticiones:
server.use(cors());
server.use(express.json());


//Endpoints:

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

server.get("/api/recipe/:id", async (req, res) => {
    const connection = await getConnection();
    const { id } = req.params;
    //console.log(id);
    const query = "SELECT * FROM recipes WHERE id = ?";
    const [resultRecipe] = await connection.query(query, [id]);
    connection.end();
    console.log(resultRecipe);


    res.status(200).json({
        status: "success",
        result: resultRecipe[0]

    });
});

server.post("/api/recipe", async (req, res) => {
    const connection = await getConnection();
    const { nameRecipe, ingredients, instructions } = req.body;
    const sqlQuery = "INSERT INTO recipes (name, ingredients, instructions) VALUES(?, ?, ?)";
    const [result] = await connection.query(sqlQuery, [nameRecipe, ingredients, instructions]);
    //console.log(result);

    connection.end();

    res.status(201).json({
        success: true,
        id: result.insertId,
    });

})


//Establecer el puerto de conexión:
const port = 5000;
server.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
});

