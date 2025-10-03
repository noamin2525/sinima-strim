import React, { useState } from 'react';
import { Genre } from '../types.ts';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: Genre | null;
  onSelectGenre: (genre: Genre | null) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({ genres, selectedGenre, onSelectGenre }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (genre: Genre | null) => {
    onSelectGenre(genre);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left mb-6">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedGenre ? selectedGenre.name : 'כל הז\'אנרים'}
          <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w.org/2000/svg" viewBox="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-30">
          <div className="py-1 max-h-60 overflow-y-auto" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
              role="menuitem"
              onClick={(e) => { e.preventDefault(); handleSelect(null); }}
            >
              כל הז'אנרים
            </a>
            {genres.map((genre) => (
              <a
                href="#"
                key={genre.id}
                className={`block px-4 py-2 text-sm ${selectedGenre?.id === genre.id ? 'text-white bg-purple-600' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                role="menuitem"
                onClick={(e) => { e.preventDefault(); handleSelect(genre); }}
              >
                {genre.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;