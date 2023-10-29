import React, { useState } from 'react';
import CardImages from './CardImages';
import CreateArticleForm from './CreateArticleForm';
import { useEffect } from 'react';
import GridCards from './GridCards';

function Menu() {
  const [activeItem, setActiveItem] = useState(null);

  const tabImages = []

  useEffect(() => {
    console.log('Menu rendered');
    fetch('/api/articles')
      .then((response) => response.json())
      .then((data) => 
        {
          //convertir articles en dictionnaire
          for (const article in data.articles) {
            console.log(data)
            for(const field in data.articles[article]) {
              if(field === 'id') {
                console.log(data.articles[article][field])
                fetch('/api/images/' + data.articles[article][field])
                .then((response) => response.json())
                .then((data) => 
                  {
                    for(let i = 0; i < data.images.length; i++) {
                      tabImages.push(data.images[i])
                    }
                    console.log(tabImages)
                  }
                )
              }
            }
          }
        }
      )
  }
  , [])

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="text-center">
      <h2>Menu</h2>
      <ul className="flex list-none p-0">
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${
            activeItem === 'carrousel' ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handleItemClick('carrousel')}
        >
          Carrousel
        </li>
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${
            activeItem === 'formulaire' ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handleItemClick('formulaire')}
        >
          Formulaire
        </li>
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${
            activeItem === 'item3' ? 'bg-blue-500 text-white' : ''
          }`}
          onClick={() => handleItemClick('item3')}
        >
          ?
        </li>
      </ul>
      {activeItem === 'carrousel' && <GridCards />}
      {activeItem === 'formulaire' && <CreateArticleForm />}
      {activeItem && activeItem !== 'carrousel' && activeItem !== 'formulaire' && (
        <div className="mt-4">Contenu de {activeItem}</div>
      )}
    </div>
  );
}

export default Menu;
