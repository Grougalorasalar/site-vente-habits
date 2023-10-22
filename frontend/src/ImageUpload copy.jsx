import React, { useState } from 'react';

function imageUpload() {
  const [data, setData] = useState('');
  const [tabImages, setTabImages] = useState([]);
  const [responseMessage, setResponseMessage] = useState('');

  function sendSmallImage() {
    // Lancer la lecture du fichier
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(tabImages[0]);
  
    // Récupérer l'extension du fichier
    const extension = tabImages[0].name.split('.').pop();
    fileReader.onload = async () => {
      const arrayBuffer = fileReader.result;
      const bytes = new Uint8Array(arrayBuffer);
  
      // Convertir Uint8Array en un tableau JavaScript
      const uint8ArrayJS = Array.from(bytes);
  
      // Convertir le tableau JavaScript en une chaîne JSON
      const json = JSON.stringify(uint8ArrayJS);
  
      // Envoyer les données au serveur
      const response = await fetch('/api/submit-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          "data": json,
          "extension": extension
        }),
      });
  
      const data = await response.json();
      setResponseMessage(data.message);
    }
  }

  function sendLargeImage(image, chunkSize) {
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
  
        const response = await fetch('/api/submit-chunk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            "data": json,
            "chunk": currentChunk,
            "totalChunks": totalChunks,
            "extension": image.name.split('.').pop(),
          }),
        });
  
        currentChunk++;
  
        if (currentChunk <= totalChunks) {
          sendChunk(); // Envoyer le chunk suivant
        } else {
          const data = await response.json();
          setResponseMessage(data.message);
        }
      };
  
      fileReader.readAsArrayBuffer(blob);
    }
  
    sendChunk();
  }

  const handleSendData = async () => {
    if (tabImages.length > 0) {
      // Si l'image est inférieure à 500 Ko, on l'envoie en une seule fois
      if (tabImages[0].size < 500000) {
        sendSmallImage();
      } else {
        sendLargeImage(tabImages[0], 50000);
      }
    } else {
      setResponseMessage('Aucune image sélectionnée');
      return;
    }
  }

  return (
    <div className="App">
      <h1>Envoyer une donnée</h1>
      <textarea
        value={data}
        onChange={(e) => setData(e.target.value)}
        placeholder="Entrez votre donnée ici"
      />
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple={true}
          onChange={(e) => setTabImages(e.target.files)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button onClick={handleSendData}>Envoyer</button>
      <div id="response-message">{responseMessage}</div>
    </div>
  );
}

export default imageUpload;
