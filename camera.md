 rules_version = '2';
 service firebase.storage {
   match /b/{bucket}/o {
       // Autorise un utilisateur connecté à uploader des audios dans son propre dossier
        match /coach-audio/{userId}/{fileName} {
          allow write: if request.auth != null && request.auth.uid == userId;
        }
     }
   }