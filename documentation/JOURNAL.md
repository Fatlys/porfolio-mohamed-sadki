## Qu'est-ce que j'ai accompli depuis le dernier bloc?

J'ai réalisé un moodboard afin de définir l'identité visuelle du site, puis j'ai créé le design de l'interface sur Figma en m'inspirant de l'esthétique des menus PlayStation.

## Quelle a été ma principale difficulté et comment je l'ai surmontée?

Ma principale difficulté a été de trouver une direction visuelle qui correspond à mon style tout en gardant une interface claire et facile à utiliser (En fait j'ai longtemps hésiter entre 2 style). J'ai surmonté cette difficulté en faisant des recherches visuelles et en organisant mes idées dans un moodboard avant de commencer le design sur Figma.

## Qu'est-ce que j'ai appris que je ne savais pas avant?

J'ai appris qu'il est important de bien faire les recherche sur l'identité visuelle et la structure d'un site pour voir si le style visuelle choisi peut bien correspondre a un portfolio.

## Quelle est ma prochaine étape concrète?

Ma prochaine étape est de commencer à coder le portfolio en HTML, CSS et JavaScript en suivant le design que j'ai créé sur Figma.

## Est-ce que j'ai utilisé l'IA? Si oui, pour quoi et qu'est-ce que ça m'a appris?

Non


## UTULISATION D'IA

## Étape 1 — Le fond

1.1 Les vagues

Date : 24 septembre

Prompt : Crée un fond animé en JavaScript avec un canvas, inspiré du menu de la PS3. Je veux un grand ruban de vagues transparentes, gris-bleu, qui traverse tout l'écran en diagonale et bouge lentement. Le canvas doit rester derrière le contenu de la page et prendre toute la taille de l'écran.

Outil : Copilot

Résultat : Copilot a créé un fond animé avec un ruban de vagues transparentes qui bouge doucement en diagonale. J'ai mis ce code dans un nouveau fichier vagues.js, et le style du fond dans css/base.css.(Le résultat était bien pas exactement ce que je voulais. J'ai fait un peu de essaye erreur jusqu'a ce que le résultat du promprt me convienne)

1.2 Les particules

Date : 24 septembre

Prompt : Ajoute des petites particules blanches qui flottent et brillent un peu partout sur le fond, avec un peu plus de particules autour des vagues. Garde les vagues comme elles sont.

Outil : Copilot

Résultat : Copilot a ajouté des petits points blancs qui bougent lentement et scintillent, plus nombreux près des vagues. Accepté tel quel.

## Étape 2 — Le menu

2.1 Le menu en haut

Date : 25 septembre

Prompt : Crée un menu en haut de la page qui reste fixé quand on descend. Il doit avoir 5 onglets avec une icône et un texte : Accueil, Projets, Demo reel, Compétences, Contact. L'onglet actif doit être en blanc avec une petite barre bleue en dessous. À droite, ajoute un petit cadre avec la date et l'heure.

Outil : Copilot

Résultat : Copilot a créé le menu fixé en haut avec les 5 onglets, l'onglet actif en bleu et l'horloge à droite :

le HTML du menu dans index.html ;
le style dans css/composants/navigation.css ;
les icônes dans js/data.js ;
le changement d'onglet et l'horloge dans js/main.js.

modifié : La taille des icones et du menu en générale était trop petite j'ai agrandi tout sa 

Prompt : Agrandis le menu : des icônes et un texte plus grands, et un cadre de l'heure plus grand aussi. Rapproche les onglets pour qu'ils soient collés à gauche, même sur un grand écran.

Outil : Copilot

Résultat : Copilot a agrandi les icônes, le texte et l'horloge, et a regroupé les onglets à gauche. 

## Étape 3 — Accueil 

3.1 L'image low poly

Date : 26 septembre

Prompt :  Transforme cette photo de moi en personnage 3D low poly, en gardant mes vêtements et ma pose, en png.

Outil : ChatGPT

Résultat : ChatGPT a transformé ma photo en personnage 3D low poly avec mes vêtements. Je l'ai ajoutée dans assets/images/perso-low-poly.png. Accepté tel quel 

3.2 Le personnage et la carte profil

Date : 30 septembre

Prompt : Sur la page d'accueil, mets mon image low poly à droite, debout sur un petit socle rond en 3D avec une lumière bleue en dessous. À gauche, ajoute une carte avec ma petite photo carrée, mon nom « Mohamed Ali Sadki », le mot « Portfolio » et « Design · Vidéo · 3D ». Rapproche bien la carte et le personnage au centre de l'écran.

Outil : Copilot

Résultat : Copilot a placé le personnage sur un socle bleu et a créé la carte profil à côté :

créé le fichier css/composants/profil.css pour la carte ;
ajouté la page d'accueil dans index.html ;
ajouté le style du personnage et du socle dans css/layout.css ;
ajouté mes infos (PROFIL) dans js/data.js ;
ajouté le code qui remplit la carte dans js/main.js.

Modifié : Le personnage et la carte n'était pas asser raprocher et la lueur bleu sous le personnage était trop forte, J'ai modifié avec copilote jusqu'a avoir le bon résultat

## Étape 4 —contact

3.3 Le contact

Date : 30 septembre

Prompt : Crée la page Contact, centrée au milieu de l'écran, avec un titre et 4 lignes cliquables : Gmail, Instagram, GitHub et Discord. Chaque ligne a une icône, le nom du réseau et mon identifiant. Pour Discord, un clic doit copier mon pseudo.

Outil : Copilot

Résultat : Copilot a créé la page Contact avec les 4 réseaux centrés. Un clic sur Discord copie le pseudo :

ajouté la page dans index.html ;
ajouté le style dans css/layout.css ;
ajouté la liste des réseaux (CONTACTS) dans js/data.js ;
ajouté le code qui crée les lignes et copie le pseudo Discord dans js/main.js.

modifié : L'identité visuelle était pas bonne

Prompt : Change le style de la page Contact pour qu'il suive l'identité visuelle du site, comme le menu de la PS3 : des lignes sombres et un peu transparentes, avec une fine bordure et des coins arrondis. Au survol, la ligne doit s'allumer avec une lueur bleue. Le texte doit être blanc et l'identifiant en gris. Utilise les couleurs de variables.css 

Résultat : Copilot a changé le style des lignes de contact : fond sombre transparent, bordure fine, coins arrondis et lueur bleue au survol, avec les couleurs du site. 

Accepté tel quel



## Étape 5 — Mise en page Projets

date : 30 septembre

Prompt : Crée la section Projets. Les projets sont dans un fichier data/projects.json : charge-les avec fetch. Affiche une rangée par catégorie (Montage vidéo, Jeux vidéo, Design web) avec un titre et une icône. Dans chaque rangée, mets les vignettes des projets . À droite de la rangée, ajoute un panneau qui montre le titre, la mention et le résumé du projet survolé. Au survol, la vignette doit s'allumer avec une bordure bleue. 

Outil : Copilot

Résultat : Copilot a créé la section Projets avec une rangée par catégorie, les vignettes et le panneau d'aperçu qui change au survol  :
- créé data/projects.json avec mes 5 projets ;
- ajouté les fonctions chargerProjets() et afficherProjets() dans js/main.js ;
- créé js/composants/carte-projet.js pour fabriquer les vignettes ;
- créé css/composants/carte-projet.css pour leur style ;
- ajouté le style des rangées dans css/layout.css ;
- ajouté la liste des catégories dans js/data.js ;
- ajouté la section dans index.html.

modifié : Encore une fois c'était pas parfait dés le premier prompt et j'ai du faire quelque modif avec copilot pour avoir un résultat qui corespond exactement a ce que je voulais.


## Étape 6 — Demo reel / Compétences

date : 1 octobre

Prompt : Ajoute la section Demo reel avec mon modèle 3D de PSP (assets/modeles/psp-modele.js), affiché en WebGL de trois quarts, sans animation, avec l'écran éteint pour l'instant. Ajoute ensuite la section Compétences avec une carte par logiciel : le nom, le domaine, le pourcentage et une barre bleue remplie selon le niveau. After Effects, Premiere Pro, DaVinci Resolve, Photoshop et Figma à 100 %, Maya et Unity à 80 %.

Outil : Copilot / claude

Résultat : Copilot a affiché la PSP en 3D, fixe, avec l'écran noir, et a créé les 7 cartes de compétences avec leur barre remplie. J'ai :
- créé js/composants/psp-3d.js pour afficher la PSP ;
- créé css/composants/psp.css pour la taille de la zone ;
- créé css/composants/competences.css pour les cartes et les barres ;
- ajouté la liste des compétences (COMPETENCES) dans js/data.js ;
- ajouté le code qui crée la PSP et les barres dans js/main.js ;
- ajouté les deux sections et les scripts dans index.html.

modifié : J'ai pas réussi a bien intégré la PsP avec copilot j'ai donc utilisé claude avec le meme prompt et finalement sa a bien marcher

## Étape 7 — Demo-reel dans la PsP

date : 3 octobre

Prompt : Fais jouer mon demo reel (assets/videos/demo-reel.mp4) directement dans l’écran de la PSP 3D. La vidéo doit s’afficher seulement sur l’écran, pas sur le reste de la console. Au clic sur la PSP, la vidéo démarre ou se met en pause. Ajoute une petite lueur bleue autour de l’écran quand la vidéo joue. Garde la PSP fixe de trois quarts comme avant.

Outil : Copilot

Résultat : Copilot a mis la vidéo du demo reel sur l’écran de la PSP. Elle démarre et se met en pause au clic, avec une lueur bleue quand elle joue :

ajouté la vidéo dans assets/videos/demo-reel.mp4 ;
modifié js/composants/psp-3d.js pour afficher la vidéo sur l’écran ;
ajouté le style de la lueur dans css/composants/psp.css ;
ajouté le code du clic lecture/pause dans js/main.js.

modifié : La vidéo était un peu étirée et dépassait de l’écran de la PSP

Prompt : Ajuste la vidéo pour qu’elle rentre exactement dans l’écran de la PSP, sans être étirée ni dépasser des bords.

Outil : Copilot

Résultat : Copilot a recadré la vidéo pour qu’elle rentre bien dans l’écran. Accepté tel quel.

## Étape 8 — Projects Pop Up

date : 3 octobre

Prompt : Quand on clique sur une vignette dans la section Projets, ouvre une fenêtre pop-up au centre de l’écran avec le fond flouté derrière. Dans la pop-up, affiche la vidéo ou l’image du projet, le titre, la mention, la description complète et les outils utilisés. Ajoute un bouton X pour fermer, et la pop-up doit aussi se fermer avec la touche Échap ou en cliquant à côté. Garde le style du site : fond sombre transparent, fine bordure, coins arrondis et couleurs de variables.css.

Outil : Copilot

Résultat : Copilot a créé la pop-up qui s’ouvre au clic sur un projet, avec le fond flouté et les infos du projet :

créé js/composants/popup-projet.js pour ouvrir et remplir la pop-up ;
créé css/composants/popup-projet.css pour son style ;
ajouté la description et les outils de chaque projet dans data/projects.json ;
ajouté la structure de la pop-up dans index.html ;
ajouté le clic sur les vignettes dans js/composants/carte-projet.js.

modifié : La pop-up apparaissait d’un coup, c’était pas fluide

Prompt : Ajoute une petite animation à l’ouverture et à la fermeture de la pop-up : elle doit apparaître en fondu en grandissant un peu, comme dans le menu de la PS3.

Outil : Copilot

Résultat : Copilot a ajouté une animation de fondu et de zoom léger à l’ouverture et à la fermeture. Accepté tel quel.

## Étape 9 — Acceuil Carousel

date : 4 octobre

Prompt : Sur la page d’accueil, sous la carte profil et le personnage, ajoute un carrousel qui fait défiler mes projets en vedette avec leurs vignettes. Il doit défiler tout seul toutes les quelques secondes, avec des flèches à gauche et à droite et des petits points en dessous pour savoir où on est. La vignette du centre doit être plus grande avec une bordure bleue. Au clic sur une vignette, ouvre la pop-up du projet. Utilise les projets de data/projects.json.

Outil : Copilot

Résultat : Copilot a créé le carrousel sur l’accueil qui défile tout seul, avec les flèches, les points et la vignette du centre mise en avant :

créé js/composants/carrousel.js pour le défilement ;
créé css/composants/carrousel.css pour son style ;
ajouté le carrousel dans la page d’accueil de index.html ;
ajouté le code qui remplit le carrousel et ouvre la pop-up dans js/main.js.

modifié : Le carrousel prenait trop de place et poussait la carte et le personnage vers le haut

Prompt : Rends le carrousel plus petit et plus compact pour que la carte profil et le personnage restent bien centrés dans l’écran.

Outil : Copilot

Résultat : Copilot a réduit la taille du carrousel. Le tout rentre bien dans l’écran. Accepté tel quel.


## Étape 10 — Texte « Portfolio » sous le socle

date : 10 octobre

Prompt : Sur la page d’accueil, écris le mot « PORTFOLIO » en grand juste en dessous du petit socle rond du personnage. Le texte doit être blanc, en majuscules, avec des lettres bien espacées et une légère lueur bleue, comme dans le menu de la PS3. Il doit être centré sous le socle et suivre le personnage si la taille de l’écran change. Utilise les couleurs de variables.css.

Outil : Copilot / Claude

Résultat : Claude a ajouté le mot « PORTFOLIO » centré sous le socle, en blanc avec une lueur bleue :

ajouté le texte dans la page d’accueil de index.html ;
ajouté le style du texte et de la lueur dans css/layout.css.

modifié : J’ai d’abord essayé avec Copilot, mais le texte ne se plaçait pas bien sous le socle. Il se décalait ou passait derrière le personnage. J’ai donc utilisé Claude avec le même prompt, et cette fois ça a bien marché.

## Étape 11 — Dernières modifications

date : 14 octobre

11.1 Agrandir l’accueil

Prompt : Sur la page d’accueil, agrandis le texte « PORTFOLIO » sous le socle, le texte du carrousel et l’image de mon personnage low poly. Garde tout bien centré et assure-toi que la carte profil, le personnage et le carrousel rentrent encore dans l’écran.

Outil : Copilot

Résultat : Copilot a agrandi le texte « PORTFOLIO », le texte du carrousel et le personnage, en gardant tout centré dans l’écran :

modifié la taille du texte et du personnage dans css/layout.css ;
modifié la taille du texte du carrousel dans css/composants/carrousel.css.

Accepté tel quel.

11.2 Agrandir le menu

Prompt : Agrandis encore le menu en haut : des icônes et un texte plus grands, et le cadre de l’heure plus grand aussi. Garde les onglets collés à gauche.

Outil : Copilot

Résultat : Copilot a agrandi encore les icônes, le texte et l’horloge du menu, en gardant les onglets à gauche :

modifié css/composants/navigation.css.

Accepté tel quel.

11.3 Enlever les pourcentages des compétences

Prompt : Dans la section Compétences, enlève les pourcentages affichés sur les cartes. Garde seulement le nom du logiciel, le domaine et la barre bleue remplie selon le niveau.

Outil : Copilot

Résultat : Copilot a enlevé les pourcentages des cartes. Il reste le nom, le domaine et la barre :

modifié le code qui crée les cartes dans js/main.js ;
enlevé le style du pourcentage dans css/composants/competences.css.

## Étape 12 — Images du processus de création (projet VR)

date : 15 octobre

12.1 Ajouter les images des étapes

Prompt : Dans la pop-up de mon projet VR, ajoute une image sous chaque étape du processus de création : moodboard, illustration Photoshop, schéma du déroulement et planification. Les images sont Picture1.png à Picture4.png dans assets/images/. Affiche-les en petit, juste sous le texte de leur étape. Ajoute l’image de chaque étape dans data/projects.json.

Outil : Copilote

Résultat : Copilote a ajouté une petite image (320 px de large maximum) sous chaque étape du processus du jeu VR :

ajouté Picture1.png à Picture4.png dans assets/images/ ;
modifié data/projects.json pour que chaque étape du processus ait un texte et une image ;
modifié js/composants/modale.js pour afficher l’image sous chaque étape ;
ajouté le style des petites images dans css/composants/modale.css.

modifié : Au clic sur une image, elle s’ouvrait dans un nouvel onglet au lieu de rester dans le site.

12.2 Agrandir l’image au clic

Prompt : Quand on clique sur une image du processus, ne l’ouvre pas dans un nouvel onglet. Affiche-la plutôt en grand au milieu de l’écran, par-dessus la pop-up, avec le fond flouté derrière. Elle doit se fermer au clic, avec un bouton X ou avec la touche Échap, et ramener à la pop-up du projet. Garde le style du site.

Outil : Copilote

Résultat : Copilote a remplacé l’ouverture dans un nouvel onglet par une visionneuse. Au clic, l’image s’affiche en grand au milieu de l’écran et le reste devient flou. Un clic, le bouton X ou Échap la referme et ramène à la pop-up :

ajouté la visionneuse (un deuxième <dialog>) dans index.html ;
ajouté le code d’ouverture et de fermeture dans js/composants/modale.js ;
ajouté le style de la visionneuse et du fond flou dans css/composants/modale.css.

