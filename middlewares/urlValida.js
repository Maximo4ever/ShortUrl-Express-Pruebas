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
        return next();
      }
      throw new Error(
        "URL invalida, Ingrese una URL con el protocolo http o https"
      );
    }
    throw new Error("URL invalida, intente con otra URL");
  } catch (error) {
    if (error.message === "Invalid URL") {
      req.flash("mensajes", [{ msg: "URL invalida, intente con otra URL" }]);
    } else {
      req.flash("mensajes", [{ msg: error.message }]);
    }
    return res.redirect("/");
  }
};

module.exports = urlValidar;
