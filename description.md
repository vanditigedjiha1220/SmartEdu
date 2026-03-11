Tu es un expert en développement web moderne et en intégration d’intelligence artificielle.  
Je veux que tu m’aides à construire une application complète appelée **smartedu**, développée en **React JS** avec **Firebase** (Authentication, Firestore, Storage, Cloud Functions).

🎯 Objectif :
Créer une plateforme web de **suivi intelligent des élèves** dans un établissement scolaire.  
Elle doit permettre un contrôle automatisé de la présence, une communication entre parents, enseignants et surveillants, ainsi qu’une analyse du comportement des enseignants via un module IA.

---

## 🏗️ Technologies à utiliser :
- React JS (Frontend)
- Firebase (Backend-as-a-Service)
  - Authentication (login multi-rôles)
  - Firestore (base de données temps réel)
  - Firebase Storage (stockage d’images)
  - Cloud Functions (traitement IA / automatisations)
- Tailwind CSS (interface moderne)
- react-router-dom (navigation)
- react-webcam (accès à la caméra)

---

## 👥 Types d’utilisateurs :
1. **Parent**
   - Peut se connecter avec son compte.
   - Reçoit des **notifications d’absence** de son enfant.
   - Peut consulter les **notes**, **absences**, **bilan hebdomadaire**.
   - Peut contacter le **surveillant** en cas d’anomalie.

2. **Enseignant**
   - Se connecte à son espace via login Firebase.
   - Lance l’appel de présence via la **caméra**.
   - Le système scanne les visages des élèves :
     - Si un élève est reconnu → marqué présent.
     - Si non reconnu → l’enseignant peut cocher manuellement, et une **alerte** est envoyée au **surveillant**.
   - Peut aussi activer un mode **Coach IA** :
     - Le système écoute les mots utilisés en classe.
     - Identifie les **mots motivants** ou **frustrants**.
     - Envoie un **rapport automatique** au surveillant.

3. **Surveillant**
   - Reçoit les **alertes de présence manuelle**.
   - Accède à un **bilan hebdomadaire** des absences par classe.
   - Consulte les **rapports IA** sur les enseignants (motivation, frustration, comportement).
   - Peut envoyer un feedback ou une note à l’enseignant.

---

## 📱 Fonctionnalités principales :
- Page d’accueil avec image/logo du lycée.
- Interface de connexion séparée par rôle (Parent / Enseignant / Surveillant).
- Gestion des rôles et sessions via Firebase Authentication.
- Page “Appel de présence” avec caméra intégrée (`react-webcam`).
- Reconnaissance faciale simplifiée (via comparaison d’images stockées dans Firebase Storage).
- Envoi de notifications automatiques aux parents (Firestore + Cloud Functions).
- Tableau de bord interactif :
  - Absences, notes, statistiques.
  - Alertes en temps réel.
- Section IA (Coach enseignant) :
  - Analyse des mots en direct (mots clés positifs / négatifs).
  - Envoi de score mensuel aux surveillants.
- Design responsive, clair, avec Tailwind CSS.
- Gestion centralisée des données dans Firestore.

---

## ⚙️ Étapes attendues du projet :
1. Initialisation du projet React avec Tailwind.
2. Connexion à Firebase.
3. Création des composants :
   - Login (auth multi-rôles)
   - Dashboard parent
   - Dashboard enseignant
   - Dashboard surveillant
   - Composant caméra (appel)
   - Composant IA (coach vocal)
4. Intégration de Firestore et Cloud Functions.
5. Gestion des notifications automatiques (absence, comportement, bilans).
6. Déploiement final sur Firebase Hosting.

---

💡 Donne-moi :
- La structure complète du code React.
- Le fichier `firebaseConfig.js` prêt à l’emploi.
- La configuration de `App.jsx` avec React Router.
- Un exemple de composant `CameraAttendance.jsx` utilisant `react-webcam`.
- Un exemple de composant `TeacherCoach.jsx` avec détection de mots (motivant / frustrant).
- Les fonctions Firebase nécessaires (en pseudo-code si besoin).

Le projet doit être **modulaire, bien organisé, et facile à étendre**.

---

Nom du projet : **SchoolTrack**  
But : **IA pour un impact local dans l’éducation** 🎓
