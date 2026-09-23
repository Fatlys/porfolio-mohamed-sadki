function ouvrirModale(modaleId) {
  const modal = document.getElementById(modaleId);
  if (modal) {
    modal.classList.add('modale--active');
  }
}

function fermerModale(modaleId) {
  const modal = document.getElementById(modaleId);
  if (modal) {
    modal.classList.remove('modale--active');
  }
}

window.ouvrirModale = ouvrirModale;
window.fermerModale = fermerModale;
