import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import multer from 'multer';

const app = express();
app.use(express.json());
const port = 3000;
const prisma = new PrismaClient()

const sessiontable = []

// Configuration pour le stockage des fichiers téléchargés
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'images/'); // Répertoire où les fichiers seront stockés
   },
   filename: (req, file, cb) => {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
     cb(null, uniqueSuffix + path.extname(file.originalname));
   },
 });
 
const upload = multer({ storage });

async function createFolder(nameFolder) {
   // Obtenir le chemin du répertoire du module actuel
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   const pathToFolder = path.join(__dirname, 'images', nameFolder);
   console.log(pathToFolder);
   if (!fs.existsSync(pathToFolder)) {
      fs.mkdir(pathToFolder, { recursive: true }, (err) => {
         if (err) {
            console.error('Échec de la création du dossier :', err);
         } else {
            console.log('Le dossier ' + nameFolder + ' a été créé avec succès.');
         }
      });
   } else {
      console.log('Le dossier existe déjà.');
   }
}

async function createArticle(req, res) {
   console.log(req.body)
    // Logique pour créer un article
    const { nom_article, prix_article, description_article, tailles, images, id_vendeur } = req.body;
    try {
       const article = await prisma.article.create({
          data: {
             nom_article: nom_article,
             prix_article: prix_article,
             description_article: description_article,
             id_vendeur: 1,
          },
       });

       const idArticle = article.id;

       // Créer des enregistrements dans la table Image pour les images associées à l'article
         if (images && images.length > 0) {
            //convert idArticle to string
            const idArticleString = idArticle.toString();
            //create folder for images + article id
            createFolder(idArticleString);
         }

       // Créer des enregistrements dans la table ArticleTaille
       if (tailles && tailles.length > 0) {
          for (const taille of tailles) {
             await prisma.Taille.create({
                data: {
                   id_article: idArticle,
                   taille: taille.taille,
                   stock: taille.stock,
                },
             });
          }
       }

       res.status(200).json({ message: 'Article créé avec id ' + idArticle });
    } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Erreur' });
    }
}

async function auth(req, res) {
    // Logique pour authentifier un utilisateur
    const { email, password } = req.body;
    try {
       const user = await prisma.Utilisateur.findUnique({
            where: {
               email: email,
            },
         });
       if (user && user.password === password) {

         //génération d'un jeton de session
         const sessionID = jwt.sign({ userId: user.id_client }, 'buisson', { expiresIn: '1h' });
         sessiontable.push(sessionID);

         res.status(200).json({ message: 'Authentification réussie', sessionID: sessionID });
       } else {
          res.status(401).json({ message: 'Authentification échouée' });
       }
    } catch (error) {
       res.status(500).json({ message: 'Erreur' });
    }
}

function verifyJetons(req, res) {
   console.log(req.body)
   const sessionID = req.body.sessionID;
   if (!sessiontable.includes(sessionID)) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
   } else {
      jwt.verify(sessionID, 'buisson', (err, decoded) => {
         if (err) {
            res.status(401).json({ message: 'Authentification requise' });
            return;
         }
      });

      return true;
   }
}

async function createUser(req, res) {
   // Logique pour créer un utilisateur
   const { pseudo, nom, prenom, password, email, adresse, telephone } = req.body;

   // Vérifier que l'utilisateur n'existe pas déjà
   const user = await prisma.Utilisateur.findUnique({
      where: {
         email: email,
      },
   });

   if (user) {
      res.status(401).json({ message: 'Utilisateur déjà existant' });
      return;
   }

   try {
      const user = await prisma.Utilisateur.create({
         data: {
            pseudo: pseudo,
            nom: prenom,
            prenom: prenom,
            password: password,
            email: email,
            adresse: adresse,
            telephone: telephone
         },
      });

      const idUser = user.id_client;

      res.status(200).json({ message: 'Utilisateur créé avec id ' + idUser });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur' });
   }
}

app.get('/', (req, res) => {
    res.send('Hello World, from express');
 });

app.post('/api/auth', (req, res) => {
      auth(req, res);
} );

app.post('/api/createArticle', upload.single('file'), (req, res) => {  
   if (req.file) {
      // Le fichier a été téléchargé avec succès
      res.json({
        message: 'Fichier téléchargé avec succès',
        originalname: req.file.originalname,
        filename: req.file.filename,
      });
    } else {
      // Aucun fichier n'a été téléchargé
      res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
    }
} );

app.post('/api/createUser', async (req, res) => {
   if(verifyJetons(req, res)) {
      createUser(req, res);
   }
} );

app.listen(port, function () {
    console.log("Server listening on port " + port)
})