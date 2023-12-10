import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
//autoriser l'envoie de fichiers supérieurs à 1Mo
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const port = 3000;
const prisma = new PrismaClient();

// const sessiontable = [];

async function createFolder(nameFolder) {
   // Obtenir le chemin du répertoire du module actuel
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   const pathToFolder = path.join(__dirname, nameFolder);
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
   console.log(req.body);

   // body data
   const nom_article = req.body.nom_article;
   var prix_article = req.body.prix_article;
   const description_article = req.body.description_article;
   const tailles = req.body.tailles;
   const id_vendeur = req.body.id_vendeur;
   const marque = req.body.marque;
   const categorie = req.body.categorie;
   const couleur = req.body.couleur;
   const genre = req.body.genre;

   //si le nombre n'est pas à virgule rajouter un .00
   if (prix_article % 1 === 0) {
      prix_article = prix_article + ".00";
   }

   //convertir le prix en float
   const prix_article_float = parseFloat(prix_article);

   // Convertir l'id du vendeur en entier
   const id_vendeur_int = parseInt(id_vendeur);

   // créer un article dans la table Article
   try {
      const article = await prisma.article.create({
         data: {
            nom_article: nom_article,
            prix_article: prix_article_float,
            description_article: description_article,
            id_vendeur: id_vendeur_int,
            marque: marque,
            categorie: categorie,
            couleur: couleur,
            genre: genre,
         },
      });

      // Récupérer l'id de l'article créé
      const idArticle = article.id;

      // Créer des enregistrements dans la table Taille en parcourant le dict tailles_dict avec comme clé la taille (XS, S, M, L, XL) et comme valeur la quantité
      for (const [key, value] of Object.entries(tailles)) {
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
         tailles: tailles,
         marque: marque,
         categorie: categorie,
         couleur: couleur,
         genre: genre,
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
         // sessiontable.push(sessionID);

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
   if (size === "small") {
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
               url: "/api/" + "images/" + id_entreprise + "/" + id_user + "/" + id_article + "/" + uniqueSuffix + "." + extension,
            },
         });
         console.log("Image enregistrée dans la base de données");
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Erreur' });
      }

   } else if (size === "big") {
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

async function createFolder(nameFolder) {
   // Obtenir le chemin du répertoire du module actuel
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   const pathToFolder = path.join(__dirname, nameFolder);
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
   console.log(req.body);

   // body data
   const nom_article = req.body.nom_article;
   var prix_article = req.body.prix_article;
   const description_article = req.body.description_article;
   const tailles = req.body.tailles;
   const id_vendeur = req.body.id_vendeur;
   const marque = req.body.marque;
   const categorie = req.body.categorie;
   const couleur = req.body.couleur;
   const genre = req.body.genre;

   //clear temp folder du vendeur
   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   fs.rmdirSync(path.join(__dirname, 'temp/' + id_vendeur), { recursive: true });

   //si le nombre n'est pas à virgule rajouter un .00
   if (prix_article % 1 === 0) {
      prix_article = prix_article + ".00";
   }

   //convertir le prix en float
   const prix_article_float = parseFloat(prix_article);

   // Convertir l'id du vendeur en entier
   const id_vendeur_int = parseInt(id_vendeur);

   // créer un article dans la table Article
   try {
      const article = await prisma.article.create({
         data: {
            nom_article: nom_article,
            prix_article: prix_article_float,
            description_article: description_article,
            id_vendeur: id_vendeur_int,
            marque: marque,
            categorie: categorie,
            couleur: couleur,
            genre: genre,
         },
      });

      // Récupérer l'id de l'article créé
      const idArticle = article.id;

      // Créer des enregistrements dans la table Taille en parcourant le dict tailles_dict avec comme clé la taille (XS, S, M, L, XL) et comme valeur la quantité
      for (const [key, value] of Object.entries(tailles)) {
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
         tailles: tailles,
         marque: marque,
         categorie: categorie,
         couleur: couleur,
         genre: genre,
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

async function saveImagesTemp(size, body, res) {

   // body data
   const { data, extension, id_user } = body;

   //generate random file name
   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

   // créer un dossier temporaire pour l'utilisateur s'il n'existe pas
   createFolder("temp" + "/" + id_user);

   if (size === "small") {

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
      fs.writeFileSync(path.join(__dirname, 'temp/' + id_user + "/" + uniqueSuffix + "." + extension), buffer2);

      res.status(200).json({ message: '/api/temp/' + id_user + "/" + uniqueSuffix + "." + extension });

   } else if (size === "big") {
      const { data, chunk, totalChunks, extension, id_user } = body;

      const tempFileName = "temp/" + id_user + "/" + uniqueSuffix + "." + extension;

      // Convertissez le chunk JSON en Uint8Array
      const uint8Array = new Uint8Array(JSON.parse(data));

      // Ajoutez le chunk au fichier en cours de création
      fs.writeFileSync(tempFileName, uint8Array, { flag: 'a' });

      if (chunk === totalChunks) {
         res.status(200).json({ message: '/api/temp/' + id_user + "/" + uniqueSuffix + "." + extension });
      } else {
         // Il reste encore des chunks à recevoir
         res.json({ message: 'Chunk reçu' });
      }
   }
}

async function saveImages(size, body, res) {
   //si l'image est petite
   if (size === "small") {
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
               url: "/api/" + "images/" + id_entreprise + "/" + id_user + "/" + id_article + "/" + uniqueSuffix + "." + extension,
            },
         });
         console.log("Image enregistrée dans la base de données");
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Erreur' });
      }

   } else if (size === "big") {
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
});

// récupérer tous les articles
app.get('/api/articles', async (req, res) => {
   const genre = req.query.gender;
   const search = req.query.search;
   const marque = req.query.brand;
   const categorie = req.query.category;
   const couleur = req.query.color;

   let whereCondition = {}; // Condition de recherche par défaut

   // on affiche les articles en fonction du genre, il peut-être homme, femme ou enfant (unisexe)
   if (genre) {
      whereCondition = {
         OR: [
            {
               genre: genre,
            },
            {
               genre: 'Unisexe',
            },
         ],
      };
   }

   if (marque) {
      whereCondition = {
         ...whereCondition,
         marque: marque,
      };
   }

   if (categorie) {
      whereCondition = {
         ...whereCondition,
         categorie: categorie,
      };
   }

   if (couleur) {
      whereCondition = {
         ...whereCondition,
         couleur: couleur,
      }
   }

   if (search) {
      whereCondition = {
         ...whereCondition,
         nom_article: {
            contains: search,
         },
      };
   }

   try {
      const articles = await prisma.article.findMany({
         where: whereCondition,
      });

      res.status(200).json({ articles });
   } catch (error) {
      res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des articles." });
   }
});


// récupérer l'article en fonction de l'id
app.get('/api/articles/:id', async (req, res) => {
   const id = parseInt(req.params.id);

   const article = await prisma.article.findUnique({
      where: {
         id: id,
      },
   });
   res.status(200).json({ article });
});

// récupérer tous les images
app.get('/api/images', async (req, res) => {
   const images = await prisma.image.findMany({

   });
   res.status(200).json({ images: images });
});

// récupérer les images d'un article
app.get('/api/images/:id_article', async (req, res) => {
   const id_article = parseInt(req.params.id_article);

   const images = await prisma.image.findMany({
      where: {
         articleId: id_article,
      },
   });
   res.status(200).json({ images: images });
}
);

//afficher l'image temporaire avec l'id de l'utilisateur et le nom du fichier
app.get('/api/temp/:id_user/:file', async (req, res) => {
   const file = req.params.file;

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);
   res.sendFile(path.join(__dirname, 'temp/' + req.params.id_user + "/" + file));
});

// afficher l'image avec l'id de l'entreprise, l'id de l'utilisateur et l'id de l'article
app.get('/api/images/:id_entreprise/:id_user/:id_article/:file', async (req, res) => {
   const id_article = parseInt(req.params.id_article);
   const file = req.params.file;

   const images = await prisma.image.findMany({
      where: {
         articleId: id_article,
      },
   });
   //verifier que le fichier existe dans le tableau d'images
   var exist = false;
   for (var i = 0; i < images.length; i++) {
      if (images[i].url === "/api/" + "images/" + req.params.id_entreprise + "/" + req.params.id_user + "/" + req.params.id_article + "/" + file) {
         exist = true;
      }
   }
   //renvoyer le fichier si il existe
   if (exist) {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      res.sendFile(path.join(__dirname, 'images/' + req.params.id_entreprise + "/" + req.params.id_user + "/" + req.params.id_article + "/" + file));
   } else {
      res.status(404).json({ message: 'Image non trouvée' });
   }
});

// créer un article
app.post('/api/articles', async (req, res) => {
   createArticle(req, res);
});

//stocker des images temporaires
app.post('/api/temp', async (req, res) => {
   //creer le dossier temporaire s'il n'existe pas
   createFolder("temp");
   saveImagesTemp(req.body.size, req.body, res);
}
);

app.delete('/api/temp', async (req, res) => {
   const id_user = req.body.id_user;

   const __filename = fileURLToPath(import.meta.url);
   const __dirname = path.dirname(__filename);

   //supprimer le dossier temporaire de l'utilisateur
   fs.rmdirSync(path.join(__dirname, 'temp/' + id_user), { recursive: true });

   res.status(200).json({ message: 'Dossier temporaire supprimé' });
});

// créer un utilisateur
app.post('/api/users', async (req, res) => {
   if (verifyJetons(req, res)) {
      createUser(req, res);
   }
});

app.post('/api/images', async (req, res) => {
   saveImages(req.body.size, req.body, res);
});


app.listen(port, function () {
   console.log("Server listening on port " + port)
})