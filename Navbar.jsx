import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Tv, Search, Sun, Moon, Settings, Menu, X, Heart, Shield, Check } from 'lucide-react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { quality, setQuality, subtitle, setSubtitle, tmdbKey, setTmdbKey } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Search input states
  const initialSearch = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // UI interaction states
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const settingsRef = useRef(null);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchInput(searchParams.get('q') || '');
  }, [searchParams]);

  // Debounced search trigger: when searchInput changes, wait 500ms before navigating
useEffect(() => {
  const handler = setTimeout(() => {
    if (searchInput.trim()) {
      navigate(`/movies?q=${encodeURIComponent(searchInput.trim())}`);
    } else if (searchInput === '') {
      if (location.pathname === '/movies' && searchParams.get('q')) {
        navigate('/movies');
      }
    }
  }, 500);

  return () => clearTimeout(handler);
}, [searchInput, location.pathname, searchParams]);

  // Scroll event handler for transparent-to-solid transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close settings on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'Favorites', path: '/favorites' },
  ];

  const handleSearchClick = () => {
  setIsSearchExpanded(!isSearchExpanded);
};

  const handleSearchClose = () => {
    setSearchInput('');
    setIsSearchExpanded(false);
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      isScrolled ? 'glass-nav shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Main Nav Links */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-white light-theme:text-gray-500 font-black text-2xl tracking-tighter">
            <Tv className="w-8 h-8 text-brand-red fill-current" />
            <span className={isDark ? "text-white" : "text-gray-400"}>
  BINGE
  <span className="text-brand-red">STREAM</span>
</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors duration-200 ${
  isActive
    ? "text-brand-red"
    : isDark
      ? "text-white hover:text-brand-red"
      : "text-gray-400 hover:text-gray-700"
}`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Search, Settings, Theme, Hamburger */}
        <div className="flex items-center space-x-4">
          
          {/* Debounced Search Input Container */}
          <div className="relative flex items-center">
            <div className={`flex items-center rounded-full overflow-hidden transition-all duration-300 ${
              isSearchExpanded || searchInput ? 'w-48 sm:w-64 px-3 py-1' : 'w-10 h-10 justify-center border-none bg-transparent light-theme:bg-transparent'
            }`}>
              <Search
  className={`w-5 h-5 shrink-0 cursor-pointer ${
    isDark ? "text-white hover:text-white" : "text-gray-500 hover:text-gray-500"
  }`}
  onClick={handleSearchClick}
/>
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`bg-transparent text-sm focus:outline-none ml-2 w-full text-gray-500 light-theme:text-black transition-all ${
                  isSearchExpanded || searchInput ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'
                }`}
              />
              
            </div>
            
            
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-300 light-theme:text-gray-500 hover:text-white light-theme:hover:text-red-600"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun
  className={`w-5 h-5 ${
    isDark ? "text-white" : "text-gray-500"
  }`}
/> : <Moon
  className={`w-5 h-5 ${
    isDark ? "text-white" : "text-gray-500"
  }`}
/>}
            
          </button>

          {/* Settings Control Panel Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2 rounded-full text-zinc-300 light-theme:text-gray-500 hover:text-white light-theme:hover:text-red-600"
              title="Settings"
            >
              <Settings
  className={`w-5 h-5 ${
    isDark ? "text-white" : "text-gray-500"
  } ${isSettingsOpen ? 'rotate-45' : ''} transition-transform duration-300`}
/>
            </button>

            {isSettingsOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-xl shadow-2xl py-4 bg-zinc-950 border border-zinc-800 text-white light-theme:text-gray-900 light-theme:bg-white light-theme:text-gray-800 light-theme:border-gray-200 animate-scale-up z-50">
                <div className="px-4 pb-3 border-b border-zinc-900 light-theme:border-gray-250 flex items-center space-x-2">
                  <Settings
  className={`w-5 h-5 ${
    isDark ? "text-white" : "text-gray-500"
  }`}
/>
                  <span className="font-bold text-sm">Central Quality Control</span>
                </div>
                
                {/* Video Quality Selection */}
                <div className="px-4 py-3">
                  <label className="block text-xs font-semibold light-theme:text-gray-700 light-theme:text-gray-500 uppercase tracking-wider mb-2">Video Quality</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['Auto', '480p', '720p', '1080p', '4K'].map((q) => (
                      <button
                        key={q}
                        onClick={() => setQuality(q)}
                        className={`text-xs py-1 rounded transition-colors ${
                          quality === q
                            ? 'bg-brand-red text-white font-bold'
                            : 'bg-zinc-900 hover:bg-zinc-800 light-theme:bg-gray-100 light-theme:hover:bg-gray-250 text-zinc-300 light-theme:text-brand-red light-theme:text-gray-700'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle Language Selection */}
                <div className="px-4 py-3">
                  <label className="block text-xs font-semibold light-theme:text-gray-700 light-theme:text-gray-500 uppercase tracking-wider mb-2">Subtitles</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['English', 'Hindi', 'Spanish', 'French'].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setSubtitle(lang)}
                        className={`text-xs py-1 rounded transition-colors ${
                          subtitle === lang
                            ? 'bg-brand-red text-white font-bold'
                            : 'bg-zinc-900 hover:bg-zinc-800 light-theme:bg-gray-100 light-theme:hover:bg-gray-250 text-zinc-300 light-theme:text-brand-red light-theme:text-gray-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TMDB API Key Input */}
                <div className="px-4 py-3 border-t border-zinc-900 light-theme:border-gray-250">
                  <div className="flex items-center space-x-1.5 mb-1.5">
                    <Shield className="w-3.5 h-3.5 text-brand-red" />
                    <span className="text-xs font-semibold light-theme:text-gray-700 light-theme:text-gray-500 uppercase tracking-wider">TMDB API Connection</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Enter TMDB API Key (Optional)"
                    value={tmdbKey}
                    onChange={(e) => setTmdbKey(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 text-xs px-2.5 py-1.5 rounded text-white light-theme:bg-gray-100 light-theme:border-gray-300 light-theme:text-black focus:outline-none focus:border-brand-red"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {tmdbKey ? (
                      <span className="text-green-500 flex items-center font-semibold"><Check className="w-3 h-3 mr-0.5" /> Live TMDB Active</span>
                    ) : (
                      "Using high-quality mock backup library."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-zinc-300 light-theme:text-brand-red hover:text-white hover:bg-zinc-900 light-theme:text-gray-600 light-theme:hover:bg-gray-200 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-zinc-950/95 light-theme:bg-white/95 backdrop-blur-xl z-30 animate-fade-in flex flex-col justify-start py-8 px-6 space-y-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-lg font-bold tracking-wide transition-colors py-2 border-b border-zinc-900 light-theme:border-gray-200 ${
                  isActive ? 'text-brand-red' : 'text-zinc-300 light-theme:text-brand-red light-theme:text-gray-800'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
