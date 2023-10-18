import React, { useState } from 'react'
import Card from './Card'
// import { v4 } from 'uuid'

// import React from 'react';
// import Card from './Card';

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

export function GridCards() {
    let [children, setChildren] = useState([]);

    function addCard() {
        children = setChildren(children.concat(<Card nameArticle={"clothes " + children.length} key={children.length} soldPrice={children.length % 2} price={getRandomInt(179)+"€"}/>))
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