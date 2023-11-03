import React, { useState } from 'react';

function ImageForm() {
    const [numColors, setNumColors] = useState(1);
    const [colorImages, setColorImages] = useState(Array(numColors).fill(null));

    const handleNumColorsChange = (e) => {
        const newNumColors = parseInt(e.target.value, 10);
        setNumColors(newNumColors);
        setColorImages(Array(newNumColors).fill(null));
    };

    const handleImageChange = (e, colorIndex) => {
        const files = e.target.files;
        const updatedImages = [...colorImages];

        if (files.length > 0) {
            updatedImages[colorIndex] = files[0];
        }

        setColorImages(updatedImages);
    };

    return (
        <div>
            <h1>Formulaire d'images</h1>
            <label>
                Nombre de couleurs :
                <input
                    type="number"
                    value={numColors}
                    onChange={handleNumColorsChange}
                    min="1"
                />
            </label>

            <div>
                {Array.from({ length: numColors }, (_, index) => (
                    <div key={index}>
                        <label>
                            Couleur {index + 1} :
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, index)}
                            />
                        </label>
                    </div>
                ))}
            </div>

            <button onClick={() => console.log(colorImages)}>Envoyer</button>
        </div>
    );
}

export default ImageForm;
