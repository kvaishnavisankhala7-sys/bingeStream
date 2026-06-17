import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import HeroBanner from '../components/HeroBanner';
import GenreRow from '../components/GenreRow';
import MovieDetailsModal from '../components/MovieDetailsModal';
import { HeroSkeleton } from '../components/Skeleton';
import { AlertCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Home = () => {
  // Media rows states
  const [heroMovie, setHeroMovie] = useState(null);
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [topRated, setTopRated] = useState([]);
  
  // Genre-specific rows states
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [sciFiMovies, setSciFiMovies] = useState([]);
  const [thrillerMovies, setThrillerMovies] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  const { tmdbKey } = useSettings();

  useEffect(() => {
    let active = true;
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch hero and main landing sections concurrently
        const [
          hero,
          trend,
          popMovies,
          popTV,
          top,
          action,
          comedy,
          scifi,
          thriller
        ] = await Promise.all([
          api.getHeroBanner(),
          api.getTrending(),
          api.getPopularMovies(1),
          api.getPopularTVShows(1),
          api.getTopRated(),
          api.getGenreRow('Action', 'movie'),
          api.getGenreRow('Comedy', 'movie'),
          api.getGenreRow('Sci-Fi', 'movie'),
          api.getGenreRow('Thriller', 'movie')
        ]);

        if (active) {
          setHeroMovie(hero);
          setTrending(trend);
          setPopularMovies(popMovies);
          setPopularTV(popTV);
          setTopRated(top);
          setActionMovies(action);
          setComedyMovies(comedy);
          setSciFiMovies(scifi);
          setThrillerMovies(thriller);
        }
      } catch (err) {
        console.error("Error loading home page content", err);
        if (active) {
          setError("Something went wrong while fetching titles. Please try again later.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAllData();

    return () => {
      active = false;
    };
  }, [tmdbKey]); // Re-fetch all categories if the user sets/updates their TMDB key

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  if (loading && !heroMovie) {
    return (
      <div className=" min-h-screen ">
        <HeroSkeleton />
        <div className="space-y-6 -mt-8 relative z-10 pb-16">
          <GenreRow title="Trending Now" items={[]} isLoading={true} />
          <GenreRow title="Popular Movies" items={[]} isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 transition-colors duration-300 overflow-x-hidden">

      {/* Hero Featured Video Banner */}
      <HeroBanner movie={heroMovie} onMoreInfo={handleCardClick} />

      {/* Media Row Collection */}
      <div className="relative z-10 space-y-4 -mt-10 sm:-mt-16 md:-mt-24 pb-8">
        
        {error && (
          <div className="mx-4 sm:mx-12 p-4 bg-red-950/60 border border-red-900 text-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </div>
        )}

        <GenreRow
          title="Trending Now"
          items={trending}
          onCardClick={handleCardClick}
          isLoading={loading}
        />
        
        <GenreRow
          title="Popular Movies"
          items={popularMovies}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

        <GenreRow
          title="Popular TV Shows"
          items={popularTV}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

        <GenreRow
          title="Top Rated Classics"
          items={topRated}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

        {/* Genre Categorized Sections */}
        <GenreRow
          title="Action Blockbusters"
          items={actionMovies}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

        <GenreRow
          title="Sci-Fi & Fantasy Journeys"
          items={sciFiMovies}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

        <GenreRow
          title="Heartwarming Comedies"
          items={comedyMovies}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

        <GenreRow
          title="Suspenseful Thrillers"
          items={thrillerMovies}
          onCardClick={handleCardClick}
          isLoading={loading}
        />

      </div>

      {/* Detailed Fold-Out Modal overlay */}
      {selectedMovie && (
        <MovieDetailsModal
          item={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

    </div>
  );
};

export default Home;
