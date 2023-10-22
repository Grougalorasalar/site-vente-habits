import React, { useState } from 'react';

function ImageDownloadComponent() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadImage = async () => {
    setIsDownloading(true);

    // Simulez un téléchargement de morceaux depuis le serveur (remplacez par votre propre logique)
    const response = await fetch('https://qph.cf2.quoracdn.net/main-qimg-af598899e984a1ee6fea13132af47cba-lq')
    const blob = await response.blob();

    // Concaténez les morceaux pour reconstituer l'image
    const reconstructedBlob = new Blob([blob], { type: 'image/jpeg' });
    
    // Créez un objet URL à partir du Blob
    const imageURL = URL.createObjectURL(reconstructedBlob);

    // Utilisez l'API File System Access pour demander à l'utilisateur de sélectionner un emplacement de sauvegarde
    try {
      const fileHandle = await window.showSaveFilePicker();
      const writable = await fileHandle.createWritable();
      await writable.write(reconstructedBlob);
      await writable.close();

      // Le fichier a été sauvegardé avec succès
      setIsDownloading(false);
    } catch (error) {
      // Gérez les erreurs de sauvegarde du fichier
      console.error('Erreur lors de la sauvegarde de l\'image :', error);
      setIsDownloading(false);
    }
  }

  return (
    <div>
      <button onClick={downloadImage}>Télécharger l'image</button>
      {isDownloading ? <p>Téléchargement en cours...</p> : null}
    </div>
  );
}

export default ImageDownloadComponent;
