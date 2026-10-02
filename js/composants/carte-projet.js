/* =========================================================
   Carte projet : crée la vignette d'un projet
   ========================================================= */

/* Icône SVG prête à insérer dans le HTML */
function icone(nom) {
  return `<span class="icone" aria-hidden="true">${ICONES[nom] || ""}</span>`;
}

/* Visuel : l'image du projet, ou un fond avec icône si pas d'image */
function creerVisuelProjet(projet) {
  if (projet.image) {
    return `<div class="carte-visuel"><img src="${projet.image}" alt="" loading="lazy"></div>`;
  }
  const categorie = CATEGORIES.find((c) => c.cle === projet.categorie);
  return `
    <div class="carte-visuel carte-visuel--vide">
      ${icone(categorie ? categorie.icone : "dossier")}
      <span>${projet.titre}</span>
    </div>`;
}

/* Carte : au survol (ou au clavier), on affiche l'aperçu du projet */
function creerCarteProjet(projet, surSelection) {
  const carte = document.createElement("article");
  carte.className = "carte-projet";
  carte.tabIndex = 0;
  carte.dataset.id = projet.id;
  carte.innerHTML = `
    ${creerVisuelProjet(projet)}
    <h4 class="carte-titre">${projet.titre}</h4>`;

  carte.addEventListener("mouseenter", () => surSelection(projet, carte));
  carte.addEventListener("focus", () => surSelection(projet, carte));
  return carte;
}
