const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
const csrf = require("csurf");

const User = require("./models/User");
require("dotenv").config();
require("./database/db");

const app = express();

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    name: "secret-name-bluuweb",
  })
);
// Mensajes flash
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// Agrega la propiedad req.user
passport.serializeUser((user, done) =>
  done(null, { id: user._id, userName: user.userName })
);
passport.deserializeUser(async (user, done) => {
  const userDB = await User.findById(user.id);
  return done(null, { id: userDB._id, userName: userDB.userName });
});

// Render hbs
const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

// Permite usar params
app.use(express.urlencoded({ extended: true }));

// Seguridad
app.use(csrf());

app.use((req, res, next) => {
  // Acceso global a los hbs
  res.locals.csrfToken = req.csrfToken();
  res.locals.mensajes = req.flash("mensajes");
  next();
});

// Rutas
app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));
app.use(express.static(__dirname + "/public"));

// Puesto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor andando!!!");
});
