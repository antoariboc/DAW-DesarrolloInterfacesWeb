const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");

const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false}));

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


app.post('/users/register', async (req, res)=>{
    let { name, email, password, password2 } = req.body;

    console.log({name,email,password,password2});

    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ message: "Fill all fields" });
    }

    if (password.length < 6){
        errors.push({ message: "Password should be at least 6 characters" });
    }

    if (password != password2) {
        errors.push({ message: "Passwords don't match" });
    }

    if(errors.length > 0){
        res.render("register", { errors });
    } else  {
        //el form se ha validado
        console.log(`aaaaaaaaaaa`)
        let hashedPassword = await bcrypt.hash(password, 10);
    }
});


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});