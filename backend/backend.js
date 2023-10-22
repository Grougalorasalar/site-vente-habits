import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import e from 'express';

const app = express();
//autoriser l'envoie de fichiers supérieurs à 1Mo
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const port = 3000;
const prisma = new PrismaClient()

// Configuration pour le stockage des fichiers téléchargés
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
     cb(null, 'temp/'); // Répertoire où les fichiers seront stockés
   },
   filename: (req, file, cb) => {
     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
     cb(null, uniqueSuffix + path.extname(file.originalname));
   },
});
 
const upload = multer({ storage });

const sessiontable = []

async function createFolder(nameFolder) {
   // Obtenir le chemin du répertoire du module actuel
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   const pathToFolder = path.join(__dirname, nameFolder);
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
    // Logique pour créer un article
    const { nom_article, prix_article, description_article, tailles, id_vendeur } = req.body;
    // convert prix_article to float
    const prix_article_float = parseFloat(prix_article);
    // convert id_vendeur to int
    const id_vendeur_int = parseInt(id_vendeur);

    // créer un article dans la table Article
    try {
      const article = await prisma.article.create({
         data: {
            nom_article: nom_article,
            prix_article: prix_article_float,
            description_article: description_article,
            id_vendeur: id_vendeur_int,
         },
      });

      // Récupérer l'id de l'article créé
      const idArticle = article.id;

      // Convertir tailles en dictionnaire
      const dictTaille = JSON.parse(tailles);

      // Créer des enregistrements dans la table Taille en parcourant le dict tailles_dict avec comme clé la taille (XS, S, M, L, XL) et comme valeur la quantité
      for (const [key, value] of Object.entries(dictTaille)) {
         const taille = await prisma.taille.create({
            data: {
               id_article: idArticle,
               taille: key,
               stock: parseInt(value),
            },
         });
      }

      // faire un dictionnaire avec toutes les informations de l'article
      const article_dict = {
         id_article: idArticle,
         nom_article: nom_article,
         prix_article: prix_article_float,
         description_article: description_article,
         id_vendeur: id_vendeur_int,
         tailles: dictTaille,
      };

      res.status(200).json({ message: 'Article créé ', article: article_dict });
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

async function saveImages(size, body, res) {
   //si l'image est petite
   const small = false;
   if(size === "small") {
      const small = true;
      const { data, extension, id_user, id_entreprise, id_article } = body;
      // créer un dossier pour l'entreprise s'il n'existe pas
      createFolder("images/" + id_entreprise);
      
      // créer un dossier pour l'utilisateur s'il n'existe pas
      createFolder("images/" + id_entreprise + "/" + id_user);

      //créer un dossier pour l'article s'il n'existe pas
      createFolder("images/" + id_entreprise + "/" + id_user + "/" + id_article);

      // Revenir en arrière : convertir la chaîne JSON en tableau JavaScript
      const uint8ArrayJS2 = JSON.parse(data);

      // Reconvertir le tableau JavaScript en Uint8Array
      const uint8Array2 = new Uint8Array(uint8ArrayJS2);

      // Reconvertir l'Uint8Array en Buffer
      const buffer2 = Buffer.from(uint8Array2);

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);

      //generate random file name
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

      // Écrire l'image dans un fichier
      fs.writeFileSync(path.join(__dirname, 'images/' + id_entreprise + "/" + id_user + "/" + id_article + "/" + uniqueSuffix + "." + extension), buffer2);

      try {
         const user = await prisma.Image.create({
            data: {
               articleId: id_article,
               url: "images/" + id_entreprise + "/" + id_user + "/" + id_article + "/" + uniqueSuffix + "." + extension,
            },
         });
         console.log("Image enregistrée dans la base de données");
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Erreur' });
      }

   } else if(size === "big") {
      const { data, chunk, totalChunks, extension, id_user, id_entreprise, id_article } = body;

      const tempFileName = "temp/" + id_user + "." + extension;

      // Convertissez le chunk JSON en Uint8Array
      const uint8Array = new Uint8Array(JSON.parse(data));
    
      // Ajoutez le chunk au fichier en cours de création
      fs.writeFileSync(tempFileName, uint8Array, { flag: 'a' });
    
      if (chunk === totalChunks) {
         // créer un dossier pour l'entreprise s'il n'existe pas
         createFolder("images/" + id_entreprise);

         // créer un dossier pour l'utilisateur s'il n'existe pas
         createFolder("images/" + id_entreprise + "/" + id_user);

         // créer un dossier pour l'article s'il n'existe pas
         createFolder("images/" + id_entreprise + "/" + id_user + "/" + id_article);

         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
         //renommer le fichier
         fs.renameSync(fileName, "images/" + id_entreprise + "/" + id_user + "/" + id_article + "/" + uniqueSuffix + "." + extension);

        try {
            const user = await prisma.Image.create({
               data: {
                  articleId: id_article,
                  url: "images/" + id_entreprise + "/" + id_user + "/" + id_article + "/" + uniqueSuffix + "." + extension,
               },
            });
            console.log("Image enregistrée dans la base de données");
         } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur' });
         }
      } else {
        // Il reste encore des chunks à recevoir
        res.json({ message: 'Chunk reçu' });
      }
   }
}

app.get('/', (req, res) => {
    res.send('Hello World, from express');
 });

// s'authentifier
app.post('/api/auth', (req, res) => {
   auth(req, res);
} );

// créer un article
app.post('/api/articles', upload.array('images', 3), (req, res) => {  
   createArticle(req, res);
} );

// créer un utilisateur
app.post('/api/users', async (req, res) => {
   if(verifyJetons(req, res)) {
      createUser(req, res);
   }
} );

app.post('/api/images', async (req, res) => {
   saveImages(req.body.size, req.body, res);
 });


app.listen(port, function () {
    console.log("Server listening on port " + port)
})