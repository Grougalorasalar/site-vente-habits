import React, { useState } from 'react';
import ImageUpload from './ImageUpload';

const ArticleForm = () => {

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
    categorie: 'T-shirt',
    genre: 'Homme',
    couleur: 'Blanc',
    marque: 'Nike',
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

    // ajouter toutes les tailles dans un dictionnaire
    const dicTailles = {
      "XS": formData.taille_xs,
      "S": formData.taille_s,
      "M": formData.taille_m,
      "L": formData.taille_l,
      "XL": formData.taille_xl,
    };


    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "nom_article": formData.nom_article,
      "prix_article": formData.prix_article,
      "description_article": formData.description_article,
      "id_vendeur": 1,
      "tailles": dicTailles,
      "categorie": formData.categorie,
      "genre": formData.genre,
      "couleur": formData.couleur,
      "marque": formData.marque,
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    try {
      fetch('/api/articles', requestOptions)
        .then(response => response.json())
        .then((data) => {
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
    <div className="flex flex-col items-center min-h-screen">
      <form className="w-full max-w-2xl rounded-lg p-6 shadow-lg" onSubmit={handleSubmit}>

        <h1 className="text-3xl font-semibold text-gray-700 mb-4">Créer un article</h1>
        <p className="mb-4 text-gray-500">Remplissez le formulaire ci-dessous pour créer un article.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section à gauche */}
          <div className="col-span-1">
            <div className="mb-6">
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-bold text-gray-700 text-sm">Nom de l'article</label>
                <input
                  type="text"
                  name="nom_article"
                  onChange={handleChange}
                  value={formData.nom_article}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Prix de l'article</label>
                <input
                  type="number"
                  name="prix_article"
                  onChange={handleChange}
                  value={formData.prix_article}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Description de l'article</label>
                <textarea
                  name="description_article"
                  onChange={handleChange}
                  value={formData.description_article}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Images de l'article</label>
                <ImageUpload onImageUpload={handleImageUpload} />
              </div>
            </div>
          </div>

          {/* Section au milieu */}
          <div className="col-span-1">
            <div className="mb-6">
              <label className="mb-2 font-bold text-gray-700 text-sm">Catégorie</label>
              <select
                name="categorie"
                value={formData.categorie}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              >
                <option value="T-shirt">T-shirt</option>
                <option value="Pantalon">Pantalon</option>
                <option value="Chaussures">Chaussures</option>
                <option value="Veste">Veste</option>
                <option value="Sweat">Sweat</option>
                <option value="Chemise">Chemise</option>
                <option value="Blazer">Blazer</option>
              </select>

              <label className="mb-2 font-bold text-gray-700 text-sm">Catégorie</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              >
                <option value="Homme">Homme</option>
                <option value="Femme">Femme</option>
                <option value="Enfant">Enfant</option>
                <option value="Unisexe">Unisexe</option>
              </select>

              <label className="mb-2 font-bold text-gray-700 text-sm">Couleur</label>
              <select
                name="couleur"
                value={formData.couleur}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              >
                <option value="Blanc">Blanc</option>
                <option value="Noir">Noir</option>
                <option value="Gris">Gris</option>
                <option value="Bleu">Bleu</option>
                <option value="Vert">Vert</option>
                <option value="Jaune">Jaune</option>
                <option value="Orange">Orange</option>
                <option value="Rouge">Rouge</option>
                <option value="Rose">Rose</option>
                <option value="Violet">Violet</option>
                <option value="Marron">Marron</option>
              </select>
              <label className="mb-2 font-bold text-gray-700 text-sm">Marque</label>
              <select
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              >
                <option value="Nike">Nike</option>
                <option value="Project X Paris">Project X Paris</option>
                <option value="Ralph Lauren">Ralph Lauren</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
                <option value="Reebok">Reebok</option>
                <option value="New Balance">New Balance</option>
                <option value="Asics">Asics</option>
                <option value="Vans">Vans</option>
                <option value="Converse">Converse</option>
                <option value="Fila">Fila</option>
                <option value="Jordan">Jordan</option>
                <option value="Timberland">Timberland</option>
                <option value="Dr. Martens">Dr. Martens</option>
                <option value="Le Coq Sportif">Le Coq Sportif</option>
                <option value="Skechers">Skechers</option>
                <option value="Saucony">Saucony</option>
                <option value="DC Shoes">DC Shoes</option>
                <option value="Lacoste">Lacoste</option>
                <option value="Salomon">Salomon</option>
                <option value="Columbia">Columbia</option>
                <option value="The North Face">The North Face</option>
                <option value="Under Armour">Under Armour</option>
                <option value="Guess">Guess</option>
                <option value="Tommy Hilfiger">Tommy Hilfiger</option>
                <option value="Diesel">Diesel</option>
                <option value="Calvin Klein">Calvin Klein</option>
                <option value="Ralph Lauren">Ralph Lauren</option>
              </select>
            </div>
          </div>

          {/* Section à droite */}
          <div className="col-span-1">
            <div className="mb-6">
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-bold text-gray-700 text-sm">Taille XS</label>
                <input
                  type="number"
                  name="taille_xs"
                  onChange={handleChange}
                  value={formData.taille_xs}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Taille S</label>
                <input
                  type="number"
                  name="taille_s"
                  onChange={handleChange}
                  value={formData.taille_s}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Taille M</label>
                <input
                  type="number"
                  name="taille_m"
                  onChange={handleChange}
                  value={formData.taille_m}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Taille L</label>
                <input
                  type="number"
                  name="taille_l"
                  onChange={handleChange}
                  value={formData.taille_l}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />

                <label className="mb-2 font-bold text-gray-700 text-sm">Taille XL</label>
                <input
                  type="number"
                  name="taille_xl"
                  onChange={handleChange}
                  value={formData.taille_xl}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Créer l'article
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;