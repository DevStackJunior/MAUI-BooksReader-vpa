# Architecture de Gestion des Fichiers EPUB (BLOB)

Ce document synthétise le flux de transformation des données binaires, de la base de données MySQL jusqu'à l'affichage dans l'application mobile MAUI.

---

## Synthèse du Flux de Données

| Étape            | État de la donnée   | Composant          | Action clé                              |
| :--------------- | :------------------ | :----------------- | :-------------------------------------- |
| **Stockage**     | Fichier Binaire     | **MySQL**          | `LONGBLOB` + `LOAD_FILE`                |
| **Transit 1**    | Buffer Node.js      | **AdonisJS API**   | `response.send(blobData)`               |
| **Transit 2**    | Flux HTTP (Stream)  | **Réseau**         | Transfert par paquets vers MAUI         |
| **Localisation** | Fichier .epub local | **MAUI (Android)** | `WriteAllBytes` dans le Cache           |
| **Affichage**    | Texte / Images      | **MAUI (UI)**      | Lecture du fichier local par la liseuse |

---

[https://gemini.google.com/app/04377331fdb27f92] (Détails Projet)

---

## Détails Techniques par Composant

### 1. Database (MySQL)

- **Propriété de table** : Utilisation du type `LONGBLOB` pour dépasser la limite de 64 Ko des BLOB standards.
- **Configuration Docker** : Augmenter `max_allowed_packet` à `64M` pour autoriser le transfert de fichiers volumineux.

### 2. Backend (AdonisJS)

- **Accès BLOB** : L'API expose un endpoint Swagger dédié.
- **Détails du livre** : Une route JSON distincte pour afficher les métadonnées (titre, auteur) sans charger le binaire lourd.
- **Transmission** : Le contenu est envoyé en tant que flux binaire avec le type MIME `application/epub+zip`.

### 3. Frontend (MAUI Android)

- **Récupération** : Utilisation de `HttpClient` pour interroger l'API.
- **Fichier Local** : Création d'un fichier `.epub` temporaire dans `FileSystem.CacheDirectory` pour permettre à la liseuse (WebView/EpubReader) de parser le contenu.

### Persistance Temporaire :

Le flux binaire est écrit sur le disque local via File.WriteAllBytesAsync() dans le dossier FileSystem.CacheDirectory.

## Schéma Récapitulatif Principal :
<img width="800" height="356" alt="Official_schema" src="https://github.com/user-attachments/assets/adeef697-1bd4-4c61-9684-6510e38dccc7" />

## Flux de Lecture LONGBLOB : 
<img width="844" height="507" alt="READING_LONGBLOB" src="https://github.com/user-attachments/assets/f7b8629b-f1b8-427e-9e60-79442645fb20" />

---

## 1. Importation epubs
### Initialisation Projet

* **Configuration du schéma :** Définition de la structure de la table via l'outil de migration d'AdonisJS pour réserver un emplacement de stockage binaire haute capacité dédié aux fichiers.
* **Synchronisation logicielle :** Liaison de la propriété de données avec le moteur d'AdonisJS pour permettre la manipulation et la lecture fluide des fichiers par l'application.
* **Initialisation automatique :** Utilisation du seeder intégré pour injecter les fichiers par défaut en base de données afin de rendre le projet immédiatement opérationnel.

### Interface Utilisateur MAUI -> Back-End AdonisJS (Engine)

* **Sélection du fichier :** Utilisation de l'explorateur natif du système via un sélecteur de fichiers pour permettre à l'utilisateur de choisir un ouvrage ePub sur son appareil.
* **Traitement local :** Conversion du fichier sélectionné en flux binaire par l'application pour préparer son transfert vers le serveur.
* **Transmission au Backend :** Envoi sécurisé des données vers l'API via une requête réseau pour confirmer l'importation et le stockage final.
