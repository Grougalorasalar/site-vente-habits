import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const CreateArticleForm = () => {

  const [formData, setFormData] = useState({
    nom_article: '',
    prix_article: 0,
    description_article: '',
    id_vendeur: 1,
    images: [],
    taille_xs: '0',
    taille_s: '0',
    taille_m: '0',
    taille_l: '0',
    taille_xl: '0',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (tabImages) => {
    setFormData({ ...formData, images: tabImages });
  };

  function sendSmallImage(image, id_article) {
    // Lancer la lecture du fichier
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(image);
  
    // Récupérer l'extension du fichier
    const extension = image.name.split('.').pop();
    fileReader.onload = async () => {
      const arrayBuffer = fileReader.result;
      const bytes = new Uint8Array(arrayBuffer);
  
      // Convertir Uint8Array en un tableau JavaScript
      const uint8ArrayJS = Array.from(bytes);
  
      // Convertir le tableau JavaScript en une chaîne JSON
      const json = JSON.stringify(uint8ArrayJS);
  
      // Envoyer les données au serveur
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "data": json,
          "extension": extension,
          "size": "small",
          "id_entreprise": 1,
          "id_user": 1,
          "id_article": id_article
        }),
      });
    }
  }

  function sendLargeImage(image, chunkSize, id_article) {
    const totalChunks = Math.ceil(image.size / chunkSize);
    let currentChunk = 1;
    let offset = 0;
  
    function sendChunk() {
      const fileReader = new FileReader();
      const blob = image.slice(offset, offset + chunkSize);
      offset += chunkSize;
  
      fileReader.onload = async () => {
        const arrayBuffer = fileReader.result;
        const bytes = new Uint8Array(arrayBuffer);
        const uint8ArrayJS = Array.from(bytes);
        const json = JSON.stringify(uint8ArrayJS);
  
        const response = await fetch('/api/images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            "data": json,
            "chunk": currentChunk,
            "totalChunks": totalChunks,
            "extension": image.name.split('.').pop(),
            "size": "big",
            "id_entreprise": 1,
            "id_user": 1,
            "id_article": id_article
          }),
        });
  
        currentChunk++;
  
        if (currentChunk <= totalChunks) {
          sendChunk(); // Envoyer le chunk suivant
        }
      };
  
      fileReader.readAsArrayBuffer(blob);
    }
  
    sendChunk();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("nom_article", formData.nom_article);
    formdata.append("prix_article", formData.prix_article);
    formdata.append("description_article", formData.description_article);
    formdata.append("id_vendeur", formData.id_vendeur);

    // ajouter toutes les tailles dans un dictionnaire
    const dicTailles = {
      "XS": formData.taille_xs,
      "S": formData.taille_s,
      "M": formData.taille_m,
      "L": formData.taille_l,
      "XL": formData.taille_xl,
    };

    // ajouter le tableau des tailles au FormData
    formdata.append("tailles", JSON.stringify(dicTailles));

    var requestOptions = { 
      method: 'POST',
      body: formdata
    };

    try {
      fetch('/api/articles', requestOptions)
        .then(response => response.json())
        .then((data) => {
          console.log(data.article);
          //crer les images
          const id_article = data.article.id_article;
          const images = formData.images;
          const tabImages = Array.from(images);
          const chunkSize = 5000000;
          tabImages.forEach((image) => {
            if (image.size < chunkSize) {
              sendSmallImage(image, id_article);
            } else {
              sendLargeImage(image, id_article);
            }
          });
        })
        .catch(error => console.log('error', error));
      
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-3xl font-semibold text-gray-700">Créer un article</h1>
    <p className="mb-4 text-gray-500">Remplissez le formulaire ci-dessous pour créer un article.</p>
    <form encType="multipart/form-data" className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="nom_article" className="block text-gray-600">Nom de l'article:</label>
        <input
          type="text"
          id="nom_article"
          name="nom_article"
          value={formData.nom_article}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="prix_article" className="block text-gray-600">Prix de l'article:</label>
        <input
          type="number"
          step="0.01"
          id="prix_article"
          name="prix_article"
          value={formData.prix_article}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description_article" className="block text-gray-600">Description de l'article:</label>
        <textarea
          id="description_article"
          name="description_article"
          value={formData.description_article}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />
      </div>
      <div className="mb-4">
        <ImageUpload onImageUpload={handleImageUpload} />
      </div>
  <div className="m-2">
  <h2 className="text-xl font-bold mb-2">Stock</h2>
  <div className="grid grid-cols-3 gap-4 w-full">
  <div className="col-span-1">
    <label className='block text-gray-600'>Taille XS</label>
    <input
      type="number"
      name="taille_xs"
      value={formData.taille_xs}
      onChange={handleChange}
      required
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  </div>
  <div className="col-span-1">
    <label className='block text-gray-600'>Taille S</label>
    <input
      type="number"
      name="taille_s"
      value={formData.taille_s}
      onChange={handleChange}
      required
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  </div>
  <div className="col-span-1">
    <label className='block text-gray-600'>Taille M</label>
    <input
      type="number"
      name="taille_m"
      value={formData.taille_m}
      onChange={handleChange}
      required
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  </div>
  <div className="col-span-1">
    <label className='block text-gray-600'>Taille L</label>
    <input
      type="number"
      name="taille_l"
      value={formData.taille_l}
      onChange={handleChange}
      required
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  </div>
  <div className="col-span-1">
    <label className='block text-gray-600'>Taille XL</label>
    <input
      type="number"
      name="taille_xl"
      value={formData.taille_xl}
      onChange={handleChange}
      required
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
    />
  </div>
  </div>
</div>

          
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400">
        Créer l'article
      </button>
    </form>
    </div>
  );
};

export default CreateArticleForm;
