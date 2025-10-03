import React, { useState, useEffect } from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query);
    }, 500); // Debounce search input

    return () => {
      clearTimeout(handler);
    };
  }, [query, onSearch]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <SearchIcon className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="חפשו סרטים או סדרות..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-800 text-white placeholder-gray-400 border border-transparent focus:border-purple-500 focus:ring-0 rounded-full py-2 pl-10 pr-4 transition-colors"
      />
    </div>
  );
};

export default SearchBar;