import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';
import { Heart, Play, Film } from 'lucide-react';

const Favorites = () => {
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 transition-colors duration-300 overflow-x-hidden">
      
      {/* Title Header */}
      <div className="px-4 sm:px-12 py-4 flex justify-between items-center border-b border-zinc-900 light-theme:border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center space-x-2">
            <Heart className="w-8 h-8 text-brand-red fill-brand-red" />
            <span>My Favorites List</span>
          </h1>
          <p className="text-xs text-zinc-400 light-theme:text-gray-500 mt-1 uppercase font-semibold tracking-wider">
            Your personalized watchlist
          </p>
        </div>
        
        {favorites.length > 0 && (
          <span className="text-xs sm:text-sm font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full light-theme:bg-gray-100 light-theme:border-gray-250 light-theme:text-gray-700">
            {favorites.length} {favorites.length === 1 ? 'Title' : 'Titles'} Saved
          </span>
        )}
      </div>

      {/* Favorites Grid Gallery */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-6 space-y-6 animate-fade-in">
          <div className="relative">
            <Heart className="w-20 h-20 text-zinc-800 light-theme:text-gray-200" />
            <Film className="w-8 h-8 text-brand-red absolute -bottom-1 -right-1 animate-pulse" />
          </div>
          
          <div className="text-center space-y-2 max-w-md">
            <h2 className="text-xl sm:text-2xl font-bold">Your Watchlist is Empty</h2>
            <p className="text-sm text-zinc-400 light-theme:text-gray-500 leading-relaxed font-medium">
              Tap the heart icon on any movie or TV show card throughout BingeStream to bookmark it here. We'll remember your choices even after you close your browser!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/movies')}
              className="px-6 py-2.5 bg-brand-red hover:bg-brand-darkRed text-white font-bold text-sm rounded transition-transform active:scale-95 shadow cursor-pointer"
            >
              Browse Movies
            </button>
            <button
              onClick={() => navigate('/tv')}
              className="px-6 py-2.5 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-bold text-sm rounded transition-transform active:scale-95 shadow cursor-pointer light-theme:bg-white light-theme:text-gray-700 light-theme:border-gray-300 light-theme:hover:bg-gray-100"
            >
              Browse TV Series
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 sm:px-12 py-6">
          {favorites.map((item) => (
            <MovieCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {/* Details modal overlay */}
      {selectedMovie && (
        <MovieDetailsModal
          item={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

    </div>
  );
};

export default Favorites;
