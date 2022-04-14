const express = require("express");
const { body } = require("express-validator");
const {
  registerForm,
  registerUser,
  confirmarCuenta,
  loginForm,
  loginUser,
  cerrarSesion,
} = require("../controllers/auhtController");
const router = express.Router();
const validaciones = [
  body("userName", "Ingrese una nombre valido").trim().notEmpty().escape(),
  body("email", "Ingrese un email valido").trim().isEmail().normalizeEmail(),
  body("password", "Constraseña de minimo 6 caracteres")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.repassword)
        throw new Error("Las contraseñas no coinciden");
      else return value;
    }),
];

router.get("/register", registerForm);
router.post("/register", validaciones, registerUser);
router.get("/confirmar/:token", confirmarCuenta);
router.get("/login", loginForm);
router.post(
  "/login",
  validaciones[1],
  body("password", "Constraseña de minimo 6 caracteres")
    .trim()
    .isLength({ min: 6 })
    .escape(),
  loginUser
);
router.get("/logout", cerrarSesion);

module.exports = router;
