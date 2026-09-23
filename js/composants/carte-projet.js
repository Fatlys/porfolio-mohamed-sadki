function renderCarteProjet(projet) {
  return `
    <article class="carte-projet">
      <h3 class="carte-projet__titre">${projet.titre}</h3>
      <p class="carte-projet__description">${projet.description}</p>
    </article>
  `;
}

window.renderCarteProjet = renderCarteProjet;
