import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Star, Heart, Play } from 'lucide-react';

const MovieCard = ({ item, onClick }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { id, title, poster_path, vote_average, release_date, genres } = item;
  console.log(title, JSON.stringify(poster_path));
  const year = release_date ? release_date.split('-')[0] : 'N/A';
  const favorited = isFavorite(id);

  const handleFavoriteToggle = (e) => {
    e.stopPropagation(); // Prevent modal opening when toggling favorites
    toggleFavorite(item);
  };

  return (
    <div
      onClick={() => onClick(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-lg overflow-hidden cursor-pointer movie-card-zoom bg-zinc-900 shadow-md border border-zinc-800/40 select-none light-theme:bg-gray-100 light-theme:border-gray-200"
    >
      {/* Loading Shimmer Placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
      )}

      {/* Lazy Loaded Image */}
      <img
  src={poster_path}
  alt={title}
  className="w-full h-full object-cover"
  onLoad={() => setImageLoaded(true)}
/>

      {/* Static bottom bar for small screens / when not hovered */}
      <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col md:hidden">
        <span className="text-white text-xs font-bold truncate">{title}</span>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-yellow-500 text-[10px] flex items-center font-bold">
            <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
            {vote_average || '0.0'}
          </span>
          <span className="light-theme:text-gray-700 text-[10px]">{year}</span>
        </div>
      </div>

      {/* Premium Desktop Hover Info Card Overlay */}
      <div className="hidden md:flex absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/20 flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
        
        {/* Favorite Heart Button in corner */}
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 hover:bg-black/80 hover:scale-110 active:scale-95 text-white transition-all pointer-events-auto"
          title={favorited ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart 
            className={`w-4 h-4 transition-all duration-200 ${
              favorited ? 'fill-brand-red text-brand-red animate-[heartBeat_0.3s]' : 'text-zinc-300 hover:text-white'
            }`} 
          />
        </button>

        {/* Small Play Indicator */}
        <div className="absolute inset-x-0 top-[30%] mx-auto w-12 h-12 bg-brand-red text-white flex items-center justify-center rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1)">
          <Play className="w-5 h-5 fill-current translate-x-0.5" />
        </div>

        {/* Card info detail text */}
        <div className="space-y-1.5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          <span className="text-xs uppercase font-extrabold text-brand-red">
            {item.type === 'movie' ? 'Movie' : 'TV Series'}
          </span>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-1">{title}</h3>
          
          <div className="flex items-center space-x-2.5 text-xs text-zinc-300 font-semibold">
            <span className="text-yellow-500 flex items-center">
              <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
              {vote_average || '0.0'}
            </span>
            <span>{year}</span>
          </div>

          {genres && genres.length > 0 && (
            <p className="text-[10px] text-zinc-400 light-theme:text-gray-700 font-medium truncate">
              {genres.slice(0, 2).join(' • ')}
            </p>
          )}

          <p className="text-[11px] text-zinc-300 leading-normal line-clamp-2 pt-0.5 font-medium">
            {item.overview}
          </p>
        </div>
      </div>

    </div>
  );
  
};

export default MovieCard;
