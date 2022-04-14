const { URL } = require("url");

const urlValidar = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    if (urlFrontend.origin !== "null") {
      console.log("Diferente a null");
      if (
        urlFrontend.protocol === "http:" ||
        urlFrontend.protocol === "https:"
      ) {
        console.log("Protocolo http o https, paso todo alb");
        return next();
      }
    }
    throw new Error("URL no válida");
  } catch (error) {
    // console.log(error);
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

module.exports = urlValidar;
