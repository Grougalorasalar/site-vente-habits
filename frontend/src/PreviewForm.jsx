import React, { useEffect, useState } from 'react';
import CardForm from './CardForm';
import InfoForm from './InfoForm';

const PreviewForm = () => {
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        gender: 'Homme',
        couleur: 'Blanc',
        marque: 'Nike',
        taille_xs: '0',
        taille_s: '0',
        taille_m: '0',
        taille_l: '0',
        taille_xl: '0',
        urlImages: ["https://www.elbuscon.es/static/img/no-preview.jpg", "https://www.elbuscon.es/static/img/no-preview.jpg", "https://www.elbuscon.es/static/img/no-preview.jpg"],
        nomArticle: '',
        prix: '',
        description: '',
        typeArticle: 't-shirt',
        images: undefined,
    });

    const [responseMessagePublish, setResponseMessagePublish] = useState('');

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

    const handleSubmit = () => {

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
            "nom_article": formData.nomArticle,
            "prix_article": formData.prix,
            "description_article": formData.description,
            "id_vendeur": 1,
            "tailles": dicTailles,
            "categorie": formData.typeArticle,
            "genre": formData.gender,
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

    const handleEditClick = () => {
        setIsEditing(true);
        // timeout to wait for the DOM to update
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    }

    const handleSaveClick = () => {
        setIsEditing(false);
    };

    const handleCreateArticle = () => {
        //evaluer si le formulaire est valide
        if (formData.nomArticle === '' || formData.prix === '' || formData.description === '' || formData.typeArticle === '') {
            setResponseMessagePublish('Veuillez remplir tous les champs');
            return;
        }
        //evaluer si au moins la variable images est remplie
        if (formData.images === undefined) {
            setResponseMessagePublish('Veuillez ajouter au moins une image');
            return;
        }
        if (formData.taille_xs === '0' && formData.taille_s === '0' && formData.taille_m === '0' && formData.taille_l === '0' && formData.taille_xl === '0') {
            setResponseMessagePublish('Veuillez ajouter au moins une taille');
            return;
        }
        handleSubmit();
        setResponseMessagePublish('Article publié');
        setIsEditing(false);
    };

    const handleChange = (data) => {
        setFormData({ ...formData, ...data });
    };

    const handleInfoChange = async (data) => {
        setFormData({ ...formData, ...data });
    };

    return (
        <div className="flex justify-center">
            {isEditing ? (
                <div className="flex justify-center">
                    <div className="flex justify-evenly mx-20 mt-20">
                        <div className="join join-vertical join-center join-gap-2">
                            <input className="join-item btn" type="radio" name="options" aria-label="Editer"
                                onClick={handleEditClick}
                            />
                            <input className="join-item btn" type="radio" name="options" aria-label="Preview"
                                onClick={handleSaveClick}
                            />
                        </div>
                    </div>
                    <div>
                        <CardForm
                            editing={isEditing}
                            formData={formData}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mx-20 mt-20">
                        <InfoForm
                            formData={formData}
                            onChange={handleInfoChange}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="flex justify-evenly mx-20 mt-20">
                        <div className="join join-vertical join-center join-gap-2">
                            <input className="join-item btn" type="radio" name="options" aria-label="Editer"
                                onClick={handleEditClick}
                            />
                            <input className="join-item btn" type="radio" name="options" aria-label="Preview"
                                onClick={handleSaveClick}
                            />
                        </div>
                    </div>
                    <CardForm
                        editing={isEditing}
                        formData={formData}
                        onChange={handleChange}
                        className="w-1/2"
                    />

                    <div className="flex justify-center">
                        <div className="flex justify-evenly mx-20 mt-20">
                            <div className='pl-12'>
                                <input className="join-item btn" type="radio" name="options" aria-label="Publier"
                                    onClick={handleCreateArticle}
                                />

                            </div>
                            <div className='pl-12'>
                                {responseMessagePublish}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PreviewForm;
