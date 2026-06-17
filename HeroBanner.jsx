import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const HeroBanner = ({ movie, onMoreInfo }) => {
  const { isDark } = useTheme();
  const [autoplay, setAutoplay] = useState(false);
const [videoLoaded, setVideoLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Reset autoplay status when movie changes
    setAutoplay(false);
    if (!movie?.trailer_url) return;

    const timer = setTimeout(() => {
      setAutoplay(true);
    }, 2000); // Autoplay after 3.5 seconds

    return () => clearTimeout(timer);
  }, [movie]);

  if (!movie) return null;

  const { title, backdrop_path, overview, vote_average, release_date, genres, trailer_url } = movie;
  const releaseYear = release_date ? release_date.split('-')[0] : 'N/A';
  
  // Calculate Netflix-style Match Score (e.g., 8.4 rating -> 94% Match)
  const matchScore = vote_average ? Math.round(vote_average * 10.5) : 85;

  return (
    <div className="relative w-full h-[60vh] sm:h-[75vh] md:h-[90vh] overflow-hidden bg-black flex items-center">
      
      {/* Background Media (Image or Autoplay Video) */}
      <div className="absolute inset-0 select-none w-full h-full pointer-events-none">
        {autoplay && trailer_url ? (
          <div className="w-full h-full scale-[1.35] sm:scale-[1.25] origin-center transition-all duration-1000 animate-fade-in">
            <iframe
  src={`${trailer_url}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0`}
  title={title}
  className="w-full h-full border-none pointer-events-none"
  allow="autoplay; encrypted-media"
  onLoad={() => setVideoLoaded(true)}
/>
          </div>
        ) : (
          <img
  src={`https://image.tmdb.org/t/p/w1280${backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover object-center scale-105 animate-[shimmer_10s_infinite_alternate] opacity-80 transition-all duration-700"
          />
        )}
        
        {/* Dynamic Vignette Overlays */}
        {/* Left Shadow */}
        
        
        {/* Bottom Fade - adapts to light mode theme */}
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/40 to-transparent light-theme:from-gray-50 light-theme:via-gray-50/60 light-theme:to-transparent" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
        <div className="max-w-2xl flex flex-col items-start space-y-4">
          
          {/* Genre Labels */}
          {genres && genres.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-fade-in">
              {genres.slice(0, 3).map((g, i) => (
                <span key={i} className="text-xs uppercase font-extrabold tracking-wider bg-brand-red/90 text-white px-2.5 py-0.5 rounded shadow">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white light-theme:text-gray-900 drop-shadow-md leading-none max-w-xl animate-slide-up">
            {title}
          </h1>

          {/* Stats Bar */}
          <div className="flex items-center space-x-4 text-xs sm:text-sm font-semibold text-zinc-300 light-theme:text-zinc-600 mt-2">
            <span className="text-emerald-400 font-bold text-sm sm:text-base drop-shadow-sm">
              {matchScore}% Match
            </span>
            <span className="bg-black/45 px-2 py-0.5 rounded text-white text-[11px] border border-zinc-700/30">
              {releaseYear}
            </span>
            <span className="border border-zinc-500 rounded px-1.5 py-0.1 text-[10px] uppercase font-bold tracking-widest bg-black/30 text-white">
              U/A 16+
            </span>
            <span className="border border-zinc-500 rounded px-1.5 py-0.1 text-[10px] uppercase font-bold tracking-widest bg-black/30 text-white">
              HDR
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-200 drop-shadow max-w-lg line-clamp-3 md:line-clamp-4 leading-relaxed font-medium">
            {overview}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-row items-center gap-3 pt-4 w-full sm:w-auto relative">
            <button
              onClick={() => onMoreInfo(movie)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-brand-red hover:bg-brand-darkRed text-white font-bold py-2.5 px-6 rounded-md shadow-lg transition-all duration-200 active:scale-95 text-sm sm:text-base cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current sm:w-5 sm:h-5" />
              <span>Watch Trailer</span>
            </button>
            
            <button
              onClick={() => onMoreInfo(movie)}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-white border border-zinc-700/50 font-bold py-2.5 px-6 rounded-md shadow-lg backdrop-blur transition-all duration-200 active:scale-95 text-sm sm:text-base cursor-pointer"
            >
              <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>More Info</span>
            </button>

            {/* Audio Mute controls for Autoplay */}
            {autoplay && trailer_url && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute left-[105%] hidden sm:flex items-center justify-center p-2.5 rounded-full border border-zinc-700 bg-black/40 hover:bg-black/60 hover:scale-105 transition-all cursor-pointer text-white"
                title={isMuted ? "Unmute Preview" : "Mute Preview"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default HeroBanner;
