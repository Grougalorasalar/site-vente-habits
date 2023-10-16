const fs = require('fs');

// Indiquez le chemin de l'image locale sur votre système de fichiers
const imagePath = '/chemin/vers/votre/image.jpg';  // Remplacez par le chemin de votre image

// Tableau d'images avec les chemins des images
const tableauImages = [
  './tests/cat.jpg',         // Ajoutez d'autres chemins d'images ici
];

// Convertir le tableau d'images en base64
const tableauImagesBase64 = [];
for (const image of tableauImages) {
  const data = fs.readFileSync(image, 'base64');
  tableauImagesBase64.push(data);
}

// Parcourir le tableau d'images base64 et les enregistrer dans un dossier images
for (const image of tableauImagesBase64) {
  const dataBuffer = Buffer.from(image, 'base64');
  fs.writeFileSync('./images/' + Date.now() + '.jpg', dataBuffer);
}
