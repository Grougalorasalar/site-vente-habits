import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';
import SearchBar from './SearchBar.jsx';

function GridCards(props) {
    const [articles, setArticles] = useState([]);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        let apiUrl = '/api/articles';
        if (props.gender === 'Homme') {
            apiUrl = apiUrl + '?gender=Homme';
        }
        if (props.gender === 'Femme') {
            apiUrl = apiUrl + '?gender=Femme';
        }
        if (searchText) {
            apiUrl = apiUrl + `?search=${searchText}`;
        }

        fetch(apiUrl)
            .then((response) => response.json())
            .then(async (data) => {
                const articlesData = data.articles.map(async (article) => {
                    const imageResponse = await fetch('/api/images/' + article.id);
                    const imageData = await imageResponse.json();
                    const images = imageData.images.map((image) => image.url);

                    return {
                        id: article.id,
                        nameArticle: article.nom_article,
                        price: article.prix_article + "€",
                        articleLink: "#article-link",
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
    }, [searchText]);

    const handleSearch = (searchText) => {
        setSearchText(searchText);
    }

    return (
        <div>
            <h1 className="text-center text-4xl font-bold mt-10 mb-10">Barre de recherche</h1>
            <div className="flex justify-center">
                <SearchBar onSearch={handleSearch} /> {/* Ajoutez la barre de recherche */}
            </div>
            <h1 className="text-center text-4xl font-bold mt-10 mb-10">Articles</h1>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {articles.map((article) => (
                    <Card
                        key={article.id}
                        images={article.images}
                        nameArticle={article.nameArticle}
                        price={article.price}
                        articleLink={article.articleLink}
                        description={article.description}
                        typeArticle={article.typeArticle}
                    />
                ))}
            </section>
        </div>
    );
}

export default GridCards;
