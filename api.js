import axios from 'axios';
import { mockMedia } from './mockData';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Utility helper to check if TMDB API key is active
const getApiKey = () => {
  try {
    return localStorage.getItem('bingestream_tmdb_key') || '';
  } catch (e) {
    return '';
  }
};

// Genre mapping for TMDB
// TMDB uses numeric IDs. We map them to our standard genre names.
const GENRE_MAP = {
  28: 'Action',
  12: 'Action', // Adventure mapped to Action for simplicity
  35: 'Comedy',
  18: 'Drama',
  53: 'Thriller',
  878: 'Sci-Fi',
  27: 'Horror',
  10749: 'Romance',
  // TV specific mappings
  10759: 'Action', // Action & Adventure
  10765: 'Sci-Fi', // Sci-Fi & Fantasy
};

const GENRE_NAME_TO_ID = {
  'Action': [28, 12, 10759],
  'Comedy': [35],
  'Drama': [18],
  'Thriller': [53],
  'Sci-Fi': [878, 10765],
  'Horror': [27],
  'Romance': [10749],
};

// Helper to normalize TMDB movie/TV object to our standard layout
const normalizeItem = (item, mediaType) => {
  const type = mediaType || item.media_type || (item.first_air_date ? 'tv' : 'movie');
  
  // Resolve poster and backdrop images
  let poster = item.poster_path;
  if (poster && !poster.startsWith('http')) {
    poster = `${IMAGE_BASE_URL}/w500${poster}`;
  } else if (!poster) {
    // Elegant fallback if no poster is returned
    poster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500&auto=format&fit=crop';
  }

  let backdrop = item.backdrop_path;
  if (backdrop && !backdrop.startsWith('http')) {
    backdrop = `${IMAGE_BASE_URL}/original${backdrop}`;
  } else if (!backdrop) {
    backdrop = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop';
  }

  let genres = [];
  if (item.genres) {
    genres = item.genres.map(g => typeof g === 'string' ? g : g.name);
  } else if (item.genre_ids) {
    genres = item.genre_ids.map(id => GENRE_MAP[id]).filter(Boolean);
  }
  if (genres.length === 0) {
    genres = [type === 'movie' ? 'Movie' : 'TV Show'];
  }

  return {
    id: item.id,
    title: item.title || item.name || item.original_title || item.original_name || 'Untitled',
    type: type,
    overview: item.overview || 'No synopsis available for this title.',
    poster_path: poster,
    backdrop_path: backdrop,
    vote_average: item.vote_average ? parseFloat(item.vote_average.toFixed(1)) : 0.0,
    release_date: item.release_date || item.first_air_date || 'Unknown Date',
    runtime: item.runtime || (item.episode_run_time && item.episode_run_time[0]) || 0,
    genres: genres,
    cast: item.cast || [],
    director: item.director || '',
    production: item.production || (item.production_companies && item.production_companies[0]?.name) || '',
    trailer_url: item.trailer_url || ''
  };
};

// API calls implementation
export const api = {
  // 1. Get Hero/Featured content
  async getHeroBanner() {
    const key = getApiKey();
    if (key) {
      try {
        // Fetch trending for the week
        const response = await axios.get(`${TMDB_BASE_URL}/trending/all/week?api_key=${key}`);
        const results = response.data.results;
        if (results && results.length > 0) {
          // Select a random title from the top 5
          const index = Math.floor(Math.random() * Math.min(5, results.length));
          const details = await this.getDetails(results[index].id, results[index].media_type);
          return details;
        }
      } catch (err) {
        console.error("TMDB Hero fetch failed, falling back to mock", err);
      }
    }
    // Mock fallback: pick Inception or Dune
    const heroId = Math.random() > 0.5 ? 1 : 4;
    const item = mockMedia.find(m => m.id === heroId) || mockMedia[0];
    return normalizeItem(item);
  },

  // 2. Get Trending items
  async getTrending() {
    const key = getApiKey();
    if (key) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/trending/all/day?api_key=${key}`);
        return response.data.results.map(item => normalizeItem(item));
      } catch (err) {
        console.error("TMDB Trending fetch failed, falling back to mock", err);
      }
    }
    // Mock fallback: return first 12 items
    return mockMedia.slice(0, 12).map(item => normalizeItem(item));
  },

  // 3. Get Popular Movies
  async getPopularMovies(page = 1) {
    const key = getApiKey();
    if (key) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${key}&page=${page}`);
        return response.data.results.map(item => normalizeItem(item, 'movie'));
      } catch (err) {
        console.error("TMDB Popular Movies failed, falling back to mock", err);
      }
    }
    // Mock fallback: filter all movies, slice by page (say, 10 per page)
    const movies = mockMedia.filter(m => m.type === 'movie');
    const start = (page - 1) * 10;
    return movies.slice(start, start + 10).map(item => normalizeItem(item, 'movie'));
  },

  // 4. Get Popular TV Shows
  async getPopularTVShows(page = 1) {
    const key = getApiKey();
    if (key) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/tv/popular?api_key=${key}&page=${page}`);
        return response.data.results.map(item => normalizeItem(item, 'tv'));
      } catch (err) {
        console.error("TMDB Popular TV Shows failed, falling back to mock", err);
      }
    }
    // Mock fallback
    const tvShows = mockMedia.filter(m => m.type === 'tv');
    const start = (page - 1) * 10;
    return tvShows.slice(start, start + 10).map(item => normalizeItem(item, 'tv'));
  },

  // 5. Get Top Rated Movies/TV
  async getTopRated() {
    const key = getApiKey();
    if (key) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated?api_key=${key}`);
        return response.data.results.map(item => normalizeItem(item, 'movie')).slice(0, 12);
      } catch (err) {
        console.error("TMDB Top Rated failed, falling back to mock", err);
      }
    }
    // Mock fallback: sort by vote_average descending
    return [...mockMedia].sort((a, b) => b.vote_average - a.vote_average).slice(0, 12).map(item => normalizeItem(item));
  },

  // 6. Get Genre-specific media row
  async getGenreRow(genreName, mediaType = 'movie') {
    const key = getApiKey();
    if (key) {
      try {
        const ids = GENRE_NAME_TO_ID[genreName] || [];
        if (ids.length > 0) {
          // Discover with genre id
          const response = await axios.get(`${TMDB_BASE_URL}/discover/${mediaType}?api_key=${key}&with_genres=${ids[0]}`);
          return response.data.results.map(item => normalizeItem(item, mediaType));
        }
      } catch (err) {
        console.error(`TMDB Genre row ${genreName} failed, falling back to mock`, err);
      }
    }
    // Mock fallback: filter mockMedia containing the genreName in their genres array and matching the type
    return mockMedia.filter(m => m.genres.includes(genreName) && m.type === mediaType).map(item => normalizeItem(item, mediaType));
  },

  // 7. Get full item details (actors, directors, video trailers, etc.)
  async getDetails(id, type = 'movie') {
    const key = getApiKey();
    if (key) {
      try {
        // Fetch base details, credits, and videos
        const detailsRes = await axios.get(`${TMDB_BASE_URL}/${type}/${id}?api_key=${key}`);
        const creditsRes = await axios.get(`${TMDB_BASE_URL}/${type}/${id}/credits?api_key=${key}`);
        const videosRes = await axios.get(`${TMDB_BASE_URL}/${type}/${id}/videos?api_key=${key}`);

        const item = detailsRes.data;
        const credits = creditsRes.data;
        const videos = videosRes.data.results || [];

        // Extract cast names
        const cast = credits.cast ? credits.cast.slice(0, 5).map(c => c.name) : [];
        
        // Extract director
        let director = '';
        if (credits.crew) {
          const dirObj = credits.crew.find(c => c.job === 'Director' || c.job === 'Executive Producer');
          director = dirObj ? dirObj.name : '';
        }

        // Find YouTube trailer key
        console.log("VIDEOS:", videos);
        const trailer =
  videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
  videos.find(v => v.site === 'YouTube' && v.type === 'Teaser') ||
  videos.find(v => v.site === 'YouTube');
        const trailer_url = trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';

        const normalized = normalizeItem(item, type);
        return {
          ...normalized,
          cast,
          director,
          trailer_url
        };
      } catch (err) {
        console.error(`TMDB details for ${type} id ${id} failed, falling back to mock`, err);
      }
    }

    // Mock fallback: lookup by ID
    // Since mockMedia IDs are numeric 1..52, we parse the ID.
    const itemId = parseInt(id);
    const mock = mockMedia.find(m => m.id === itemId);
    if (mock) {
      return normalizeItem(mock);
    }
    
    // In case TMDB is inactive and we clicked a card that had a different numeric id (e.g. from TMDB popular previously)
    // Return a random mock item as fallback
    return normalizeItem(mockMedia[Math.floor(Math.random() * mockMedia.length)]);
  },

  // 8. Search movies/TV shows
  async search(query, page = 1) {
    const key = getApiKey();
    if (key) {
      try {
        const response = await axios.get(`${TMDB_BASE_URL}/search/multi?api_key=${key}&query=${encodeURIComponent(query)}&page=${page}`);
        return {
          results: response.data.results
            .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
            .map(item => normalizeItem(item)),
          total_pages: response.data.total_pages
        };
      } catch (err) {
        console.error("TMDB search failed, falling back to mock", err);
      }
    }

    // Mock fallback: search query string in title or overview
    const lowerQuery = query.toLowerCase();
    const matches = mockMedia.filter(m => 
      m.title.toLowerCase().includes(lowerQuery) || 
      m.overview.toLowerCase().includes(lowerQuery)
    );
    
    const start = (page - 1) * 10;
    return {
      results: matches.slice(start, start + 10).map(item => normalizeItem(item)),
      total_pages: Math.ceil(matches.length / 10)
    };
  }
};
