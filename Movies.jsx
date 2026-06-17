import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterTags from '../components/FilterTags';
import MovieDetailsModal from '../components/MovieDetailsModal';
import { GridSkeleton } from '../components/Skeleton';
import { AlertCircle, Film, ArrowUpCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { tmdbKey } = useSettings();

  // Media loading states
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  
  // UI interaction states
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const loaderRef = useRef(null);

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch initial data when query, genre, or key changes
  useEffect(() => {
    let active = true;
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        let results = [];
        let total = 1;

        if (searchQuery) {
          // If searching, trigger debounced search
          const searchData = await api.search(searchQuery, 1);
          results = searchData.results;
          total = searchData.total_pages;
        } else if (selectedGenre) {
          // Filter by genre
          const genreData = await api.getGenreRow(selectedGenre, 'movie');
          // Genre rows return a single list, simulate pagination
          results = genreData;
          total = Math.ceil(genreData.length / 10);
        } else {
          // Fetch popular movies
          const popularData = await api.getPopularMovies(1);
          results = popularData;
          // Set a default page range or fetch total pages from TMDB
          total = tmdbKey ? 50 : 4; // Mock max pages is 4, TMDB max pages is higher
        }

        if (active) {
          setItems(results || []);
          setTotalPages(total);
        }
      } catch (err) {
        console.error("Failed to load movies data", err);
        if (active) {
          setError("Failed to fetch movies. Please verify connection or API key.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      active = false;
    };
  }, [searchQuery, selectedGenre, tmdbKey]);

  // Fetch more data (infinite scroll / load more)
  const fetchMoreData = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      let nextResults = [];
      
      if (searchQuery) {
        const data = await api.search(searchQuery, nextPage);
        nextResults = data.results;
      } else if (selectedGenre) {
        // Genre filtering returns local mock rows that are smaller, page loading is mock-simulated
        const genreData = await api.getGenreRow(selectedGenre, 'movie');
        const start = (nextPage - 1) * 10;
        nextResults = genreData.slice(start, start + 10);
      } else {
        nextResults = await api.getPopularMovies(nextPage);
      }

      setItems((prev) => [...prev, ...nextResults]);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to fetch more data", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection Observer for Infinite Scrolling
  useEffect(() => {
    if (loading || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchMoreData();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [items, loading, page, totalPages, loadingMore]);

  const handleCardClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleGenreSelect = (genre) => {
    // Clear search query if genre is chosen, to switch views
    if (searchQuery) {
      setSearchParams({});
    }
    setSelectedGenre(genre);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 transition-colors duration-300 overflow-x-hidden">
      
      {/* Search/Genre Page Title Header */}
      <div className="px-4 sm:px-12 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 light-theme:border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center space-x-2">
            <Film className="w-8 h-8 text-brand-red fill-current" />
            <span>
              {searchQuery ? `Search Results: "${searchQuery}"` : selectedGenre ? `${selectedGenre} Movies` : 'Explore Movies'}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 light-theme:text-gray-500 mt-1 uppercase font-semibold tracking-wider">
            {searchQuery ? 'Finding matching blockbusters' : 'Browsing cinema catalog'}
          </p>
        </div>
      </div>

      {/* Render Genre Filter tags (hide during search query display) */}
      {!searchQuery && (
        <FilterTags selectedGenre={selectedGenre} onSelectGenre={handleGenreSelect} />
      )}

      {/* Error alert banner */}
      {error && (
        <div className="mx-4 sm:mx-12 my-6 p-4 bg-red-950/60 border border-red-900 text-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Main Items Wall Gallery */}
      {loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 space-y-4">
          <Film className="w-16 h-16 text-zinc-600 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-bold">No Movies Found</h2>
          <p className="text-sm text-zinc-400 light-theme:text-gray-500 max-w-md text-center">
            {searchQuery 
              ? "We couldn't find any movies matching your search query. Try checking spelling or search for popular titles like 'Dune', 'Inception', or 'Matrix'."
              : "No movies match this genre filter at the moment."
            }
          </p>
          {selectedGenre && (
            <button 
              onClick={() => setSelectedGenre(null)}
              className="px-5 py-2 bg-brand-red hover:bg-brand-darkRed text-white font-bold rounded text-sm transition-transform active:scale-95"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 sm:px-12 py-6">
          {items.map((item) => (
            <MovieCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {/* Loader Trigger Element for Infinite Scrolling Observer */}
      {!loading && page < totalPages && (
        <div ref={loaderRef} className="flex flex-col items-center py-10 w-full">
          {loadingMore ? (
            <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
          ) : (
            <button 
              onClick={fetchMoreData}
              className="px-6 py-2.5 rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm tracking-wide transition-all active:scale-95 shadow light-theme:bg-white light-theme:text-gray-700 light-theme:border-gray-300 light-theme:hover:bg-gray-100"
            >
              Load More Movies
            </button>
          )}
        </div>
      )}

      {/* Details modal overlay */}
      {selectedMovie && (
        <MovieDetailsModal
          item={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-30 p-2.5 rounded-full bg-brand-red hover:bg-brand-darkRed text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
          title="Scroll to Top"
        >
          <ArrowUpCircle className="w-6 h-6 fill-current" />
        </button>
      )}

    </div>
  );
};

export default Movies;
