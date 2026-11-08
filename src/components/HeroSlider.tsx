import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft, Sparkles, Link2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroSlider: React.FC = () => {
  const { banners, setCurrentView, setSelectedCategorySlug } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners.filter((b) => b.active);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleBannerClick = () => {
    if (currentBanner.linkType === 'category') {
      setSelectedCategorySlug(currentBanner.linkValue);
      setCurrentView('categories');
    } else if (currentBanner.linkType === 'request') {
      setCurrentView('external-request');
    } else if (currentBanner.linkType === 'custom') {
      setCurrentView(currentBanner.linkValue);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl my-4 bg-[#070F1E] text-white border border-slate-800/80">
      <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] flex items-center">
        {/* Background Image with Deep Obsidian Navy & Gold Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070F1E]/95 via-[#0B1B36]/85 to-[#070F1E]/55" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#D4A853]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 py-10 flex flex-col justify-center items-start w-full">
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-gradient text-[#070F1E] font-black text-xs mb-3.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentBanner.badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3 max-w-2xl drop-shadow-md">
            {currentBanner.title}
          </h2>

          <p className="text-slate-200 text-xs sm:text-sm lg:text-base max-w-xl leading-relaxed mb-6 font-medium">
            {currentBanner.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleBannerClick}
              className="flex items-center gap-2 bg-gold-gradient hover:bg-gold-gradient-hover text-[#070F1E] font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg shadow-[#D4A853]/30 hover:scale-103 active:scale-98 transition-all"
            >
              <span>اكتشف المزيد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('external-request')}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/25 font-bold text-sm px-5 py-3.5 rounded-2xl hover:scale-102 transition-all"
            >
              <Link2 className="w-4 h-4 text-[#F5D68B]" />
              <span>طلب منتج من رابط خارجي</span>
            </button>
          </div>
        </div>

        {/* Slider Controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
              }
              className="absolute right-3 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center transition-all border border-white/10"
              aria-label="Previous banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute left-3 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs flex items-center justify-center transition-all border border-white/10"
              aria-label="Next banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 right-1/2 translate-x-1/2 z-20 flex items-center gap-1.5">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-7 bg-[#D4A853] shadow-xs' : 'w-2 bg-white/40 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
