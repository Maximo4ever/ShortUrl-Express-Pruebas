const User = require("../models/User");
const { nanoid } = require("nanoid");

const registerForm = (req, res) => {
  res.render("register");
};

const registerUser = async (req, res) => {
  console.log(req.body);
  const { userName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) throw new Error("Ya existe el usuario");

    const user = new User({
      userName,
      email,
      password,
      tokenConfirm: nanoid(),
    });
    await user.save();
    res.redirect("/auth/login");
  } catch (error) {
    res.json({ error: error.message });
  }
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) throw new Error("No existe este usuario");

    user.cuentaConfirmada = true;
    user.tokenConfirm = null;
    await user.save();

    // Enviar correo electronico con la confirmacion de la cuenta
    res.redirect("/auth/login");
  } catch (error) {
    res.json({ error: error.message });
  }
};

const loginForm = (req, res) => {
  res.render("login");
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("El Email no existe");
    if (!user.cuentaConfirmada)
      throw new Error("Confirme la cuenta antes de entrar");
    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña invalida");

    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
};

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser,
};
