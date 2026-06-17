import React from 'react';
import { X } from 'lucide-react';

const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Thriller',
  'Horror',
  'Romance',
  'Sci-Fi'
];

const FilterTags = ({ selectedGenre, onSelectGenre }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 sm:px-12 py-3 select-none">
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 light-theme:text-gray-500 mr-2">
        Genres:
      </span>

      {GENRES.map((genre) => {
        const isActive = selectedGenre === genre;
        return (
          <button
            key={genre}
            onClick={() => onSelectGenre(genre)}
            className={`text-xs px-4 py-2 rounded-full font-semibold border transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-brand-red border-brand-red text-white shadow-md shadow-brand-red/20 scale-105'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white light-theme:bg-gray-100 light-theme:border-gray-300 light-theme:text-gray-700 light-theme:hover:bg-gray-200'
            }`}
          >
            {genre}
          </button>
        );
      })}

      {/* Clear Filter Tag */}
      {selectedGenre && (
        <button
          onClick={() => onSelectGenre(null)}
          className="flex items-center space-x-1 text-xs px-3 py-2 rounded-full font-bold bg-zinc-850 hover:bg-zinc-800 text-brand-red border border-zinc-800 transition-all cursor-pointer light-theme:bg-red-50 light-theme:border-red-200 light-theme:hover:bg-red-100"
          title="Clear genre filter"
        >
          <span>Clear</span>
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default FilterTags;
