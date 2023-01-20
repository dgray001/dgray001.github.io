function onload() {
  document.body.classList.add("loaded");
  let urlHash = window.location.hash;
  if (urlHash) {
    window.location.hash = '';
    setTimeout(() => window.location.hash = urlHash, 350);
  }
};