import React, { useEffect, useState } from 'react'
import CardImages from './CardImages'
import { nbItemsInBasket, calcTotalPrice, addBasket } from './Utils'
import { useParams, useLocation } from 'react-router-dom';

function Article(props) {
    const location = useLocation();
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        fetch('/api/articles/' + id)
            .then((response) => response.json())
            .then(async (data) => {
                const imageResponse = await fetch('/api/images/' + id);
                const imageData = await imageResponse.json();
                const images = imageData.images.map((image) => image.url);
                setArticle({
                    id: data.article.id,
                    nameArticle: data.article.nom_article,
                    price: data.article.prix_article + "€",
                    articleLink: "article/" + data.article.id,
                    description: data.article.description_article,
                    typeArticle: data.article.categorie,
                    images,
                });
            });
    }, [id]);

    return (
        <div className='grid grid-cols-2 grid-rows-4 max-w-5xl mx-auto gap-16'>
            <div className='group col-span-1 row-span-full'>
                <CardImages
                    images={article ? article.images : []}
                    unique={article ? article.nameArticle : ''}
                    articleLink={article ? article.articleLink : ''}
                />
            </div>
            <div className=''>
                <span className="badge">{article ? article.typeArticle : ''}</span>
                <h2 className='font-extrabold text-xl'>{article ? article.nameArticle : ''}</h2>
                <p className='text-left font-semibold'>{article ? article.price : ''}</p>
            </div>
            <div className=''>
                <h2></h2>
            </div>
            <div className='flex flex-col justify-center items-center gap-4'>
                <button className='btn btn-neutral rounded-full w-72' onClick={() => { addBasket(id, props.setBasket, props.setTotalPrice) }}>Ajouter au panier</button>
                <button className='btn btn-outline rounded-full w-72'>Ajouter aux favoris
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div className=''>
                <p className='font-semibold text-base '>{article ? article.description : ''}</p>
            </div>
        </div >
    )
}

export default Article