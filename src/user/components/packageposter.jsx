// Packageposter.jsx

import React from "react";

const Packageposter = ({ onBuildPackage }) => {
  return (
    <section id="packages" className="relative min-h-[100svh] w-full overflow-hidden">
      
      {/* Background Poster */}
      <img
        src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1974&auto=format&fit=crop"
        alt="Wedding"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4 py-20 text-center">
        
        <h1 className="mb-5 max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl">
          Create Your Dream Wedding Package
        </h1>

        <p className="mb-8 max-w-2xl text-sm leading-6 text-white/80 sm:text-lg">
          Select photographers, videographers, drone shots, and events
          according to your wedding dates.
        </p>

        {/* Button */}
        <button
          onClick={onBuildPackage}
          className="group relative max-w-full overflow-hidden rounded-full border border-white bg-white px-6 py-3 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-transparent hover:text-white sm:px-8 sm:py-4 sm:text-lg"
        >
          
          {/* Glow */}
          <span className="absolute inset-0 -z-10 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100"></span>

          Build Your Package
        </button>
      </div>
    </section>
  );
};

export default Packageposter;
