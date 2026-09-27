# Mon Petit Coin de Bretagne — Nouveau site

📁 Ce dossier se trouve sur le **Bureau** de l'ordinateur (`Desktop\mon-petit-coin-de-bretagne`).

Refonte complète du site de la maison d'hôtes **Mon Petit Coin de Bretagne** (Riantec, Morbihan), à partir d'un audit du site actuel (Wix) et des avis clients (Booking.com, Tripadvisor).

## Stack technique

**HTML / CSS / JavaScript pur — zéro dépendance, zéro build.**
Aucun framework, aucun `npm install` nécessaire : le site s'ouvre et se déploie tel quel. (Astro avait été envisagé initialement, mais l'outil d'exécution de commandes de cette session s'est révélé indisponible, rendant tout outil nécessitant un build impraticable — le HTML/CSS/JS pur s'est donc imposé, avec l'avantage d'être plus simple à maintenir sans connaissances techniques.)

## Structure

```
index.html                    Accueil
chambres/index.html           Vue d'ensemble des chambres
chambres/citadelle.html       Chambre premium — Citadelle
chambres/petite-mer.html      Chambre premium — Petite Mer
chambres/grande-plage.html    Chambre premium — Grande Plage
chambres/babord.html          Suite Bâbord
chambres/tribord.html         Suite Tribord
piscine.html                  Piscine intérieure chauffée
petit-dejeuner.html           Petit-déjeuner
jardin.html                   Le jardin
le-morbihan.html              Découverte du Morbihan
avis.html                     Avis clients (Booking + Tripadvisor)
tarifs.html                   Grille tarifaire 2026
informations-pratiques.html   CGV + règlement piscine (accordéon)
mentions-legales.html         Mentions légales
contact.html                  Contact & réservation (formulaire mailto + carte)
css/style.css                 Feuille de style unique (charte graphique)
js/main.js                    Menu mobile, apparitions au scroll
js/activities-data.js         Données du guide local (à éditer pour ajouter/modifier une activité)
js/decouvrir.js               Logique du guide : filtres, recherche, planificateur, carte, expériences
sitemap.xml, robots.txt       SEO
research/                     Notes d'audit du site actuel, synthèse des avis, sources du guide local
assets/source/                Copie locale des ~65 photos originales (archive)
```

## Guide local « Découvrir la Bretagne autour de vous »

Intégré à `le-morbihan.html` : recherche instantanée, filtres par catégorie, planificateur « Que faire aujourd'hui ? », parcours/expériences avec timeline, carte schématique (sans clé d'API — voir `js/decouvrir.js`), et coups de cœur d'Emmanuelle. Un teaser « Et autour de vous ? » a été ajouté sur chaque fiche chambre, et un rappel sur la page contact.

**Pour ajouter/modifier une activité** : éditez le tableau `ACTIVITIES` dans `js/activities-data.js` (un objet = une activité, schéma commenté en tête de fichier). Le rendu se met à jour automatiquement, aucune autre modification nécessaire. Sources et méthodologie détaillées dans `research/decouvrir-sources.md`.

## Photos

Les pages référencent actuellement les photos via le CDN de l'ancien site (`static.wixstatic.com`) — ce sont vos vraies photos, servies avec redimensionnement et compression automatiques par ce CDN (rapide, optimisé). Une copie locale complète a été téléchargée dans `assets/source/` par catégorie, au cas où vous souhaiteriez couper toute dépendance à l'ancien hébergement Wix.

**Important : chaque photo a été vérifiée visuellement une par une** avant d'être associée à une page, pour éviter les erreurs (une piscine légendée « jardin », une salle à manger commune présentée comme une chambre, etc. — corrigées durant la construction). Faute de photos individuelles distinctes pour Citadelle/Petite Mer/Grande Plage sur les sources publiques actuelles, certaines photos de chambre premium sont réutilisées entre ces trois fiches (les trois chambres étant structurellement identiques : 30 m², douche italienne, dressing). À affiner dès que des photos propres à chaque chambre seront disponibles.

## Points laissés en TODO (transparence, rien n'a été inventé)

- **Noms des chambres premium** (Citadelle / Petite Mer / Grande Plage) : utilisés sur votre demande explicite ; absents des sources publiques actuelles (site Wix, Booking, Tripadvisor), qui regroupent les 3 chambres sans nom individuel. À faire valider auprès d'Emmanuelle et Christophe.
- **Mentions légales** : hébergeur du nouveau site à préciser selon votre choix d'hébergement définitif.
- Voir `research/audit-site-actuel.md` pour les deux contradictions relevées entre pages du site actuel (horaires piscine, heure de départ) et la source retenue pour trancher.

## Prévisualiser le site en local

Sans serveur Node/Python disponible sur cette machine, un petit script PowerShell autonome (`.claude/serve.ps1`) sert le site sur `http://localhost:5173`. Pour le lancer vous-même :

```bash
powershell -ExecutionPolicy Bypass -File .claude\serve.ps1
```

Puis ouvrez `http://localhost:5173` dans un navigateur. Sinon, ouvrir simplement `index.html` directement dans un navigateur fonctionne aussi pour l'essentiel (le formulaire de contact et les liens relatifs fonctionnent en local par fichier).

## Déployer

Le site est un dossier de fichiers statiques : il se dépose tel quel sur n'importe quel hébergement mutualisé, ou sur Netlify / Vercel / GitHub Pages (glisser-déposer le dossier, aucune configuration de build requise).
