const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    res.render("home", { urls: urls });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const agregarUrl = async (req, res) => {
  const { origin } = req.body;
  try {
    const url = new Url({
      origin: origin,
      shortURL: nanoid(8),
      user: req.user.id,
    });
    await url.save();
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const eliminarUrl = async (req, res) => {
  const { id } = req.params;
  try {
    // Verifica si la URL a eliminar pertenece al usuario
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("La URL seleccionada no se puede eliminar");
    }
    await url.remove();
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const editarUrlForm = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    if (!url.user.equals(req.user.id)) {
      throw new Error("La URL seleccionada no se puede editar");
    }
    res.render("home", { url });
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    const url = await Url.findById(id);
    if (!url.user.equals(req.user.id)) {
      throw new Error("La URL seleccionada no se puede editar");
    }
    await url.updateOne({ origin });
    res.redirect("/");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redireccionamiento = async (req, res) => {
  const { shortURL } = req.params;
  try {
    const urlDB = await Url.findOne({ shortURL: shortURL });
    console.log(urlDB);

    if (!urlDB?.origin) {
      return res.redirect("/");
    }
    res.redirect(urlDB.origin);
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

module.exports = {
  leerUrls,
  agregarUrl,
  eliminarUrl,
  editarUrlForm,
  editarUrl,
  redireccionamiento,
};
