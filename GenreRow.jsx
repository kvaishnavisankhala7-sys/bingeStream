import React, { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CardSkeleton } from './Skeleton';

const GenreRow = ({ title, items, onCardClick, isLoading }) => {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Monitor scroll position to show/hide navigation arrows
  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      // Give a tiny tolerance for floating point scroll positions
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = rowRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition);
      // Trigger check initially in case screen size changes
      checkScrollPosition();
      
      // Also listen to window resize
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [items]);

  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      // Scroll by 75% of visible row width
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      rowRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!isLoading && (!items || items.length === 0)) return null;

  return (
    <div className="relative space-y-2 py-4 group/row">
      {/* Row Header Title */}
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold px-4 sm:px-12 text-zinc-100 light-theme:text-gray-900 transition-colors tracking-tight select-none">
        {title}
      </h2>

      {/* Row Wrapper with Arrow Navigation Buttons */}
      <div className="relative">
        
        {/* Left Scroll Trigger Button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute left-0 top-0 bottom-0 w-12 items-center justify-center bg-black/60 hover:bg-black/80 text-white z-20 transition-all duration-200 border-r border-zinc-800/10 cursor-pointer opacity-0 group-hover/row:opacity-100 backdrop-blur-sm"
          >
            <ChevronLeft className="w-8 h-8 transition-transform duration-200 hover:scale-125" />
          </button>
        )}

        {/* Scroll Container Grid */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar px-4 sm:px-12 py-3 scroll-smooth"
        >
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          ) : (
            items.map((item) => (
              <MovieCard key={item.id} item={item} onClick={onCardClick} />
            ))
          )}
        </div>

        {/* Right Scroll Trigger Button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-12 items-center justify-center bg-black/60 hover:bg-black/80 text-white z-20 transition-all duration-200 border-l border-zinc-800/10 cursor-pointer opacity-0 group-hover/row:opacity-100 backdrop-blur-sm"
          >
            <ChevronRight className="w-8 h-8 transition-transform duration-200 hover:scale-125" />
          </button>
        )}

      </div>
    </div>
  );
};

export default GenreRow;
