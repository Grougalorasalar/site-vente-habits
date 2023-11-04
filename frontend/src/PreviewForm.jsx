import React, { useState } from 'react';
import CardForm from './CardForm';
import InfoForm from './InfoForm';

const PreviewForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImages, setPreviewImages] = useState(["https://www.elbuscon.es/static/img/no-preview.jpg", "https://img01.ztat.net/article/spp-media-p1/31d7b0153b8443c8bd7d983d43aea688/73605f1fce664a769b5d003e6f289b8e.jpg?imwidth=1800"]);
    const [previewNameArticle, setPreviewNameArticle] = useState('');
    const [previewPrice, setPreviewPrice] = useState('');
    const [previewDescription, setPreviewDescription] = useState('');
    const [previewTypeArticle, setPreviewTypeArticle] = useState('');
    const [previewGender, setPreviewGender] = useState('');
    const [previewBrand, setPreviewBrand] = useState('');
    let key = 0;

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

    const handleChange = (data) => {
        const dataToStateMap = {
            editedImages: setPreviewImages,
            editedName: setPreviewNameArticle,
            editedType: setPreviewTypeArticle,
            editedDescription: setPreviewDescription,
            editedPrice: setPreviewPrice,
            editedGender: setPreviewGender,
            editedBrand: setPreviewBrand,
        };

        for (const key in data) {
            if (key in dataToStateMap) {
                dataToStateMap[key](data[key]);
            }
        }
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
                            <input className="join-item btn" type="radio" name="options" aria-label="Sauvegarder"
                                onClick={handleSaveClick}
                            />
                        </div>
                    </div>
                    <div>
                        <CardForm
                            editing={isEditing}
                            key={key++}
                            images={previewImages}
                            nameArticle={previewNameArticle}
                            price={previewPrice}
                            description={previewDescription}
                            typeArticle={previewTypeArticle}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mx-20 mt-20">
                        <InfoForm />
                    </div>
                </div>
            ) : (
                <div className="flex justify-center">
                    <div className="flex justify-evenly mx-20 mt-20">
                        <div className="join join-vertical join-center join-gap-2">
                            <input className="join-item btn" type="radio" name="options" aria-label="Editer"
                                onClick={handleEditClick}
                            />
                            <input className="join-item btn" type="radio" name="options" aria-label="Sauvegarder"
                                onClick={handleSaveClick}
                            />
                        </div>
                    </div>
                    <CardForm
                        editing={isEditing}
                        key={key++}
                        images={previewImages}
                        nameArticle={previewNameArticle}
                        price={previewPrice}
                        description={previewDescription}
                        typeArticle={previewTypeArticle}
                        onChange={handleChange}
                    />
                    <div className="flex justify-center">
                        <div className="flex justify-evenly mx-20 mt-20">
                            <div className='pl-12'>
                                <input className="join-item btn" type="radio" name="options" aria-label="Publier"
                                    onClick={handleSaveClick}
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
