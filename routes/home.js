const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const urls = [
    { origin: "www.google.com/bluuweb1", shortUrl: "urlCorta1" },
    { origin: "www.google.com/bluuweb2", shortUrl: "urlCorta2" },
    { origin: "www.google.com/bluuweb3", shortUrl: "urlCorta3" },
  ];
  res.render("home", { urls: urls });
});

module.exports = router;
