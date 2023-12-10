import React, { useState, useEffect } from 'react';
import CardForm from './CardForm';
import InfoForm from './InfoForm';

const PreviewForm = () => {
    const [isEditing, setIsEditing] = useState(false);

    let key = 0;

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
        typeArticle: '',
    });

    const handleEditClick = () => {
        //wait props update
        console.log("edit");
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
        console.log("save");
        setIsEditing(false);
    };

    const handleCreateArticle = () => {
        console.log("create");
        console.log(formData);
        setIsEditing(false);
    };

    const handleChange = (data) => {
        formData.nomArticle = data.nomArticle;
        formData.typeArticle = data.typeArticle;
        formData.prix = data.prix;
        formData.description = data.description;
        formData.images = data.images;
    };

    const handleInfoChange = (data) => {
        formData.urlImages = data.urlImages;
        // update tabTailles
        formData.taille_xs = data.taille_xs;
        formData.taille_s = data.taille_s;
        formData.taille_m = data.taille_m;
        formData.taille_l = data.taille_l;
        formData.taille_xl = data.taille_xl;
        formData.couleur = data.couleur;
        formData.marque = data.marque;
        formData.gender = data.gender;
    };

    useEffect(() => {

        setFormData(formData);

    }, [formData]);

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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PreviewForm;
