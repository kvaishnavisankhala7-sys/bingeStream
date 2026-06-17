import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [quality, setQuality] = useState(() => {
    try {
      return localStorage.getItem('bingestream_quality') || 'Auto';
    } catch (e) {
      return 'Auto';
    }
  });

  const [subtitle, setSubtitle] = useState(() => {
    try {
      return localStorage.getItem('bingestream_subtitle') || 'English';
    } catch (e) {
      return 'English';
    }
  });

  const [tmdbKey, setTmdbKey] = useState(() => {
    try {
      return localStorage.getItem('bingestream_tmdb_key') || '';
    } catch (e) {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bingestream_quality', quality);
    } catch (e) {}
  }, [quality]);

  useEffect(() => {
    try {
      localStorage.setItem('bingestream_subtitle', subtitle);
    } catch (e) {}
  }, [subtitle]);

  useEffect(() => {
    try {
      localStorage.setItem('bingestream_tmdb_key', tmdbKey);
    } catch (e) {}
  }, [tmdbKey]);

  return (
    <SettingsContext.Provider value={{
      quality,
      setQuality,
      subtitle,
      setSubtitle,
      tmdbKey,
      setTmdbKey
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
