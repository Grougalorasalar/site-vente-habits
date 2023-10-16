import { PrismaClient } from '@prisma/client';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const app = express();
app.use(express.json());
const port = 3000;


const prisma = new PrismaClient()

const exampleArticle = {
   "nom_article": "Nom de l'article",
   "prix_article": 19.99,
   "description_article": "Description de l'article",
   "tailles": [
     { "taille": "XS", "stock": 10 },
     { "taille": "S", "stock": 15 },
     { "taille": "M", "stock": 20 },
     { "taille": "L", "stock": 25 },
     { "taille": "XL", "stock": 30 }
   ],
   "id_vendeur": 1
 }
 

//dict taille -> id
const dictTaille = {
   "XS": 1,
   "S": 2,
   "M": 3,
   "L": 4,
   "XL": 5
}

// Créer un dossier dans le dossier images
function createFolder(nameFolder) {
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

app.get('/', (req, res) => {
   res.send('Hello World, from express');
});

app.post('/api/createArticle', async (req, res) => {
   const { nom_article, prix_article, description_article, tailles, images, id_vendeur } = req.body;
   console.log(req.body);
   try {
      const article = await prisma.article.create({
         data: {
            nom_article: nom_article,
            prix_article: prix_article,
            description_article: description_article,
            id_vendeur: id_vendeur,
         },
      });

      const idArticle = article.id;

      //generate UID for article
      //const uid = crypto.randomUUID();
      //console.log('UID : ' + uid);

      // Créer un dossier dans le dossier images
      //createFolder(uid);

      // Créer des enregistrements dans la table Image pour les images associées à l'article
      if (images && images.length > 0) {
         for (const image of images) {
            await prisma.image.create({
               data: {
                  url: image.url,  // URL de l'image
                  articleId: idArticle,
               },
            });
         }
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
});

//endpoint pour récupérer tous les articles
app.get('/api/articles', async (req, res) => {
   try {
      const articles = await prisma.article.findMany({
      });
      res.status(200).json(articles);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur' });
   }
});


app.listen(port, function () {
   console.log("Server listening on port " + port)
 })