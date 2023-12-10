import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';
import { Route } from 'react-router-dom';

function GridCards(props) {
    const [articles, setArticles] = useState([]);
    const [debouncedSearchText, setDebouncedSearchText] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        // Utilisation d'un effet pour gérer la recherche décalée
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearchText(props.searchText);
        }, 10);

        return () => {
            clearTimeout(delayDebounceFn);
        };
    }, [props.searchText]);

    useEffect(() => {
        let apiUrl = '/api/articles';
        if (props.gender === 'Homme') {
            apiUrl = apiUrl + '?gender=Homme';
        }
        if (props.gender === 'Femme') {
            apiUrl = apiUrl + '?gender=Femme';
        }
        if (debouncedSearchText) {
            if (props.gender) {
                apiUrl = apiUrl + '&search=' + debouncedSearchText
            }
            else {
                apiUrl = apiUrl + '?search=' + debouncedSearchText
            }
        }
        fetch(apiUrl)
            .then((response) => response.json())
            .then(async (data) => {
                if (sortOrder === 'asc') {
                    data.articles.sort((a, b) => a.prix_article - b.prix_article);
                } else if (sortOrder === 'desc') {
                    data.articles.sort((a, b) => b.prix_article - a.prix_article);
                }

                const articlesData = data.articles.map(async (article) => {
                    const imageResponse = await fetch('/api/images/' + article.id);
                    const imageData = await imageResponse.json();
                    const images = imageData.images.map((image) => image.url);
                    return {
                        id: article.id,
                        nameArticle: article.nom_article,
                        price: article.prix_article + "€",
                        articleLink: "article/" + article.id,
                        description: article.description_article,
                        typeArticle: article.categorie,
                        images,
                    };
                });

                Promise.all(articlesData).then((resolvedArticles) => {
                    setArticles(resolvedArticles);
                });
            })
            .catch((error) => console.log('error', error));
    }, [debouncedSearchText, props.gender, sortOrder]);

    return (
        <div>
            <div className="flex justify-around pr-10">
                <div></div>
                <div></div>
                <div>
                    <select className="select select-bordered w-full max-w-xs">
                        <option
                            className={`btn ${sortOrder === 'asc' ? 'btn-active' : ''}`}
                            onClick={() => setSortOrder('asc')}>Prix croissant
                        </option>
                        <option
                            className={`btn ${sortOrder === 'desc' ? 'btn-active' : ''}`}
                            onClick={() => setSortOrder('desc')}>Prix décroissant
                        </option>
                    </select>
                </div>
            </div>
            <section className="w-fit mx-auto grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {
                    articles.map((article) => (
                        <Card
                            key={article.id}
                            images={article.images}
                            nameArticle={article.nameArticle}
                            price={article.price}
                            articleLink={article.articleLink}
                            description={article.description}
                            typeArticle={article.typeArticle}
                        />
                    ))
                }
            </section>
        </div>
    );
}

export default GridCards;
