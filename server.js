const express = require("express");
const cors = require("cors");
const sql = require("mssql");

const app = express();

app.use(cors());
app.use(express.json());

const config = {
    user: "AM_Sardinha_SQLLogin_1",
    password: "mmtf29wtsa",
    server: "OlhoUrbano.mssql.somee.com",
    database: "OlhoUrbano",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// rota teste
app.get("/", (req, res) => {
    res.send("API Olho Urbano funcionando");
});


// BUSCAR OCORRENCIAS
app.get("/ocorrencias", async (req, res) => {

    try {

        let pool = await sql.connect(config);

        let resultado = await pool
        .request()
        .query("SELECT * FROM ocorrencias");

        res.json(resultado.recordset);

    } catch (erro) {

        console.log(erro);
        res.status(500).send("Erro ao buscar ocorrencias");

    }

});


// SALVAR OCORRENCIA
app.post("/ocorrencias", async (req, res) => {

    try {

        let pool = await sql.connect(config);

        await pool.request()
        .input("tipo", sql.VarChar, req.body.tipo)
        .input("endereco", sql.VarChar, req.body.endereco)
        .input("latitude", sql.Float, req.body.lat)
        .input("longitude", sql.Float, req.body.lng)
        .input("foto", sql.NVarChar(sql.MAX), req.body.foto)

        .query(`
        INSERT INTO ocorrencias
        (tipo,endereco,latitude,longitude,foto)
        VALUES
        (@tipo,@endereco,@latitude,@longitude,@foto)
        `);

        res.json({ status: "ok" });

    } catch (erro) {

        console.log(erro);
        res.status(500).send("Erro ao salvar ocorrencia");

    }

});


// PORTA RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor rodando");
});