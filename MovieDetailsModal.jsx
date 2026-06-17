import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFavorites } from '../context/FavoritesContext';
import { X, Star, Calendar, Clock, Heart, Play, Film, Users, ShieldAlert } from 'lucide-react';
import { DetailSkeleton } from './Skeleton';

const MovieDetailsModal = ({ item, onClose }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchFullDetails = async () => {
      setLoading(true);
      try {
        const fullData = await api.getDetails(item.id, item.type);
        if (active) {
          setDetails(fullData);
        }
      } catch (err) {
        console.error("Failed to load details", err);
        if (active) {
          // Fall back to original list item if detail fetch fails
          setDetails(item);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (item) {
      fetchFullDetails();
    }

    return () => {
      active = false;
    };
  }, [item]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const favorited = details ? isFavorite(details.id) : isFavorite(item.id);
  console.log("DETAILS:", details);
console.log("TRAILER URL:", details?.trailer_url);

  // Helper to format runtime (e.g. 148 -> 2h 28m)
  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const trailerId = details?.trailer_url?.split('/embed/')[1];

const trailerThumbnail = trailerId
  ? `https://img.youtube.com/vi/${trailerId}/maxresdefault.jpg`
  : null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Semi-transparent Backdrop click-to-close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-4xl rounded-none sm:rounded-2xl overflow-hidden glass-modal text-white shadow-2xl border border-zinc-800/40 max-h-full sm:max-h-[90vh] flex flex-col z-10 transition-colors duration-300 light-theme:text-gray-900 light-theme:border-gray-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all hover:scale-105 active:scale-95"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-6">
            <DetailSkeleton />
          </div>
        ) : (
          <div className="overflow-y-auto no-scrollbar flex-1">
            {/* Top Backdrop / Trailer Frame */}
            <div className="relative w-full aspect-video sm:h-[45vh] bg-black">
              {console.log("STATE:", isPlayingTrailer)}
              {isPlayingTrailer && details?.trailer_url ? (
                
                <iframe
  src={`${details.trailer_url}?autoplay=1`}
  onError={() => {
    window.open(
      `https://www.youtube.com/results?search_query=${details.title}+official+trailer`,
      "_blank"
    );
  }}
  title="Trailer"
  className="w-full h-full"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
/>
              ) : (
                <>
                  {details?.backdrop_path ? (
  <img
    src={trailerThumbnail}
    alt={details?.title}
    className="w-full h-full object-cover"
  />
) : (
  <div className="w-full h-full flex items-center justify-center bg-zinc-900">
    <img
      src={details?.poster_path || item.poster_path}
      alt={details?.title}
      className="h-full object-contain"
    />
  </div>
)}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent light-theme:from-white light-theme:via-white/20" />
                  
                  {/* Backdrop Centered Action Overlay */}
                  <div className="absolute bottom-6 left-6 sm:left-10 flex flex-wrap gap-3 items-center">
                    {details?.trailer_url ? (
                    <button
  onClick={() => {
    console.log("PLAY BUTTON CLICKED");
    console.log(details?.trailer_url);
    setIsPlayingTrailer(true);
  }}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-md font-semibold"
>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Play Trailer</span>
                      </button>
                    ) : (
                      <span className="text-xs bg-zinc-800/70 text-zinc-300 px-3 py-1.5 rounded border border-zinc-700/50 flex items-center">
                        <ShieldAlert className="w-3.5 h-3.5 mr-1" /> No trailer available
                      </span>
                    )}

                    <button
                      onClick={() => toggleFavorite(details)}
                      className={`flex items-center justify-center p-2.5 rounded-full shadow-lg transition-all ${
                        favorited
                          ? 'bg-brand-red text-white hover:bg-brand-darkRed'
                          : 'bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/50'
                      }`}
                      title={favorited ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Heart className={`w-5 h-5 ${favorited ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column: Poster and Quick Metadata */}
              <div className="hidden md:flex flex-col space-y-4">
                <div className="rounded-lg overflow-hidden border border-zinc-800 shadow-md">
                  <img
                    src={details?.poster_path || item.poster_path}
                    alt={details?.title || item.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
                {details?.production && (
                  <div className="text-xs text-zinc-400 light-theme:text-gray-700 font-medium">
                    <span className="block font-bold text-zinc-300 light-theme:text-gray-700 uppercase tracking-wide mb-1">Production</span>
                    {details.production}
                  </div>
                )}
              </div>

              {/* Right Column: Title, Overview, Cast, Director */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
                    {details?.title || item.title}
                  </h2>
                  
                  {/* Metadata Tags */}
                  <div className="flex flex-wrap items-center gap-3.5 text-xs sm:text-sm font-semibold text-zinc-300 light-theme:text-gray-600">
                    <span className="flex items-center text-yellow-500 font-bold">
                      <Star className="w-4 h-4 fill-current mr-1" />
                      {details?.vote_average || item.vote_average || '0.0'}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1 text-zinc-400" />
                      {details?.release_date ? details.release_date.split('-')[0] : 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-zinc-400" />
                      {formatRuntime(details?.runtime || item.runtime)}
                    </span>
                    <span className="text-[10px] bg-zinc-800 light-theme:bg-gray-200 px-2 py-0.5 rounded text-white light-theme:text-gray-700 uppercase font-extrabold tracking-wider">
                      {details?.type || item.type}
                    </span>
                  </div>
                </div>

                {/* Genre Tags */}
                {details?.genres && (
                  <div className="flex flex-wrap gap-1.5">
                    {details.genres.map((g, i) => (
                      <span key={i} className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full light-theme:bg-gray-100 light-theme:border-gray-250 light-theme:text-gray-700">
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synopsis */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-zinc-300 light-theme:text-gray-700 uppercase tracking-widest flex items-center">
                    <Film className="w-4 h-4 mr-1.5 text-brand-red" /> Synopsis
                  </h4>
                  <p className="text-zinc-400 light-theme:text-gray-800">
                    {details?.overview || item.overview}
                  </p>
                </div>

                {/* Cast and Director details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-900 light-theme:border-gray-250 text-sm">
                  
                  {/* Cast List */}
                  {details?.cast && details.cast.length > 0 && (
                    <div>
                      <h5 className="font-bold text-zinc-300 light-theme:text-gray-700 uppercase tracking-wider mb-2 flex items-center">
                        <Users className="w-4 h-4 mr-1.5 text-zinc-500" /> Starring
                      </h5>
                      <ul className="space-y-1 text-zinc-400 light-theme:text-gray-600 font-medium">
                        {details.cast.map((actor, idx) => (
                          <li key={idx}>{actor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Director / Creator */}
                  {details?.director && (
                    <div>
                      <h5 className="font-bold text-zinc-300 light-theme:text-gray-700 uppercase tracking-wider mb-2">
                        Director / Creator
                      </h5>
                      <p className="light-theme:text-gray-700 light-theme:text-gray-600 font-medium">
                        {details.director}
                      </p>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MovieDetailsModal;
