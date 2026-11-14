import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { INITIAL_BANNERS } from '../data/initialData';

interface HeroSliderProps {
  onNavigate: (view: string, category?: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigate }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % INITIAL_BANNERS.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = INITIAL_BANNERS[current];

  return (
    <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] bg-slate-950 overflow-hidden shadow-xl rounded-2xl mx-auto my-4 max-w-7xl">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-105"
        style={{ backgroundImage: `url(${slide.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#070F1E]/95 via-[#070F1E]/75 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-4xl px-6 sm:px-12 flex flex-col justify-center items-start text-right z-10">
        <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs sm:text-sm font-bold mb-3 backdrop-blur-sm">
          {slide.badge}
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-3">
          {slide.title}
        </h1>
        <p className="text-slate-300 text-xs sm:text-base md:text-lg mb-6 max-w-xl leading-relaxed">
          {slide.subtitle}
        </p>

        <button
          onClick={() => {
            if (slide.categoryLink === 'external-request') {
              onNavigate('external-request');
            } else {
              onNavigate('categories', slide.categoryLink);
            }
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm sm:text-base hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95"
        >
          <span>{slide.ctaText}</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-4 left-6 flex items-center gap-2 z-20">
        {INITIAL_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${
              current === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`الشريحة ${idx + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrent(prev => (prev === 0 ? INITIAL_BANNERS.length - 1 : prev - 1))}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 text-white items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors z-20"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <button
        onClick={() => setCurrent(prev => (prev + 1) % INITIAL_BANNERS.length)}
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 text-white items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition-colors z-20"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
    </div>
  );
};
