import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';
import FilterTags from '../components/FilterTags';
import MovieDetailsModal from '../components/MovieDetailsModal';
import { GridSkeleton } from '../components/Skeleton';
import { AlertCircle, Tv, ArrowUpCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const TVShows = () => {
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
  const [selectedShow, setSelectedShow] = useState(null);
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

  // Fetch initial data when genre or key changes
  useEffect(() => {
    let active = true;
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        let results = [];
        let total = 1;

        if (selectedGenre) {
          // Filter TV shows by genre
          const genreData = await api.getGenreRow(selectedGenre, 'tv');
          results = genreData;
          total = Math.ceil(genreData.length / 10);
        } else {
          // Fetch popular TV Shows
          const popularData = await api.getPopularTVShows(1);
          results = popularData;
          total = tmdbKey ? 50 : 3; // Mock TV pages max is 3, TMDB is higher
        }

        if (active) {
          setItems(results || []);
          setTotalPages(total);
        }
      } catch (err) {
        console.error("Failed to load TV shows data", err);
        if (active) {
          setError("Failed to fetch TV shows. Please check connection or API settings.");
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
  }, [selectedGenre, tmdbKey]);

  // Fetch more data (infinite scroll / load more)
  const fetchMoreData = async () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      let nextResults = [];
      
      if (selectedGenre) {
        const genreData = await api.getGenreRow(selectedGenre, 'tv');
        const start = (nextPage - 1) * 10;
        nextResults = genreData.slice(start, start + 10);
      } else {
        nextResults = await api.getPopularTVShows(nextPage);
      }

      setItems((prev) => [...prev, ...nextResults]);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to fetch more TV data", err);
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

  const handleCardClick = (show) => {
    setSelectedShow(show);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 transition-colors duration-300 overflow-x-hidden">
      
      {/* Title Header */}
      <div className="px-4 sm:px-12 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-900 light-theme:border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold flex items-center space-x-2">
            <Tv className="w-8 h-8 text-brand-red fill-current" />
            <span>
              {selectedGenre ? `${selectedGenre} TV Shows` : 'Explore TV Shows'}
            </span>
          </h1>
          <p className="text-xs text-zinc-400 light-theme:text-gray-500 mt-1 uppercase font-semibold tracking-wider">
            Premium Episodic Series
          </p>
        </div>
      </div>

      {/* Render Genre Filter tags */}
      <FilterTags selectedGenre={selectedGenre} onSelectGenre={handleGenreSelect} />

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
          <Tv className="w-16 h-16 text-zinc-600 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-bold">No TV Shows Found</h2>
          <p className="text-sm text-zinc-400 light-theme:text-gray-500 max-w-md text-center">
            No TV shows match this genre filter at the moment. Try selecting another category.
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
              Load More Shows
            </button>
          )}
        </div>
      )}

      {/* Details modal overlay */}
      {selectedShow && (
        <MovieDetailsModal
          item={selectedShow}
          onClose={() => setSelectedShow(null)}
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

export default TVShows;
