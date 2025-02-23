const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const session = require("express-session");
//Flash es una extensión de connect-flash con la capacidad de definir un mensaje flash y representarlo sin redirigir la solicitud.
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require("./passportConfig");

initializePassport(passport);

const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false}));

// Servir archivos estáticos
app.use(express.static('public'));


app.use(
    session({
        secret: 'secret',

        resave: false,

        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Ruta principal
app.get('/', (req, res) => {
    //res.render("index");
    res.redirect("/users/login");
});

app.get('/users/register', checkAuthenticated, (req, res) => {
    res.render("register");
});

app.get('/users/login', checkAuthenticated, (req, res) => {
    res.render("login");
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

        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], (err, results)=>{
                if (err) {
                    throw err;
                }

                console.log(results.rows);

                if(results.rows.length > 0){
                    errors.push({message: "Email already registered"});
                    res.render("register", { errors });
                }else{
                    pool.query(
                        `SELECT * FROM users WHERE name = $1`, [name], (err, results)=>{
                            if (err) {
                                throw err;
                            }
            
                            console.log(results.rows);
            
                            if(results.rows.length > 0){
                                errors.push({message: "Username already registered"});
                                res.render("register", { errors });
                            }else{
                                pool.query(
                                    `INSERT INTO users (name, email, password)
                                     VALUES ($1, $2, $3)
                                     RETURNING id, password`,
                                     [name, email, hashedPassword],
                                     (err, results) => {
                                        if (err) {
                                            throw err;
                                        }
                                        console.log(results.rows);
                                        req.flash("success_msg", "You are now registered. Please log in.");
                                        res.redirect("/users/login");
                                     }
                                )
                            }
                        }
                    )

                }
            }
        )

        
    }
});

app.post("/users/login",  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
    })
);

app.get("/users/logout", (req, res) => {
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/users/login");
    });
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
    console.log(req.isAuthenticated());
    res.render("dashboard", { user: req.user.name });
  });


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect("/users/dashboard");
    }
    next();
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/users/login");
  }




// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});