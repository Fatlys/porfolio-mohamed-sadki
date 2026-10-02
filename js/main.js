/* =========================================================
   main.js — assemble la page
   ========================================================= */

/* 1. Icônes : remplit chaque <span data-icone="..."> */
document.querySelectorAll("[data-icone]").forEach((el) => {
  el.classList.add("icone");
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = ICONES[el.dataset.icone] || "";
});

/* 2. Vagues animées du fond */
const vagues = creerVagues(document.getElementById("vagues-canvas"));

/* 3. Accueil : carte profil et personnage */
const photo = document.getElementById("hero-photo");
photo.src = PROFIL.photo;
photo.alt = `${PROFIL.nom} en version low poly`;
document.getElementById("profil-avatar").src = PROFIL.avatar;
document.getElementById("profil-nom").textContent = PROFIL.nom;
document.getElementById("profil-tags").textContent = PROFIL.tags;

/* 4. Contact : liste des réseaux ; Discord copie le pseudo */
document.getElementById("liste-contact").innerHTML = CONTACTS.map((c) => {
  const contenu = `${icone(c.icone)}<span>${c.reseau}</span><span class="valeur">${c.valeur}</span>${icone("chevron")}`;
  if (c.copier) {
    return `<li><button class="lien-contact" type="button" data-copier="${c.valeur}" aria-label="Copier le pseudo ${c.reseau} ${c.valeur}">${contenu}</button></li>`;
  }
  const externe = c.url.startsWith("http") ? 'target="_blank" rel="noopener"' : "";
  return `<li><a class="lien-contact" href="${c.url}" ${externe}>${contenu}</a></li>`;
}).join("");

document.querySelectorAll("[data-copier]").forEach((bouton) => {
  bouton.addEventListener("click", async () => {
    const valeur = bouton.querySelector(".valeur");
    try {
      await navigator.clipboard.writeText(bouton.dataset.copier);
      valeur.textContent = "Pseudo copié !";
    } catch (e) {
      valeur.textContent = bouton.dataset.copier;
    }
    setTimeout(() => (valeur.textContent = bouton.dataset.copier), 1800);
  });
});

/* 5. Projets : chargés depuis data/projects.json
   (fetch a besoin de Live Server : il ne marche pas en double-cliquant sur index.html) */
async function chargerProjets() {
  try {
    const reponse = await fetch("data/projects.json");
    if (!reponse.ok) throw new Error(`Erreur ${reponse.status}`);
    return await reponse.json();
  } catch (erreur) {
    console.error("Impossible de charger les projets :", erreur);
    return [];
  }
}

/* Une rangée par catégorie, avec un panneau d'aperçu à droite */
function afficherProjets(projets) {
  const conteneurRangees = document.getElementById("rangees-projets");

  CATEGORIES.forEach((categorie) => {
    const projetsCategorie = projets.filter((p) => p.categorie === categorie.cle);

    const rangee = document.createElement("section");
    rangee.className = "rangee";
    rangee.id = categorie.id;
    rangee.setAttribute("aria-labelledby", `titre-${categorie.id}`);
    rangee.innerHTML = `
      <h3 class="rangee-titre" id="titre-${categorie.id}">${icone(categorie.icone)} ${categorie.titre}</h3>
      <div class="rangee-cartes"></div>
      <div class="rangee-details" aria-live="polite"></div>`;

    const cartes = rangee.querySelector(".rangee-cartes");
    const details = rangee.querySelector(".rangee-details");

    function afficherDetails(projet, carte) {
      cartes.querySelectorAll(".carte-projet").forEach((c) => c.classList.remove("active"));
      carte.classList.add("active");
      const meta = [projet.mention, projet.cours ? `Cours ${projet.cours}` : null].filter(Boolean).join(", ");
      details.innerHTML = `<h3>${projet.titre}</h3><p class="meta">${meta}</p><p>${projet.resume}</p>`;
    }

    if (projetsCategorie.length === 0) {
      cartes.innerHTML = `<p class="rangee-vide">${categorie.vide || "Aucun projet pour l'instant."}</p>`;
    } else {
      projetsCategorie.forEach((projet) => cartes.appendChild(creerCarteProjet(projet, afficherDetails)));
      afficherDetails(projetsCategorie[0], cartes.firstElementChild);
    }

    conteneurRangees.appendChild(rangee);
  });
}

chargerProjets().then((projets) => {
  afficherProjets(projets);
  // les projets arrivent après le chargement : on se replace sur la bonne section
  if (location.hash && location.hash !== "#projets") document.getElementById(location.hash.slice(1))?.scrollIntoView();
});

/* 6. Demo reel : PSP 3D fixe, écran éteint */
if (window.creerPSP3D) creerPSP3D(document.getElementById("psp-scene"));

/* 7. Compétences : une barre par logiciel */
document.getElementById("liste-competences").innerHTML = COMPETENCES.map(
  (c) => `
  <li class="competence">
    <div class="competence-texte">
      <span class="competence-nom">${c.logiciel}</span>
      <span class="competence-domaine">${c.domaine}</span>
    </div>
    <span class="competence-pourcent">${c.niveau} %</span>
    <div class="competence-barre" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${c.niveau}" aria-label="${c.logiciel}">
      <span style="--niveau: ${c.niveau}%"></span>
    </div>
  </li>`
).join("");

/* 8. Trois pages : Accueil (fixe), Contenu (défilement), Contact (fixe)
   Le menu garde les 5 onglets ; Projets, Demo reel et Compétences
   ouvrent la page Contenu et descendent jusqu'à la bonne section. */
const liensNav = document.querySelectorAll(".nav-lien");
const pages = document.querySelectorAll(".page");
let pageActive = null;

function surligner(id) {
  liensNav.forEach((lien) => lien.setAttribute("aria-current", lien.dataset.section === id ? "true" : "false"));
}

function afficher(hash) {
  const id = (hash || "#accueil").slice(1) || "accueil";
  const cible = id === "accueil" ? "page-accueil" : id === "contact" ? "page-contact" : "page-contenu";
  const changement = cible !== pageActive;
  if (changement && pageActive !== null) vagues.changerScene(); // nouveau mouvement de fond à chaque page
  pages.forEach((p) => p.classList.toggle("active", p.id === cible));
  document.documentElement.classList.toggle("sans-defilement", cible !== "page-contenu");
  pageActive = cible;

  if (cible === "page-contenu") {
    const comportement = changement ? "auto" : "smooth";
    const el = document.getElementById(id);
    // Projets = tout en haut de la page ; les autres sections : jusqu'à leur début
    requestAnimationFrame(() => {
      if (id === "projets" || !el) window.scrollTo({ top: 0, behavior: comportement });
      else el.scrollIntoView({ behavior: comportement });
    });
  } else {
    window.scrollTo(0, 0);
  }
  surligner(id);
}

// liens internes (#...) : on change de page sans recharger
let clicRecent = 0;
document.addEventListener("click", (e) => {
  const lien = e.target.closest('a[href^="#"]');
  if (!lien) return;
  e.preventDefault();
  clicRecent = Date.now();
  const hash = lien.getAttribute("href");
  if (location.hash !== hash) history.pushState(null, "", hash);
  afficher(hash);
});
window.addEventListener("popstate", () => afficher(location.hash));
afficher(location.hash);

// dans la page Contenu : l'onglet suit la section dont le haut
// a dépassé le premier tiers de l'écran
const sectionsSuivies = ["projets", "demo-reel", "competences"].map((id) => document.getElementById(id));
function suivreSection() {
  if (pageActive !== "page-contenu" || Date.now() - clicRecent < 1000) return;
  let actuelle = "projets";
  sectionsSuivies.forEach((s) => {
    if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) actuelle = s.id;
  });
  surligner(actuelle);
}
window.addEventListener("scroll", suivreSection, { passive: true });

/* 9. Horloge de la barre d'état (jj/mm hh:mm) */
function majHorloge() {
  const d = new Date();
  const deux = (n) => String(n).padStart(2, "0");
  document.getElementById("horloge").textContent =
    `${deux(d.getDate())}/${deux(d.getMonth() + 1)} ${deux(d.getHours())}:${deux(d.getMinutes())}`;
}
majHorloge();
setInterval(majHorloge, 15000);
