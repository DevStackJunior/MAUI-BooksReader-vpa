OBJECTIF PRINCIPAL :
INTEGRER UN FORMAT DE DONNEE BLOB SUR BACK-END AFIN DE DISPLAY INFORMATIONS SUR APP MAUI.

2 aller-retour dans API

## CONTEXTE :

- On reprend l'API Back-End déjà construite sur le projet Passion_Lecture (AdonisJS)

  - Ajouter une fonction pour afficher les détails du livre sur MAUI App C#
  - Ajouter une fonction pour stocker un BLOB temporairement

- On reprend la partie Back-End qui est déjà construite en groupe et liée au container Docker (MySQL | PHPMyAdmin)

---

A CLARIFIER :

Transformation du Format de la donnée en étapes : EPUB - STRING - ???

## SQL (Database) Docker Container

LOAD_FILE() |
Binaire -> LONGBLOB |

## Back-End AdonisJS

1. Affichage détails livre | Contenu Objet JSON retourné par : response.stream()
2. Affichage détails livre | Contenu Objet JSON avec type MIME application/epub+zip retourné par : response.send(buffer)
   2.1 Exposer les points de terminaison (endpoints)
   2.1.1 Objectif : Tester téléchargement du BLOB directement depuis l'interface Swagger

## App MAUI .NET

### Appel API :

1. Réception BLOB (sans saturer mobile) : HttpClient.GetStreamAsync()

Affichage (Display) : La liseuse (WebView ou moteur interne) pointe vers le chemin du **fichier local** créé pour afficher le texte et naviguer entre les pages.

### Persistance Temporaire :

Le flux binaire est écrit sur le disque local via File.WriteAllBytesAsync() dans le dossier FileSystem.CacheDirectory.

Database (MySQL) - Sequelize

string stocké

7.1.2 Backend
• Compléter / Adapter le backend du projet « Passion Lecture » lorsque cela est
nécessaire, notamment pour :
o Stocker le contenu epub et la date d’insertion
o Gérer les tags

7.1.3 Liseuse | Comportement Utilisateur
• Format supporté : epub (sans drm) jusqu’à la version 3.3
• Affichage libre (texte ou WEB ou autre)
• Mémoriser la dernière page affichée
• Reprise automatique à cette page
• Naviguer entre les pages en pressant sur des boutons

7.1.4 Gestion des livres | Filtres, Création de Tags, Associer tag comme équivalent d'une catégorie, Filtre par tag,
• Possibilité de lister les livres en triant par date d’ajout
o Affichage de la page de couverture en miniature
• Possibilité de créer des tags
o Qu’on peut associer aux livres
o Par lesquels on peut filtrer les livres présentés

7.1.5 Importer les epubs
• Créer un script SQL pour importer les epubs dans la base de données dans un
champ de type BLOB.

