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

  const processus = projet.processus
    ? `<h3>Processus de création</h3><ol>${projet.processus.map((e) => `<li>${e}</li>`).join("")}</ol>`
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
