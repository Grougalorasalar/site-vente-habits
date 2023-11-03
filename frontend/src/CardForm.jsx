import React, { useState, useEffect } from 'react';
import CardImages from './CardImages';

function CardForm(props) {
    const isEditing = props.editing;
    const [editedName, setEditedName] = useState("Product Name");
    const [editedType, setEditedType] = useState("Product Type");
    const [editedDescription, setEditedDescription] = useState("Lorem ipsum dolor sit amet consectetur adipisicing elit");
    const [editedPrice, setEditedPrice] = useState("$149");
    const [showImageForm, setShowImageForm] = useState(false); // État pour afficher/masquer le formulaire d'images

    useEffect(() => {
        if (isEditing) {
            props.onChange({
                editedName,
                editedType,
                editedDescription,
                editedPrice,
            });
        }
    }, [editedName, editedType, editedDescription, editedPrice]);

    return (
        <div className={`group card glass w-96 bg-base-100 shadow-xl rounded-xl`}>
            <CardImages images={props.images} unique={props.nameArticle} articleLink={props.articleLink} />
            <div className='card-body'>
                <span className="badge ">{isEditing ? (
                    <select
                        value={editedType}
                        onChange={(e) => setEditedType(e.target.value)}
                        className="input w-21 h-5 origin-top"
                    >
                        <option value="t-shirt">T-shirt</option>
                        <option value="pantalon">Pantalon</option>
                        <option value="sweat">Sweat</option>
                        <option value="casquette">Casquette</option>
                    </select>
                ) : (
                    props.typeArticle || "Product Type"
                )}
                </span>
                <h2 className="card-title">
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedName}
                            placeholder="Product Name"
                            className="input bg-transparent border"
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                    ) : (
                        props.nameArticle || "Product Name"
                    )}
                    <div className={`badge badge-secondary ${isEditing ? 'text-xs' : 'text-base'}`}>
                        NEW
                    </div>
                </h2>
                <p>{isEditing ? (
                    <textarea
                        placeholder="Description de l'article"
                        className="input input-bordered bg-transparent"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                    />
                ) : (
                    props.description || "Lorem ipsum dolor sit amet consectetur adipisicing elit"
                )}
                </p>
                <p className='text-left font-semibold flex'>{isEditing ? (
                    <input
                        type="text"
                        value={editedPrice}
                        placeholder="$149"
                        className="input bg-transparent border"
                        onChange={(e) => setEditedPrice(e.target.value)}
                    />
                ) : (
                    props.price || "$149"
                )}
                </p>
            </div>
        </div>
    );
}

export default CardForm;
