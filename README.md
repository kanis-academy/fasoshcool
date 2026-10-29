# FasoShcool 🇧🇫 — prototype éducatif

FasoShcool est une maquette web responsive en français pour les élèves du collège au Burkina Faso (6e, 5e, 4e et 3e).

## Lancer le site
1. Décompresse `FasoShcool.zip`.
2. Ouvre `index.html` dans un navigateur récent (Chrome sur Android, par exemple).
3. Le formulaire de création de profil s'affiche au démarrage.

## Fonctionnalités présentes
- Création locale de profil : nom, prénom, e-mail, téléphone facultatif, âge et classe.
- Tableau de bord responsive.
- Cours de démonstration classés par niveau et matière.
- Quiz à choix multiples avec correction et score.
- Progression locale, paramètres de profil, thème sombre et préférences.
- Effacement des données locales.

## Important : ce n'est pas encore un service de comptes en ligne
Cette version est un prototype front-end. Le profil et les résultats sont enregistrés uniquement dans le stockage local du navigateur, sur l'appareil. Ce n'est pas une vraie authentification, les données ne sont pas synchronisées et l'espace administrateur sécurisé n'est pas encore connecté. Ne l'utilise pas pour collecter de vraies données d'élèves en production.

## Étapes suivantes pour une mise en ligne réelle
1. Héberger les fichiers (GitHub Pages ou un hébergeur statique).
2. Configurer Firebase Authentication et Firestore avec des règles de sécurité adaptées.
3. Créer un rôle administrateur protégé côté serveur et un panneau pour gérer cours, chapitres et quiz.
4. Vérifier les cours avec le programme scolaire officiel burkinabè avant publication.
5. Prévoir la confidentialité des mineurs : collecte minimale, information claire et mesures de protection.

Les images d'illustration sont réalisées avec des formes CSS et des emojis ; la police Google peut nécessiter Internet.
