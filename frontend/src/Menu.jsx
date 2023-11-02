import React, { useState } from 'react';
import ArticleForm from './ArticleForm';
import GridCards from './GridCards';

function Menu() {
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="">
      <ul className="flex list-none p-0">
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${activeItem === 'carrousel' ? 'bg-blue-500 text-white' : ''
            }`}
          onClick={() => handleItemClick('carrousel')}
        >
          Articles
        </li>
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${activeItem === 'homme' ? 'bg-blue-500 text-white' : ''
            }`}
          onClick={() => handleItemClick('homme')}
        >
          Homme
        </li>
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${activeItem === 'femme' ? 'bg-blue-500 text-white' : ''
            }`}
          onClick={() => handleItemClick('femme')}
        >
          Femme
        </li>
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${activeItem === 'formulaire' ? 'bg-blue-500 text-white' : ''
            }`}
          onClick={() => handleItemClick('formulaire')}
        >
          Formulaire
        </li>
        <li
          className={`p-2 border border-gray-300 cursor-pointer mx-2 ${activeItem === 'item3' ? 'bg-blue-500 text-white' : ''
            }`}
          onClick={() => handleItemClick('item3')}
        >
          ?
        </li>
      </ul>
      {activeItem === 'formulaire' && <ArticleForm />}
      {activeItem === 'carrousel' && <GridCards />}
      {activeItem === 'homme' && <GridCards gender="Homme" />}
      {activeItem === 'femme' && <GridCards gender="Femme" />}
    </div>
  );
}

export default Menu;
