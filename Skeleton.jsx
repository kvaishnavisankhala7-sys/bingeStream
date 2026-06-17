import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-[2/3] rounded-lg bg-zinc-800 animate-pulse overflow-hidden">
      <div className="w-full h-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]" />
    </div>
  );
};

export const RowSkeleton = ({ count = 6 }) => {
  return (
    <div className="flex gap-4 overflow-hidden py-4 px-4 sm:px-12">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const GridSkeleton = ({ count = 10 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 px-4 sm:px-12 py-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-full aspect-[2/3] rounded-lg bg-zinc-800 animate-pulse overflow-hidden" />
      ))}
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="w-full h-[55vh] sm:h-[70vh] md:h-[85vh] bg-zinc-900 animate-pulse flex flex-col justify-end p-6 sm:p-16">
      <div className="w-1/3 h-8 sm:h-12 bg-zinc-800 rounded mb-4" />
      <div className="w-1/4 h-5 bg-zinc-800 rounded mb-4" />
      <div className="w-2/3 max-w-xl h-20 bg-zinc-800 rounded mb-6" />
      <div className="flex gap-4">
        <div className="w-32 h-12 bg-zinc-800 rounded-md" />
        <div className="w-32 h-12 bg-zinc-800 rounded-md" />
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="w-full max-w-5xl rounded-2xl bg-zinc-900 overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-none overflow-y-auto animate-pulse">
      <div className="w-full md:w-2/5 aspect-[2/3] bg-zinc-800" />
      <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          <div className="w-3/4 h-10 bg-zinc-800 rounded mb-4" />
          <div className="flex gap-3 mb-6">
            <div className="w-16 h-5 bg-zinc-800 rounded" />
            <div className="w-16 h-5 bg-zinc-800 rounded" />
            <div className="w-16 h-5 bg-zinc-800 rounded" />
          </div>
          <div className="w-full h-24 bg-zinc-800 rounded mb-6" />
          <div className="space-y-3">
            <div className="w-1/2 h-5 bg-zinc-800 rounded" />
            <div className="w-1/3 h-5 bg-zinc-800 rounded" />
          </div>
        </div>
        <div className="mt-8 flex gap-4">
          <div className="w-32 h-12 bg-zinc-800 rounded-md" />
          <div className="w-32 h-12 bg-zinc-800 rounded-md" />
        </div>
      </div>
    </div>
  );
};
