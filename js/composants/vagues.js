/* =========================================================
   Fond façon menu PS3 : un large ruban fait de plusieurs nappes
   translucides qui se croisent en traversant tout l'écran,
   et des particules lumineuses qui flottent un peu partout.
   ========================================================= */

function creerVagues(canvas) {
  const ctx = canvas.getContext("2d");
  const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0;

  /* ---------- Nappes du ruban ----------
     chaque nappe a sa propre épaisseur et un léger décalage,
     ce qui les fait se croiser comme un tissu qui ondule */
  const nappes = [
    { decalage: 0.0, epaisseur: 0.09, phase: 0.0, alpha: 0.07 },
    { decalage: 0.02, epaisseur: 0.055, phase: 0.9, alpha: 0.055 },
    { decalage: -0.016, epaisseur: 0.07, phase: 1.8, alpha: 0.045 },
    { decalage: 0.034, epaisseur: 0.04, phase: 2.6, alpha: 0.06 },
    { decalage: -0.03, epaisseur: 0.1, phase: 3.7, alpha: 0.03 },
  ];

  /* ---------- Particules ---------- */
  let particules = [];
  function creerParticules() {
    const nombre = Math.round((w * h) / 16000); // ~ 90 sur un écran d'ordinateur
    particules = Array.from({ length: nombre }, (_, i) => {
      const presDuRuban = i % 2 === 0; // la moitié se regroupe autour du ruban
      return {
        x: Math.random(),
        dy: presDuRuban ? (Math.random() - 0.5) * 0.3 : null,
        y: Math.random(),
        r: Math.random() < 0.08 ? 1.6 + Math.random() * 1.6 : 0.5 + Math.random() * 1.1,
        vitesse: 0.004 + Math.random() * 0.01,
        scintille: Math.random() * Math.PI * 2,
      };
    });
  }

  function redimensionner() {
    const r = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * r); canvas.height = Math.round(h * r);
    ctx.setTransform(r, 0, 0, r, 0, 0);
    creerParticules();
  }
  window.addEventListener("resize", redimensionner);
  redimensionner();

  /* Ligne centrale du ruban : il monte en diagonale (bas gauche → haut droite)
     avec une grande ondulation qui se déplace lentement */
  function centre(x, t) {
    const k = x * Math.PI * 2;
    return (
      0.66 - 0.28 * x +
      0.1 * Math.sin(k * 0.75 + t * 0.09) +
      0.035 * Math.sin(k * 1.6 - t * 0.13)
    );
  }
  // bord haut / bas d'une nappe (en fraction de la hauteur)
  function bord(n, x, t, cote) {
    const k = x * Math.PI * 2;
    const ep = n.epaisseur * (0.55 + 0.45 * Math.sin(k * 0.9 + n.phase + t * 0.07)); // épaisseur variable = torsion
    return centre(x, t) + n.decalage * Math.sin(k * 0.6 + n.phase - t * 0.05) + (cote * ep) / 2;
  }

  // marge : le tracé déborde de l'écran pour que les bouts des traits épais restent invisibles
  function chemin(n, t, cote, marge = 10) {
    const pas = 10;
    for (let px = -marge; px <= w + marge; px += pas) {
      const py = bord(n, px / w, t, cote) * h;
      px === -marge ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
  }

  function dessiner(t) {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";

    // halo général très doux sous le ruban
    ctx.beginPath(); chemin(nappes[0], t, 0, h * 0.4);
    ctx.strokeStyle = "rgba(170, 195, 235, 0.009)";
    [0.3, 0.24, 0.19, 0.15, 0.11, 0.08].forEach((l) => { ctx.lineWidth = h * l; ctx.stroke(); }); // plusieurs couches = bord flou

    nappes.forEach((n) => {
      // surface translucide de la nappe
      ctx.beginPath();
      chemin(n, t, -1);
      const pas = 10;
      for (let px = w + pas; px >= -pas; px -= pas) ctx.lineTo(px, bord(n, px / w, t, 1) * h);
      ctx.closePath();
      ctx.fillStyle = `rgba(205, 215, 235, ${n.alpha})`;
      ctx.fill();

      // bords lumineux (là où la nappe se replie)
      [-1, 1].forEach((cote) => {
        ctx.beginPath(); chemin(n, t, cote);
        ctx.strokeStyle = `rgba(220, 230, 250, ${n.alpha * 0.6})`;
        ctx.lineWidth = 5; ctx.stroke();
        ctx.strokeStyle = `rgba(235, 240, 255, ${n.alpha * 2.2})`;
        ctx.lineWidth = 1; ctx.stroke();
      });
    });

    // particules : dérivent doucement vers le haut et scintillent
    particules.forEach((p) => {
      let py;
      if (p.dy !== null) {
        py = (centre(p.x, t) + p.dy * 0.5) * h - ((t * p.vitesse * 3) % 1) * 0;
      } else {
        py = (((p.y - t * p.vitesse) % 1) + 1) % 1 * h;
      }
      const px = (((p.x + t * p.vitesse * 0.3) % 1) + 1) % 1 * w;
      const a = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.5 + p.scintille));
      if (p.r > 1.5) {
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.r * 4);
        g.addColorStop(0, `rgba(255, 255, 255, ${a * 0.5})`);
        g.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, p.r * 4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
  }

  let visible = true;
  document.addEventListener("visibilitychange", () => (visible = !document.hidden));
  const debut = performance.now();
  let saut = 0; // avance le temps d'un coup : le ruban prend une nouvelle forme
  function boucle(maintenant) {
    if (visible) dessiner((maintenant - debut) / 1000 + saut);
    if (!mouvementReduit) requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);

  /* Appelé à chaque changement de page : court fondu au noir,
     puis le ruban et les particules repartent d'une autre position */
  function changerScene() {
    canvas.classList.add("vagues-coupure");
    setTimeout(() => {
      saut += 25 + Math.random() * 40;
      if (mouvementReduit) dessiner((performance.now() - debut) / 1000 + saut);
      canvas.classList.remove("vagues-coupure");
    }, 180);
  }
  return { changerScene };
}
