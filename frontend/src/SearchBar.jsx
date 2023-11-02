import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchText);
  };

  return (
    <form onSubmit={handleSearchSubmit}>
      <input
        type="text"
        placeholder="Rechercher des articles..."
        className="border-2 border-gray-300 rounded-md p-2 w-1/2"
        onChange={handleSearchChange}
      />
      <button className="bg-blue-500 text-white rounded-md p-2 ml-2">Rechercher</button>
    </form>
  );
}

export default SearchBar;
