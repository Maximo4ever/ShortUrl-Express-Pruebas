console.log("Hola desde el Frontend");
document.addEventListener("click", (e) => {
  if (e.target.dataset.short) {
    const url = `${window.location.origin}/redireccionar/${e.target.dataset.short}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log("Text copied to clipboard...");
      })
      .catch((err) => {
        console.log("Something went wrong", err);
      });
  }
});
