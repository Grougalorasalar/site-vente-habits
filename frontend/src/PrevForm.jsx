import React, { useState } from 'react';
import CardForm from './CardForm';
import ImageUpload from './ImageUpload';
import ImageForm from './ImageForm';

const PreviewForm = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImages, setPreviewImages] = useState(["https://www.elbuscon.es/static/img/no-preview.jpg", "https://www.elbuscon.es/static/img/no-preview.jpg", "https://www.elbuscon.es/static/img/no-preview.jpg"]);
    const [previewNameArticle, setPreviewNameArticle] = useState('');
    const [previewPrice, setPreviewPrice] = useState('');
    const [previewDescription, setPreviewDescription] = useState('');
    const [previewTypeArticle, setPreviewTypeArticle] = useState('');
    const [previewGender, setPreviewGender] = useState('');
    const [previewBrand, setPreviewBrand] = useState('');
    let key = 0;

    const handleEditClick = () => {
        setIsEditing(true);
    };

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
        <div>
            <div className="flex justify-evenly m-5">
                <div>
                    <input className="join-item btn" type="radio" name="options" aria-label="Editer"
                        onClick={handleEditClick}
                    />
                    <input className="join-item btn" type="radio" name="options" aria-label="Sauvegarder"
                        onClick={handleSaveClick}
                    />
                </div>
                <div>
                    <div className='pl-12'>
                        <input className="join-item btn" type="radio" name="options" aria-label="Publier"
                            onClick={handleSaveClick}
                        />
                    </div>
                </div>
            </div>
            {isEditing ? (
                <div class="flex justify-center">
                    <div>
                        <ImageForm />
                    </div>
                    <div><CardForm
                        editing={isEditing}
                        key={key++}
                        images={previewImages}
                        nameArticle={previewNameArticle}
                        price={previewPrice}
                        description={previewDescription}
                        typeArticle={previewTypeArticle}
                        onChange={handleChange}
                    /></div>
                </div>
            ) : (
                <div class="flex justify-center ...">
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
            )}
        </div>
    );
}

export default PreviewForm;
