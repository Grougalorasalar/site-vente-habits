import React, { useState } from 'react';
import ArticleForm from './ArticleForm';
import GridCards from './GridCards';
import SearchBar from './SearchBar';
import NewForm from './NewForm';
import PrevForm from './PrevForm';

function Menu() {
  const [activeItem, setActiveItem] = useState(null);
  const [searchText, setSearchText] = useState('');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="bg-blue-100 py-4">
      <ul className="flex space-x-2 px-4 justify-center">
        <li
          className={`px-4 py-2 bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 cursor-pointer ${activeItem === 'carrousel' ? 'bg-blue-500 text-red' : ''}`}
          onClick={() => handleItemClick('carrousel')}
        >
          Articles
        </li>
        <li
          className={`px-4 py-2 bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 cursor-pointer ${activeItem === 'homme' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleItemClick('homme')}
        >
          Homme
        </li>
        <li
          className={`px-4 py-2 bg-white text-blue-500 hover:bg-blue-500 hover:text-white border border-blue-500 cursor-pointer ${activeItem === 'femme' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleItemClick('femme')}
        >
          Femme
        </li>
        <li
          className={`px-4 py-2 bg-white text-blue-500 hover:bg-blue-500 hover-text-white border border-blue-500 cursor-pointer ${activeItem === 'formulaire' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleItemClick('formulaire')}
        >
          Formulaire
        </li>
        <li
          className={`px-4 py-2 bg-white text-blue-500 hover:bg-blue-500 hover-text-white border border-blue-500 cursor-pointer ${activeItem === 'item3' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleItemClick('new-form')}
        >
          Nouveau Formulaire
        </li>
        <li
          className={`px-4 py-2 bg-white text-blue-500 hover:bg-blue-500 hover-text-white border border-blue-500 cursor-pointer ${activeItem === 'item3' ? 'bg-blue-500 text-white' : ''}`}
          onClick={() => handleItemClick('prev-form')}
        >
          Prévisualisation
        </li>
        <li className="ml-auto">
          <SearchBar onSearch={(searchText) => setSearchText(searchText)} />
        </li>
      </ul>
      {activeItem === 'formulaire' && <ArticleForm />}
      {activeItem === 'new-form' && <NewForm />}
      {activeItem === 'prev-form' && <PrevForm />}
      {activeItem === 'carrousel' && <GridCards searchText={searchText} />}
      {activeItem === 'homme' && <GridCards gender="Homme" searchText={searchText} />}
      {activeItem === 'femme' && <GridCards gender="Femme" searchText={searchText} />}
    </div>
  );
}

export default Menu;
