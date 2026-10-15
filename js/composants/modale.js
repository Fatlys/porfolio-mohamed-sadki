/* =========================================================
   Modale : affiche le détail d'un projet (venant de data/projects.json)
   dans un <dialog>
   (Échap ferme la modale automatiquement)
   ========================================================= */

const modale = document.getElementById("modale");
const modaleCorps = document.getElementById("modale-corps");

function ouvrirModale(projet) {
  const etiquettes = [
    projet.mention,
    projet.cours ? `Cours ${projet.cours}` : null,
    projet.equipe,
    ...projet.logiciels,
  ].filter(Boolean);

  const coequipiers = projet.coequipiers.length
    ? `<h3>Coéquipiers</h3><p>${projet.coequipiers.join(", ")}</p>`
    : "";

  /* Processus : chaque étape a un texte et, si elle en a une, une petite image
     (clic sur l'image = affichage en grand au milieu de l'écran) */
  const processus = projet.processus
    ? `<h3>Processus de création</h3><ol class="processus">${projet.processus
        .map((etape) => {
          const image = etape.image
            ? `<button class="processus-image" type="button" aria-label="Agrandir l'image : ${etape.texte}">
                 <img src="${etape.image}" alt="Étape : ${etape.texte}" loading="lazy">
               </button>`
            : "";
          return `<li><p>${etape.texte}</p>${image}</li>`;
        })
        .join("")}</ol>`
    : "";

  const lien = projet.lien
    ? `<a class="bouton" href="${projet.lien.url}" target="_blank" rel="noopener">${icone("confirmer")} ${projet.lien.texte}</a>`
    : "";

  modaleCorps.innerHTML = `
    <div class="modale-visuel">${creerVisuelProjet(projet)}</div>
    <div class="modale-contenu">
      <h2 id="modale-titre">${projet.titre}</h2>
      <ul class="modale-etiquettes">${etiquettes.map((e) => `<li>${e}</li>`).join("")}</ul>
      <p>${projet.resume}</p>
      <h3>Mon rôle</h3><p>${projet.role}</p>
      ${coequipiers}
      <h3>Ce qui était demandé</h3><p>${projet.demande}</p>
      <h3>Ce que j'ai fait</h3><p>${projet.realisation}</p>
      ${processus}
      ${lien}
    </div>`;

  modale.showModal();
}

/* Fermer : bouton X ou clic sur le fond */
document.getElementById("modale-fermer").addEventListener("click", () => modale.close());
modale.addEventListener("click", (e) => {
  if (e.target === modale) modale.close();
});

/* Visionneuse : clic sur une image du processus = elle s'affiche en grand
   au-dessus de la modale, le reste devient flou.
   Clic n'importe où, bouton X ou Échap pour revenir à la modale. */
const visionneuse = document.getElementById("visionneuse");
const visionneuseImage = document.getElementById("visionneuse-image");

/* L'image prend le plus de place possible à l'écran, sans être déformée */
function ajusterVisionneuse() {
  const l = visionneuseImage.naturalWidth, h = visionneuseImage.naturalHeight;
  if (!l || !h) return;
  const echelle = Math.min((window.innerWidth * 0.9) / l, (window.innerHeight * 0.85) / h);
  visionneuseImage.style.width = `${Math.round(l * echelle)}px`;
  visionneuseImage.style.height = `${Math.round(h * echelle)}px`;
}
visionneuseImage.addEventListener("load", ajusterVisionneuse);
window.addEventListener("resize", () => { if (visionneuse.open) ajusterVisionneuse(); });

modaleCorps.addEventListener("click", (e) => {
  const miniature = e.target.closest(".processus-image");
  if (!miniature) return;
  const img = miniature.querySelector("img");
  visionneuseImage.src = img.src;
  visionneuseImage.alt = img.alt;
  visionneuse.showModal();
  ajusterVisionneuse(); // si l'image est déjà chargée
});
visionneuse.addEventListener("click", () => visionneuse.close());
