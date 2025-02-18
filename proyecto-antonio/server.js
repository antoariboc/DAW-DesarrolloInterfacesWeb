const express = require('express');
const app = express();
const port = 3000;

app.set("view engine", "ejs")

// Servir archivos estáticos
//app.use(express.static('public'));
// Ruta principal
app.get('/', (req, res) => {
    res.render("index");
});

app.get('/users/register', (req, res) => {
    res.render("register");
});

app.get('/users/login', (req, res) => {
    res.render("login");
});

app.get('/users/dashboard', (req, res) => {
    res.render("dashboard");
});


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});