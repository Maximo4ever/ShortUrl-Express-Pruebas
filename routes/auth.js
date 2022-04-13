const express = require("express");
const {
  registerForm,
  registerUser,
  confirmarCuenta,
  loginForm,
  loginUser,
} = require("../controllers/auhtController");
const router = express.Router();

router.get("/register", registerForm);
router.post("/register", registerUser);
router.get("/confirmar/:token", confirmarCuenta);
router.get("/login", loginForm);
router.post("/login", loginUser);

module.exports = router;
