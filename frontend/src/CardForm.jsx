import React, { useState, useEffect } from 'react';
import CardImages from './CardImages';

function CardForm(props) {
    const isEditing = props.editing;

    const [previewData, setPreviewData] = useState({
        nomArticle: props.formData.nomArticle,
        typeArticle: props.formData.typeArticle,
        prix: props.formData.prix,
        description: props.formData.description,
    });

    useEffect(() => {
        props.onChange(previewData);
    }, [previewData]);

    return (
        <div className="group card glass w-72 bg-base-100 shadow-xl rounded-xl">
            <CardImages images={props.formData.urlImages} unique={previewData.nomArticle} />
            <div className='card-body'>
                <span className="badge ">{isEditing ? (
                    <select
                        value={previewData.typeArticle}
                        onChange={(e) => setPreviewData({ ...previewData, typeArticle: e.target.value })}
                        className="input w-21 h-5 origin-top input-bordered"
                    >
                        <option value="T-shirt">T-shirt</option>
                        <option value="Pantalon">Pantalon</option>
                        <option value="Sweat">Sweat</option>
                        <option value="Casquette">Casquette</option>
                        <option value="Chaussure">Chaussure</option>
                        <option value="Autre">Autre</option>
                    </select>
                ) : (
                    previewData.typeArticle || "Product Type"
                )}
                </span>
                <h2 className="card-title">
                    {isEditing ? (
                        <input
                            type="text"
                            value={previewData.nomArticle}
                            placeholder="Product Name"
                            className="input input-bordered w-full max-w-xs"
                            onChange={(e) => setPreviewData({ ...previewData, nomArticle: e.target.value })}
                        />
                    ) : (
                        props.formData.nomArticle || "Product Name"
                    )}

                </h2>
                <p>{isEditing ? (
                    <textarea
                        placeholder="Description de l'article"
                        className="input input-bordered border"
                        value={previewData.description}
                        onChange={(e) => setPreviewData({ ...previewData, description: e.target.value })}
                    />
                ) : (
                    props.formData.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit"
                )}
                </p>
                <p className='text-left font-semibold flex'>{isEditing ? (
                    <input
                        type="text"
                        value={previewData.prix}
                        placeholder="€149"
                        className="input input-bordered border"
                        onChange={(e) => setPreviewData({ ...previewData, prix: e.target.value })}
                    />
                ) : (
                    props.formData.prix || "$149"
                )}
                </p>
            </div>
        </div>
    );
}

export default CardForm;
