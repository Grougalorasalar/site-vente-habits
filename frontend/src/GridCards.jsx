import React, { useState } from 'react'
import Card from './Card.jsx'

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function GridCards() {
    let [children, setChildren] = useState([]);

    function addCard() {
        children = setChildren(children.concat(<Card
            images={["https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/46404db8-e562-4e96-b8ef-6aea0aea335a/sweat-a-capuche-sportswear-club-fleece-QkdkZ2.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/04d31a3e-ec3e-4675-a4d9-7635f86e75b7/sweat-a-capuche-sportswear-club-fleece-QkdkZ2.png",
                "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5cd27ad4-82ec-40e1-adc6-3e7e51f1960b/sweat-a-capuche-sportswear-club-fleece-QkdkZ2.png"]}
            nameArticle={"Clothes " + children.length}
            key={children.length + 1}
            soldPrice={children.length % 2}
            price={getRandomInt(179) + "€"}
            articleLink={"#article-link"}
        />))
    }

    return (
        <div>
            <button type="button" onClick={addCard} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Card
            </button>
            <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {children}
            </section>
        </div>
    );
}

export default GridCards