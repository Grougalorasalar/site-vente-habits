import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    onSearch(searchText);
  }, [searchText]);

  return (
    <form className="w-full max-w-lg">
      <div className="relative text-gray-600 focus-within:text-gray-400">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <i className="bx bx-search h-6 w-6" />
        </span>
        <input
          type="text"
          placeholder="Rechercher des articles..."
          className="py-2 pl-10 pr-4 block w-full rounded-full bg-white border border-gray-300 text-gray-900 focus:outline-none focus:bg-white focus:border-blue-500 focus:text-gray-900 placeholder-gray-400"
          onChange={handleSearchChange}
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button type="submit" className="p-1 focus:outline-none focus:ring focus:ring-blue-500">
            <i className="bx bx-search h-5 w-5" />
          </button>
        </span>
      </div>
    </form>
  );
}

export default SearchBar;
