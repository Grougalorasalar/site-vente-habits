import React, { useState } from 'react';

const CreateArticleForm = () => {
  const [formData, setFormData] = useState({
    nom_article: '',
    prix_article: '',
    description_article: '',
    id_vendeur: '',
    image: '',
    taille_xs: '',
    taille_s: '',
    taille_m: '',
    taille_l: '',
    taille_xl: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("nom_article", formData.nom_article);
    formdata.append("prix_article", formData.prix_article);
    formdata.append("description_article", formData.description_article);
    formdata.append("id_vendeur", formData.id_vendeur);
    formdata.append("taille_xs", formData.taille_xs);
    formdata.append("taille_s", formData.taille_s);
    formdata.append("taille_m", formData.taille_m);
    formdata.append("taille_l", formData.taille_l);
    formdata.append("taille_xl", formData.taille_xl);
    formdata.append("image", formData.image);

    var requestOptions = { 
      method: 'POST',
      body: formdata
    };

    try {
      fetch('/api/createArticle', requestOptions)
        .then(response => response.json())
        .then((data) => 
          console.log(data)
        )
        .catch(error => console.log('error', error));
      
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="text-3xl font-semibold text-gray-700">Créer un article</h1>
    <p className="mb-4 text-gray-500">Remplissez le formulaire ci-dessous pour créer un article.</p>
    <form enctype="multipart/form-data" className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md" onSubmit={handleSubmit}>
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
        <label htmlFor="image" className="block text-gray-600">Image de l'article:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-400"
        />
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
