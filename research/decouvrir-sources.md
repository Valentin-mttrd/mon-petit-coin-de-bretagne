# Sources vérifiées — Guide « Découvrir la Bretagne autour de vous »

Toutes les activités intégrées dans `js/activities-data.js` ont été vérifiées via recherche web avant intégration (sites officiels en priorité). Aucune donnée n'a été inventée : les horaires et tarifs, volatils, ne sont volontairement pas détaillés sur le site — chaque fiche renvoie vers la source officielle.

| Lieu | Source(s) vérifiée(s) |
|---|---|
| Citadelle de Port-Louis / Musée national de la Marine | [musee-marine.fr](https://www.musee-marine.fr/nos-musees/port-louis.html) |
| Cité de la Voile Éric Tabarly | [citevoile-tabarly.com](https://www.citevoile-tabarly.com) |
| Base des sous-marins de Keroman | [patrimoine.lorient.bzh](https://patrimoine.lorient.bzh/histoire/architecture/edifices-militaires/base-de-sous-marins-de-keroman/) |
| Hennebont | [lorientbretagnesudtourisme.fr](https://www.lorientbretagnesudtourisme.fr/fr/immanquables/hennebont/) |
| Fort-Bloqué (Ploemeur) | [ploemeur.com](https://www.ploemeur.com/en/decouvrir/les-plages/fort-bloque/), [morbihan.com](https://morbihan.com/a-voir-a-faire/activites-et-loisirs/plage-du-fort-bloque-ploemeur-fr-4407736/) |
| Île de Groix (traversée) | [oceane.breizhgo.bzh](https://oceane.breizhgo.bzh), [groix.fr](https://groix.fr) |
| Carnac / Maison des Mégalithes | [menhirs-carnac.fr](https://www.menhirs-carnac.fr) (Centre des monuments nationaux) |
| Quiberon & Côte Sauvage | [quiberon.com](https://www.quiberon.com) (office de tourisme intercommunal Baie de Quiberon) |
| Vannes / Golfe du Morbihan | [golfedumorbihan.bzh](https://www.golfedumorbihan.bzh) (office de tourisme) |
| Croisières Golfe du Morbihan | [izenah-croisieres.com](https://www.izenah-croisieres.com) |
| Belle-Île-en-Mer | [belle-ile.com](https://www.belle-ile.com) (office de tourisme officiel) |
| Festival Interceltique de Lorient | [festival-interceltique.bzh](https://www.festival-interceltique.bzh) (site officiel du festival) |
| Saint-Goustan (Auray) | [morbihan.com](https://morbihan.com/decouvrir/le-morbihan-et-ses-perles-bretonnes/destination-carnac-et-baie-de-quiberon/auray-saint-goustan/) |
| Concarneau — Ville Close | [deconcarneauapontaven.com](https://www.deconcarneauapontaven.com/explorer/vacances-de-concarneau-a-pont-aven/visiter-concarneau/) (office de tourisme) |
| Pont-Aven | [pontaven.fr](https://www.pontaven.fr/Office-de-Tourisme) (office de tourisme) |
| La Ria d'Étel | [lorientbretagnesudtourisme.fr](https://www.lorientbretagnesudtourisme.fr/fr/aux-alentours/cote-morbihan/ria-d-etel/) |
| Saint-Cado (Belz) | [morbihan.com](https://morbihan.com/a-voir-a-faire/suivez-le-guide/chapelle-saint-cado-belz-fr-6094584/) |
| Larmor-Plage | [lorientbretagnesudtourisme.fr](https://www.lorientbretagnesudtourisme.fr/fr/immanquables/larmor-plage/) |
| Guidel-Plages & la Laïta | [lorientbretagnesudtourisme.fr](https://www.lorientbretagnesudtourisme.fr/fr/immanquables/guidel/) |
| Voie verte de la vallée du Blavet | [morbihan.com](https://morbihan.com/decouvrir/sauvage-mythique/sur-les-chemins-du-morbihan-balades-et-randos/idee-balade-decouverte-de-la-vallee-du-blavet/) |
| Dunes de Plouhinec | [morbihan.com](https://morbihan.com/decouvrir/le-morbihan-et-ses-perles-bretonnes/destination-ria-detel/plouhinec/) |
| Réserve naturelle des marais de Pen Mané (Locmiquélic) | [lorientbretagnesudtourisme.fr](https://www.lorientbretagnesudtourisme.fr/fr/immanquables/locmiquelic/reserve-marais-pen-mane/) |

**Retiré (2026-09-15)** : la catégorie « Gastronomie » et ses trois fiches (La Scala, Le Jardin St Aimé, Pizza Minahouet) ont été supprimées à la demande d'Emmanuelle et Christophe. Elles n'étaient de toute façon pas vérifiées indépendamment (mentions Booking.com uniquement).

## Distances et temps de trajet
Estimés depuis Mon Petit Coin de Bretagne (15 route de la Croizetière, 56670 Riantec) à partir de la géographie routière connue du secteur — **non calculés via une API de cartographie** (aucun accès outillé disponible pour cette session). À vérifier avec un GPS le jour J ; c'est explicitement indiqué aux visiteurs sur le site ("estimés").

## Carte interactive
Aucune clé d'API n'a été utilisée ni inventée. La section carte du guide est une représentation **schématique et illustrative** (positions approximatives par direction/éloignement, pas de géolocalisation réelle), avec un lien "Itinéraire" par activité qui ouvre Google Maps (URL publique sans clé). Pour une vraie carte géolocalisée, voir le commentaire dans `js/decouvrir.js` (section `MAP_POSITIONS`) indiquant où brancher une API cartographique (Mapbox GL, Google Maps JS…) le moment venu.

## Images
Aucune photo de lieu tiers (Carnac, Quiberon, Vannes, etc.) n'a été utilisée, pour deux raisons : (1) aucune photo de ces lieux n'appartient à l'établissement, et utiliser des photos glanées sur le web sans vérification des droits aurait été risqué ; (2) cela permet une direction artistique cohérente et distinctive (cartes duotone éditoriales avec icône, plutôt que des photos disparates de qualité inégale). Seules les photos déjà utilisées ailleurs sur le site (propriété de l'établissement) illustrent le hero et le bandeau CTA de la page.
