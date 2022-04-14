const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");

const registerForm = (req, res) => {
  res.render("register", { mensajes: req.flash("mensajes") });
};
const registerUser = async (req, res) => {
  // Si existe un error, muestralo
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/register");
  }
  // Registrar usario:
  const { userName, email, password } = req.body;
  try {
    // Si el usuario ya existe, retorna un error
    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new Error("El usuario ya existe");
    // De lo contrario, registra el NUEVO usuario
    const user = new User({
      userName,
      email,
      password,
      tokenConfirm: nanoid(),
    });
    await user.save();
    req.flash("mensajes", [
      { msg: "Confirme su cuenta con el email que le hemos enviado" },
    ]);
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/register");
  }
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("No existe este usuario");
    // Confirma la cuenta relacionada al token dado
    user.cuentaConfirmada = true;
    user.tokenConfirm = null;
    await user.save();
    // **Envia correo electronico con la confirmacion de la cuenta (prox)**
    req.flash("mensajes", [
      { msg: "Confirme su cuenta con el email que le hemos enviado" },
    ]);
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

const loginForm = (req, res) => {
  res.render("login", { mensajes: req.flash("mensajes") });
};
const loginUser = async (req, res) => {
  // Si existe un error, muestralo
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }
  // Loguear usuario:
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("El Email no existe");
    if (!user.cuentaConfirmada)
      throw new Error("Confirme la cuenta antes de loguearse");
    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña invalida");
    // Crea la sesion de usuario con passport
    req.login(user, function (err) {
      if (err) throw new Error("Error al crear la sesion");
      // Redireccionar a las URLS
      return res.redirect("/");
    });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};
const cerrarSesion = (req, res) => {
  req.logout();
  return res.redirect("/");
};

module.exports = {
  registerForm,
  registerUser,
  confirmarCuenta,
  loginForm,
  loginUser,
  cerrarSesion,
};
