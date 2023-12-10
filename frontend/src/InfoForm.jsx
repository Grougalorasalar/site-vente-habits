import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import ImageUpload from './ImageUpload';

function InfoForm(props) {

    const [previewData, setPreviewData] = useState({
        gender: props.formData.gender,
        couleur: props.formData.couleur,
        marque: props.formData.marque,
        taille_xs: props.formData.taille_xs,
        taille_s: props.formData.taille_s,
        taille_m: props.formData.taille_m,
        taille_l: props.formData.taille_l,
        taille_xl: props.formData.taille_xl,
        urlImages: props.formData.urlImages,
        images: props.formData.filesImages,
    });

    useEffect(() => {
        props.onChange(previewData);
    }, [previewData]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleChange = (e) => {
        setPreviewData({ ...previewData, [e.target.name]: e.target.value });
        props.onChange(previewData);
    };

    const openModal = () => {
        setIsModalOpen(true);
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const removeImages = async () => {
        setPreviewData({ ...previewData, urlImages: [] });
        const response = await fetch('/api/temp', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id_user": 1,
            }),
        })
    }

    const handleImageUpload = async (uploadImages) => {
        const urlTabImages = [];
        const tabImages = Array.from(uploadImages);
        const chunkSize = 5000000;

        // send small images
        tabImages.forEach((image) => {
            if (image.size < chunkSize) {
                sendSmallImage(image, urlTabImages);
            }
        });

        // send large images
        for (const image of tabImages) {
            if (image.size > chunkSize) {
                await sendLargeImage(image, chunkSize, urlTabImages);
            }
        }

        // wait for all images to be sent
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });

        setPreviewData({ ...previewData, urlImages: urlTabImages, images: tabImages });
        //close modal
        setIsModalOpen(false);
    };

    function sendSmallImage(image, tabImages) {
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
            const response = await fetch('/api/temp', {
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
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // push new image to formData images
                    tabImages.push(data.message);
                });
        }
    }

    function sendLargeImage(image, chunkSize, tabImages) {
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

                const response = await fetch('/api/temp', {
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
                    }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        //add new image to formData images
                        tabImages.push(data.message);
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

    return (
        <div>
            <div className='flex flex-col items-center'>
                <button
                    onClick={openModal}
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded "
                >
                    Ajouter des images
                </button>
                {/* Le composant de la modale */}
                {isModalOpen && (
                    <Modal onClose={closeModal}>
                        {/* Ajoutez le contenu de la modale ici */}
                        <p>Vous pouvez ajouter jusqu'à 3 images.</p>
                        <ImageUpload onImageUpload={handleImageUpload} />
                        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={removeImages}>Supprimer images existantes</button>
                        <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={closeModal}>Fermer la fenêtre</button>
                    </Modal>
                )}
                <div>
                    <h1 className="m-5 text-3xl font-bold">Informations Supplémentaires</h1>
                </div>
                <div className="m-10 grid grid-rows-4 grid-flow-col gap-4">
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL block">Sexe :</label>
                        <select
                            name='gender'
                            value={previewData.gender}
                            onChange={handleChange}
                            className="input w-21 h-5 origin-top input-bordered"
                        >
                            <option value="Homme">Homme</option>
                            <option value="Femme">Femme</option>
                            <option value="Enfant">Enfant</option>
                            <option value="Unisexe">Unisexe</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL block">Taille XS</label>
                        <input
                            type="number"
                            name="taille_xs"
                            onChange={handleChange}
                            value={previewData.taille_xs}
                            required
                            className="border border-black-300 rounded-lg px-2 py-1 mt-1 mb-3 text-xs w-full"
                        />
                    </div>
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL">Taille L</label>
                        <input
                            type="number"
                            name="taille_l"
                            onChange={handleChange}
                            value={previewData.taille_l}
                            required
                            className="border border-black-300 rounded-lg px-2 py-1 mt-1 mb-3 text-xs w-full"
                        />

                    </div>
                    <div>
                    </div>
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL block">Couleur :</label>
                        <select
                            name="couleur"
                            value={previewData.couleur}
                            onChange={handleChange}
                            required
                            className="input w-21 h-5 origin-top input-bordered"
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
                            <option value="Beige">Beige</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL">Taille S</label>
                        <input
                            type="number"
                            name="taille_s"
                            onChange={handleChange}
                            value={previewData.taille_s}
                            required
                            className="border border-black-300 rounded-lg px-2 py-1 mt-1 mb-3 text-xs w-full"
                        />
                    </div>
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL">Taille XL</label>
                        <input
                            type="number"
                            name="taille_xl"
                            onChange={handleChange}
                            value={previewData.taille_xl}
                            required
                            className="border border-black-300 rounded-lg px-2 py-1 mt-1 mb-3 text-xs w-full"
                        />
                    </div>
                    <div>
                    </div>
                    <div><label className="mb-1 font-bold text-black-700 text-xL block">Marque:</label>
                        <select
                            name="marque"
                            value={previewData.marque}
                            onChange={handleChange}
                            required
                            className="input w-21 h-5 origin-top input-bordered"
                        >
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Lacoste</option>
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
                            <option value="IKKS">IKKS</option>
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
                    <div>
                        <label className="mb-1 font-bold text-black-700 text-xL">Taille M</label>
                        <input
                            type="number"
                            name="taille_m"
                            onChange={handleChange}
                            value={previewData.taille_m}
                            required
                            className="border border-black-300 rounded-lg px-2 py-1 mt-1 mb-3 text-xs w-full"
                        />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default InfoForm;
