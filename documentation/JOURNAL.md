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




