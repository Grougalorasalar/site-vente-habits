const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// enable cors
const cors = require('cors');
app.use(cors());

// Configuration de Multer pour la gestion des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Répertoire où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extname = path.extname(file.originalname);
    cb(null, uniqueSuffix + extname);
  },
});

const upload = multer({ storage });

// Endpoint pour gérer les fichiers téléchargés
app.post('/upload', upload.array('files', 3), (req, res) => {
  try {
    const uploadedFiles = req.files;
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
    }
    const filenames = uploadedFiles.map((file) => file.filename);
    return res.status(201).json({ message: 'Fichiers téléchargés avec succès', filenames });
  } catch (error) {
    console.error('Erreur lors du téléchargement des fichiers : ', error);
    return res.status(500).json({ message: 'Erreur lors du téléchargement des fichiers' });
  }
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
