function createFolder(nameFolder) {
    const path = require('path');
    const currentDirectory = __dirname;
    const fs = require('fs');
    const pathToFolder = path.join(currentDirectory, 'images', nameFolder);
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

createFolder("test");