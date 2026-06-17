import React from 'react';
import { Link } from 'react-router-dom';
import { Tv } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer-theme bg-zinc-950 text-zinc-400 py-12 px-6 sm:px-12 md:px-16 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Section */}
        <div className="flex flex-col space-y-4">
          <Link to="/" className="flex items-center space-x-2 text-gray-400 light-theme:text-netflix-black font-black text-2xl tracking-tighter">
            <Tv className="w-8 h-8 text-brand-red fill-current" />
            <span>BINGE<span className="text-brand-red">STREAM</span></span>
          </Link>
          <p className="text-sm">
            Your ultimate destination for streaming discovery. Explore the latest popular movies, TV shows, and personalized favorites, anywhere, anytime.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-brand-red transition-colors duration-200" title="Facebook">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-brand-red transition-colors duration-200" title="Twitter">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-brand-red transition-colors duration-200" title="Instagram">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-brand-red transition-colors duration-200" title="GitHub">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-gray-900 font-bold mb-4"></h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-brand-red transition-colors duration-200">Home</Link></li>
            <li><Link to="/movies" className="hover:text-brand-red transition-colors duration-200">Movies</Link></li>
            <li><Link to="/tv" className="hover:text-brand-red transition-colors duration-200">TV Shows</Link></li>
            <li><Link to="/favorites" className="hover:text-brand-red transition-colors duration-200">Favorites</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="text-gray-900 font-bold mb-4"></h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Terms of Use</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Cookie Preferences</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Corporate Info</a></li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div>
          <h4 className="text-brand-red font-bold mb-4"></h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Help Center</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Account Support</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Media Center</a></li>
            <li><a href="#" className="hover:text-brand-red transition-colors duration-200">Contact Us</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-zinc-900 light-theme:border-gray-200 text-center text-xs text-zinc-500">
        <p>&copy; {new Date().getFullYear()} BingeStream. All rights reserved. Built for cinematic immersion.</p>
      </div>
    </footer>
  );
};

export default Footer;
