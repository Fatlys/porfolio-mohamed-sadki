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

/* Carte : au survol (ou au clavier), on affiche l'aperçu du projet ;
   au clic, on ouvre la modale du projet grâce à son id (data-id) */
function creerCarteProjet(projet, surSelection, surOuverture) {
  const carte = document.createElement("button");
  carte.type = "button";
  carte.className = "carte-projet";
  carte.dataset.id = projet.id;
  carte.innerHTML = `
    ${creerVisuelProjet(projet)}
    <span class="carte-titre">${projet.titre}</span>`;

  carte.addEventListener("mouseenter", () => surSelection(projet, carte));
  carte.addEventListener("focus", () => surSelection(projet, carte));
  carte.addEventListener("click", () => surOuverture(carte.dataset.id));
  return carte;
}
