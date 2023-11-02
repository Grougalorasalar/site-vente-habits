import React, { useEffect, useState } from 'react';
import Card from './Card.jsx';
import SearchBar from './SearchBar.jsx';

function GridCards(props) {
    const [articles, setArticles] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [debouncedSearchText, setDebouncedSearchText] = useState('');

    useEffect(() => {
        // Utilisation d'un effet pour gérer la recherche décalée
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearchText(props.searchText);
        }, 100);

        return () => {
            clearTimeout(delayDebounceFn);
        };
    }, [props.searchText]);

    useEffect(() => {
        let apiUrl = '/api/articles';
        if (props.gender === 'Homme') {
            apiUrl = apiUrl + '?gender=Homme'
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
        console.log(apiUrl);
        fetch(apiUrl)
            .then((response) => response.json())
            .then(async (data) => {
                const articlesData = data.articles.map(async (article) => {
                    const imageResponse = await fetch('/api/images/' + article.id);
                    const imageData = await imageResponse.json();
                    const images = imageData.images.map((image) => image.url);
                    console.log(data.articles);

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
    }, [debouncedSearchText, props.gender]);

    const handleSearch = (searchText) => {
        setSearchText(searchText);
    }

    return (
        <div>
            <h1 className="text-center text-3xl font-bold mt-2 mb-2">Articles</h1>
            <section className="w-full max-w-screen-md mx-auto grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-5 mt-2 mb-2">
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
                    ))}
            </section>
        </div>
    );
}

export default GridCards;
