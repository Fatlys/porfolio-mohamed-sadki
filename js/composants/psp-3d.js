/* =========================================================
   PSP 3D — rendu WebGL sans bibliothèque
   Nécessite assets/modeles/psp-modele.js (window.PSP_MODELE) chargé avant.

   Utilisation :
   const psp = creerPSP3D(document.getElementById('psp-scene'), {
     video: 'assets/videos/showreel.mp4',   // facultatif
     images: ['assets/images/a.jpg', ...],  // diaporama si pas de vidéo
     titre: 'Demo reel',
     surChangement: (agrandie) => {}        // appelé quand on clique
   });
   ========================================================= */

(function () {
  /* ---------- Petites fonctions de matrices 4x4 ---------- */
  const M4 = {
    identite: () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
    multiplier(a, b) {
      const r = new Float32Array(16);
      for (let c = 0; c < 4; c++)
        for (let l = 0; l < 4; l++) {
          let s = 0;
          for (let k = 0; k < 4; k++) s += a[k * 4 + l] * b[c * 4 + k];
          r[c * 4 + l] = s;
        }
      return r;
    },
    perspective(fovY, aspect, pres, loin) {
      const f = 1 / Math.tan(fovY / 2), nf = 1 / (pres - loin);
      return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (loin + pres) * nf, -1, 0, 0, 2 * loin * pres * nf, 0]);
    },
    translation: (x, y, z) => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]),
    echelle: (s) => new Float32Array([s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1]),
    rotX(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]); },
    rotY(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]); },
    rotZ(a) { const c = Math.cos(a), s = Math.sin(a); return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]); },
  };

  /* ---------- Shaders ---------- */
  const VERTEX = `
    attribute vec3 aPos;
    attribute vec3 aNor;
    attribute vec2 aUv;
    uniform vec3 uLo, uHi;
    uniform mat4 uModele, uVue;
    varying vec3 vPos, vNor;
    varying vec2 vUv;
    void main() {
      vec3 p = uLo + aPos * (uHi - uLo);
      vec4 w = uModele * vec4(p, 1.0);
      vPos = w.xyz;
      vNor = mat3(uModele) * aNor;
      vUv = aUv;
      gl_Position = uVue * w;
    }`;

  const FRAGMENT = `
    precision mediump float;
    varying vec3 vPos, vNor;
    varying vec2 vUv;
    uniform vec3 uCouleur, uCamera, uAccent;
    uniform float uBrillance, uDurete, uMetal, uOpacite;
    uniform int uMode;            // 0 plein, 1 décalque, 2 écran
    uniform sampler2D uTexture;
    uniform float uEclat;

    vec3 environnement(vec3 r) {
      // faux reflet de studio : bande claire en haut, lueur bleue à l'horizon
      float haut = smoothstep(0.25, 0.95, r.y);
      float horizon = exp(-pow(r.y * 3.5, 2.0));
      return vec3(0.75, 0.8, 0.9) * haut * 0.55 + uAccent * horizon * 0.25;
    }

    void main() {
      vec3 N = normalize(vNor);
      vec3 V = normalize(uCamera - vPos);
      if (dot(N, V) < 0.0) N = -N;
      float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

      if (uMode == 2) {
        // écran : image non éclairée + reflet de vitre
        vec3 img = texture2D(uTexture, vUv).rgb * uEclat;
        vec3 reflet = environnement(reflect(-V, N)) * (0.08 + fresnel * 0.6);
        gl_FragColor = vec4(pow(img, vec3(1.0)) + reflet, 1.0);
        return;
      }

      vec3 L1 = normalize(vec3(-0.45, 0.65, 0.75));
      vec3 L2 = normalize(vec3(0.8, 0.25, -0.55));
      vec3 base = uCouleur;
      float alpha = uOpacite;
      if (uMode == 1) {
        vec4 t = texture2D(uTexture, vUv);
        base = t.rgb;
        alpha = t.a;
        if (alpha < 0.02) discard;
      }

      vec3 ambiant = mix(vec3(0.02, 0.025, 0.04), vec3(0.09, 0.11, 0.15), N.y * 0.5 + 0.5);
      float diff = max(dot(N, L1), 0.0);
      vec3 H = normalize(L1 + V);
      float spec = pow(max(dot(N, H), 0.0), uDurete) * uBrillance;
      float contre = max(dot(N, L2), 0.0);

      vec3 couleur = base * (ambiant + diff * 0.85);
      vec3 teinteSpec = mix(vec3(1.0), base, uMetal);
      couleur += teinteSpec * spec;
      couleur += environnement(reflect(-V, N)) * mix(0.03 + fresnel * 0.35, 0.45, uMetal) * (uBrillance > 0.3 ? 1.0 : 0.3);
      couleur += uAccent * (contre * 0.25 + fresnel * 0.12);

      gl_FragColor = vec4(pow(couleur, vec3(1.0 / 2.2)), alpha);
    }`;

  /* ---------- Matériaux (noms du fichier .3ds) ---------- */
  const MATERIAUX = {
    Carcasa: { couleur: [0.012, 0.012, 0.014], brillance: 1.2, durete: 90, metal: 0 },
    "Metal Blanco": { couleur: [0.55, 0.57, 0.6], brillance: 0.9, durete: 60, metal: 1 },
    Botones: { couleur: [0.03, 0.03, 0.035], brillance: 0.5, durete: 40, metal: 0 },
    tintado: { couleur: [0.04, 0.04, 0.05], brillance: 1.0, durete: 80, metal: 0 },
    hard1: { couleur: [0.035, 0.035, 0.04], brillance: 0.25, durete: 20, metal: 0 },
    cristal: { couleur: [0.25, 0.27, 0.3], brillance: 1.0, durete: 70, metal: 0 },
    Marco: { couleur: [0.01, 0.01, 0.012], brillance: 1.2, durete: 90, metal: 0 },
  };

  function creerPSP3D(conteneur, options) {
    const donnees = window.PSP_MODELE;
    if (!donnees) { console.error("psp-modele.js doit être chargé avant psp-3d.js"); return null; }
    const opts = Object.assign({ video: null, images: [], titre: "", couleurAccent: [0.23, 0.55, 1.0], surChangement: null }, options || {});
    const mouvementReduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Contexte WebGL ---------- */
    const canvas = document.createElement("canvas");
    canvas.className = "psp-canvas";
    conteneur.appendChild(canvas);
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) { conteneur.classList.add("psp-sans-webgl"); return null; }
    gl.getExtension("OES_standard_derivatives");

    function compiler(type, source) {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      return s;
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, compiler(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(prog, compiler(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const A = { pos: gl.getAttribLocation(prog, "aPos"), nor: gl.getAttribLocation(prog, "aNor"), uv: gl.getAttribLocation(prog, "aUv") };
    const U = {};
    ["uLo", "uHi", "uModele", "uVue", "uCouleur", "uCamera", "uAccent", "uBrillance", "uDurete", "uMetal", "uOpacite", "uMode", "uTexture", "uEclat"]
      .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

    /* ---------- Géométrie ---------- */
    const brut = Uint8Array.from(atob(donnees.bin), (c) => c.charCodeAt(0)).buffer;
    const meta = donnees.meta;
    function tampon(cible, TypeTableau, offset, nombre) {
      const b = gl.createBuffer();
      gl.bindBuffer(cible, b);
      gl.bufferData(cible, new TypeTableau(brut, offset, nombre), gl.STATIC_DRAW);
      return b;
    }
    const pieces = meta.parts.map((p) => ({
      mat: MATERIAUX[p.mat] || MATERIAUX.Carcasa,
      nomMat: p.mat,
      pos: tampon(gl.ARRAY_BUFFER, Uint16Array, p.pos, p.nv * 3),
      nor: tampon(gl.ARRAY_BUFFER, Int8Array, p.nor, p.nv * 4),
      idx: tampon(gl.ELEMENT_ARRAY_BUFFER, Uint16Array, p.idx, p.ni),
      ni: p.ni,
    }));

    /* ---------- Textures ---------- */
    function textureVide() {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
      return t;
    }
    const textures = {};
    Object.entries(donnees.textures).forEach(([nom, url]) => {
      const t = textureVide();
      textures[nom] = t;
      const img = new Image();
      img.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      };
      img.src = url;
    });
    const decalques = meta.decals.map((d) => ({
      tex: d.tex,
      pos: tampon(gl.ARRAY_BUFFER, Uint16Array, d.pos, d.nv * 3),
      nor: tampon(gl.ARRAY_BUFFER, Int8Array, d.nor, d.nv * 4),
      uv: tampon(gl.ARRAY_BUFFER, Uint16Array, d.uv, d.nv * 2),
      idx: tampon(gl.ELEMENT_ARRAY_BUFFER, Uint16Array, d.idx, d.ni),
      ni: d.ni,
    }));

    /* ---------- Écran : un rectangle devant la vitre ---------- */
    const [e0, e1] = meta.screen;
    const lo = meta.lo, hi = meta.hi;
    const norm = (v, i) => (v - lo[i]) / (hi[i] - lo[i]);
    const zEcran = e0[2] + 0.002;
    const coins = [[e0[0], e0[1]], [e1[0], e0[1]], [e1[0], e1[1]], [e0[0], e1[1]]];
    const ecranPos = new Uint16Array(coins.flatMap(([x, y]) => [x, y, zEcran].map((v, i) => Math.round(norm(v, i) * 65535))));
    const ecran = {
      pos: (() => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, ecranPos, gl.STATIC_DRAW); return b; })(),
      nor: (() => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Int8Array([0, 0, 127, 0, 0, 0, 127, 0, 0, 0, 127, 0, 0, 0, 127, 0]), gl.STATIC_DRAW); return b; })(),
      uv: (() => { const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array([0, 0, 65535, 0, 65535, 65535, 0, 65535]), gl.STATIC_DRAW); return b; })(),
      idx: (() => { const b = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW); return b; })(),
      ni: 6,
    };
    const texEcran = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texEcran);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    /* ---------- Contenu de l'écran : vidéo, sinon diaporama ---------- */
    let video = null;
    const toile = document.createElement("canvas");
    toile.width = 640; toile.height = 368;
    const ctx = toile.getContext("2d");
    const images = opts.images.map((src) => { const i = new Image(); i.src = src; return i; });

    if (opts.video) {
      video = document.createElement("video");
      video.src = opts.video;
      video.muted = true; video.loop = true; video.playsInline = true; video.crossOrigin = "anonymous";
      video.play().catch(() => {});
      video.addEventListener("error", () => { video = null; });
    }

    function dessinerDiaporama(t) {
      const w = toile.width, h = toile.height, duree = 4;
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, w, h);
      const prets = images.filter((i) => i.complete && i.naturalWidth);
      if (prets.length) {
        const n = Math.floor(t / duree), p = (t % duree) / duree;
        const dessiner = (img, alpha, prog) => {
          const z = 1.04 + prog * 0.08;
          const r = Math.max(w / img.naturalWidth, h / img.naturalHeight) * z;
          const iw = img.naturalWidth * r, ih = img.naturalHeight * r;
          ctx.globalAlpha = alpha;
          ctx.drawImage(img, (w - iw) / 2 - prog * 12, (h - ih) / 2, iw, ih);
        };
        dessiner(prets[(n + prets.length - 1) % prets.length], 1, 1);
        dessiner(prets[n % prets.length], Math.min(1, p * 3), p);
        ctx.globalAlpha = 1;
        // barre de lecture façon lecteur vidéo
        const g = ctx.createLinearGradient(0, h - 60, 0, h);
        g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,0.75)");
        ctx.fillStyle = g; ctx.fillRect(0, h - 60, w, 60);
        ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(24, h - 18, w - 48, 3);
        ctx.fillStyle = "#3a8dff"; ctx.fillRect(24, h - 18, (w - 48) * (((n % prets.length) + p) / prets.length), 3);
        ctx.fillStyle = "#fff"; ctx.font = "500 18px Segoe UI, system-ui, sans-serif";
        ctx.fillText(opts.titre, 24, h - 30);
      }
    }

    function majEcran(t) {
      let source = toile;
      if (video && video.readyState >= 2) source = video;
      else dessinerDiaporama(t);
      gl.bindTexture(gl.TEXTURE_2D, texEcran);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source); }
      catch (e) { video = null; } // vidéo bloquée (ex. ouverte sans serveur) : on garde le diaporama
    }

    /* ---------- Dessin d'une pièce ---------- */
    function lier(attr, buffer, taille, type, normalise, pas) {
      if (attr < 0) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, taille, type, normalise, pas || 0, 0);
    }
    function dessiner(p, uv) {
      lier(A.pos, p.pos, 3, gl.UNSIGNED_SHORT, true);
      lier(A.nor, p.nor, 3, gl.BYTE, true, 4); // normales rangées par 4 octets
      if (uv) lier(A.uv, uv, 2, gl.UNSIGNED_SHORT, true);
      else if (A.uv >= 0) { gl.disableVertexAttribArray(A.uv); gl.vertexAttrib2f(A.uv, 0, 0); }
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, p.idx);
      gl.drawElements(gl.TRIANGLES, p.ni, gl.UNSIGNED_SHORT, 0);
    }

    /* ---------- État et animation ---------- */
    let agrandie = false;
    const souris = { x: 0, y: 0 };
    const etat = { rx: 0.35, ry: 0, rz: 0, y: 0, remplissage: 0.72 };
    window.addEventListener("pointermove", (e) => {
      souris.x = (e.clientX / window.innerWidth - 0.5) * 2;
      souris.y = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function basculer(valeur) {
      agrandie = typeof valeur === "boolean" ? valeur : !agrandie;
      conteneur.classList.toggle("agrandie", agrandie);
      conteneur.setAttribute("aria-pressed", String(agrandie));
      if (video) {
        video.muted = !agrandie;
        if (agrandie) video.play().catch(() => {});
      }
      if (opts.surChangement) opts.surChangement(agrandie);
    }
    conteneur.addEventListener("click", () => basculer());
    conteneur.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); basculer(); }
      if (e.key === "Escape" && agrandie) basculer(false);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && agrandie) basculer(false); });

    /* Taille du canvas : vérifiée juste avant chaque dessin.
       (Un ResizeObserver vide le canvas après le dessin : la PSP
       disparaissait pendant l'agrandissement.) */
    function redimensionner() {
      const r = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(conteneur.clientWidth * r));
      const h = Math.max(1, Math.round(conteneur.clientHeight * r));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }

    let visible = true;
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(conteneur);

    const debut = performance.now();
    let avant = debut;
    function image() {
      requestAnimationFrame(image);
      const maintenant = performance.now();
      const dt = Math.min((maintenant - avant) / 1000, 0.1);
      avant = maintenant;
      if (!visible) return;
      const t = (maintenant - debut) / 1000;
      const auto = !mouvementReduit;

      // cibles : en mouvement (comme la manette) ou redressée face à l'écran
      const cible = agrandie
        ? { rx: 0, ry: 0, rz: 0, y: 0, remplissage: 0.94 }
        : {
            rx: 0.38 + souris.y * 0.12,
            ry: (auto ? Math.sin(t * 0.35) * 0.45 : 0) + souris.x * 0.35,
            rz: auto ? Math.sin(t * 0.5) * 0.04 : 0,
            y: auto ? Math.sin(t * 0.8) * 0.03 : 0,
            remplissage: 0.72,
          };
      const k = 1 - Math.exp(-dt * (agrandie ? 5.5 : 3)); // lissage indépendant des FPS
      for (const cle in cible) etat[cle] += (cible[cle] - etat[cle]) * k;

      redimensionner();
      const w = canvas.width, h = canvas.height, aspect = w / h;
      gl.viewport(0, 0, w, h);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      const fovY = 0.5;
      const tanY = Math.tan(fovY / 2), tanX = tanY * aspect;
      const dist = Math.max(1.02 / tanX, 0.44 / tanY) / etat.remplissage + 0.17;
      const vue = M4.multiplier(M4.perspective(fovY, aspect, 0.1, 20), M4.translation(0, 0, -dist));
      let modele = M4.translation(0, etat.y, 0);
      modele = M4.multiplier(modele, M4.rotY(etat.ry));
      modele = M4.multiplier(modele, M4.rotX(etat.rx));
      modele = M4.multiplier(modele, M4.rotZ(etat.rz));

      gl.uniformMatrix4fv(U.uVue, false, vue);
      gl.uniformMatrix4fv(U.uModele, false, modele);
      gl.uniform3fv(U.uLo, lo);
      gl.uniform3fv(U.uHi, hi);
      gl.uniform3f(U.uCamera, 0, 0, dist);
      gl.uniform3fv(U.uAccent, opts.couleurAccent);
      gl.uniform1i(U.uTexture, 0);
      gl.activeTexture(gl.TEXTURE0);

      // 1. pièces opaques
      gl.disable(gl.BLEND);
      gl.depthMask(true);
      gl.uniform1i(U.uMode, 0);
      gl.uniform1f(U.uOpacite, 1);
      pieces.forEach((p) => {
        gl.uniform3fv(U.uCouleur, p.mat.couleur);
        gl.uniform1f(U.uBrillance, p.mat.brillance);
        gl.uniform1f(U.uDurete, p.mat.durete);
        gl.uniform1f(U.uMetal, p.mat.metal);
        dessiner(p);
      });

      // 2. écran
      majEcran(t);
      gl.bindTexture(gl.TEXTURE_2D, texEcran);
      gl.uniform1i(U.uMode, 2);
      gl.uniform1f(U.uEclat, 1.0);
      dessiner(ecran, ecran.uv);

      // 3. décalques (symboles, textes) par-dessus
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      gl.enable(gl.POLYGON_OFFSET_FILL);
      gl.polygonOffset(-2, -8);
      gl.uniform1i(U.uMode, 1);
      gl.uniform1f(U.uBrillance, 0.3);
      gl.uniform1f(U.uDurete, 30);
      gl.uniform1f(U.uMetal, 0);
      decalques.forEach((d) => {
        gl.bindTexture(gl.TEXTURE_2D, textures[d.tex]);
        dessiner(d, d.uv);
      });
      gl.disable(gl.POLYGON_OFFSET_FILL);
      gl.depthMask(true);
    }
    image();

    return { basculer, get agrandie() { return agrandie; } };
  }

  window.creerPSP3D = creerPSP3D;
})();
