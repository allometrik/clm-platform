'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl group-focus-within:scale-110 transition-transform duration-300">
          <Search className="text-white w-4 h-4" />
        </div>
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar contratos por título o cliente..."
        className="w-full pl-16 pr-12 py-4 border-2 border-gray-200 rounded-2xl
        focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
        transition-all duration-300 bg-white/80 backdrop-blur-sm
        placeholder:text-gray-400 text-gray-900 font-medium
        hover:border-gray-300 hover:bg-white shadow-sm hover:shadow-md"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 
          bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800
          w-8 h-8 rounded-xl flex items-center justify-center
          transition-all duration-200 hover:scale-110 font-semibold"
        >
          ✕
        </button>
      )}
    </div>
  );
}

