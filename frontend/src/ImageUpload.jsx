import React, { useState } from 'react';

function ImageUpload() {
  const [tabImages, setTabImages] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  const handleUpload = async(e) => {
    e.preventDefault();
    // envoyer l'image au serveur en png;
    
    // Créer un objet FormData pour envoyer les images individuellement
    const formData = new FormData();
    //ajouter l'id du vendeur
    formData.append('id_vendeur', '1');
    for (let i = 0; i < tabImages.length; i++) {
      formData.append('files', tabImages[i]);
    }
    // Envoyez la requête POST multipart/form-data
  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      console.log(response);
      console.error('Erreur lors du téléchargement de l\'image');
      setResponseMessage('Une erreur s\'est produite lors du téléchargement de l\'image.');
    }
  } catch (error) {
    console.error('Erreur lors du téléchargement de l\'image :', error);
    setResponseMessage('Une erreur s\'est produite lors du téléchargement de l\'image.');
  }
  };

  return (
    <div>
      <input
        type="file"
        accept='image/*'
        multiple={true}
        onChange={(e) => 
          //parcourir le tableau des fichiers
          setTabImages(e.target.files)
        }
      />
      <button onClick={handleUpload}>Upload</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default ImageUpload;
