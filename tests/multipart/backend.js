const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
const port = 3000;

// enable cors
const cors = require('cors');
app.use(cors());

function createFolder(nameFolder) {
  const path = require('path');
  const currentDirectory = __dirname;
  const fs = require('fs');
  const pathToFolder = path.join(currentDirectory, 'uploads', nameFolder);
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

// Configuration de Multer pour la gestion des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //create folder with req.body.id_vendeur if not exist
    createFolder(req.body.id_vendeur);
    cb(null, './uploads/' + req.body.id_vendeur); // Répertoire où les fichiers seront stockés
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

app.post('/api/articles', (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
  console.log(`Le serveur est en écoute sur le port ${port}`);
});
