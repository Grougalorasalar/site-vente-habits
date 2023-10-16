import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const app = express();
app.use(express.json());
const port = 3000;
const prisma = new PrismaClient()

const sessiontable = []

async function createArticle(req, res) {
    // Logique pour créer un article
    const { nom_article, prix_article, description_article, tailles, images, id_vendeur } = req.body;
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

       // Créer des enregistrements dans la table Image pour les images associées à l'article

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
    console.log(email, password);
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

app.get('/', (req, res) => {
    res.send('Hello World, from express');
 });

app.post('/api/auth', (req, res) => {
      auth(req, res);
} );

app.post('/api', async (req, res) => {
    const { action } = req.body;

    // Vérifier que l'utilisateur est authentifié
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
      }
    switch (action) {
    
    case 'CreateArticle':
        createArticle(req, res);
        break;
        
       default:
          res.status(400).json({ message: 'Action non reconnue' });
    }
 });

app.listen(port, function () {
    console.log("Server listening on port " + port)
})