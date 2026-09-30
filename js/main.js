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
function icone(nom) {
  return `<span class="icone" aria-hidden="true">${ICONES[nom] || ""}</span>`;
}
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

/* 5. Trois pages : Accueil (fixe), Contenu (défilement), Contact (fixe)
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

/* 6. Horloge de la barre d'état (jj/mm hh:mm) */
function majHorloge() {
  const d = new Date();
  const deux = (n) => String(n).padStart(2, "0");
  document.getElementById("horloge").textContent =
    `${deux(d.getDate())}/${deux(d.getMonth() + 1)} ${deux(d.getHours())}:${deux(d.getMinutes())}`;
}
majHorloge();
setInterval(majHorloge, 15000);
