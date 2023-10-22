import React, { useState } from 'react';

function ImageUpload({ onImageUpload }) {
  const [tabImages, setTabImages] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');
  const [responseClassname, setResponseClassname] = useState('text-red-500 mt-2');
  const [buttonClassName, setButtonClassName] = useState('bg-blue-500 text-white px-4 py-2 rounded font-medium');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (tabImages.length === 0) {
      setResponseMessage('Sélectionnez au moins une image.');
      setButtonClassName('bg-red-500 text-white px-4 py-2 rounded font-medium');
      return;
    }

    // Envoyez l'image au parent (CreateArticleForm)
    onImageUpload(tabImages);
    setResponseClassname('text-green-500 mt-2');
    // mettre à jour le className du bouton
    setButtonClassName('bg-green-500 text-white px-4 py-2 rounded font-medium');
    if(tabImages > 1) {
      setResponseMessage(`${tabImages.length} images téléchargées.`);
    } else {
      setResponseMessage(`${tabImages.length} image téléchargée.`);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple={true}
          onChange={(e) => setTabImages(e.target.files)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex items-center justify-center mb-4 px-2 py-3">
      <button
        onClick={handleUpload}
        className={buttonClassName}
      >
        Upload Images
      </button>
      <div className="flex items-center justify-center px-2 py-3">
      {responseMessage && (
        <p className={responseClassname}>{responseMessage}</p>
      )}
      </div>
      </div>
    </div>
  );
}

export default ImageUpload;
