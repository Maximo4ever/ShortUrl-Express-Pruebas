const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const { create } = require("express-handlebars");
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

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Preguntas
passport.serializeUser((user, done) =>
  done(null, { id: user._id, userName: user.userName })
); // req.user
passport.deserializeUser(async (user, done) => {
  const userDB = await User.findById(user.id);
  return done(null, { id: userDB._id, userName: userDB.userName });
});

app.get("/mensaje-flash", (req, res) => {
  res.json(req.flash("mensaje" || "Sin mensaje flash"));
});
app.get("/crear-mensaje", (req, res) => {
  req.flash("mensaje", "Este es un mensaje de error unu");
  res.redirect("/mensaje-flash");
});

const hbs = create({
  extname: ".hbs",
  partialsDir: ["views/components"],
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));
app.use(express.static(__dirname + "/public"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Servidor andando!!!");
});
