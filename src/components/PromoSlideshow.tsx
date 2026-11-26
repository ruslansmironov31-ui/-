import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { CategoryId, Language, PROMO_SLIDES, UI_TEXT } from '../data/storeConfig';

interface PromoSlideshowProps {
  lang: Language;
  onSelectCategory: (cat: CategoryId | 'all') => void;
}

export const PromoSlideshow: React.FC<PromoSlideshowProps> = ({ lang, onSelectCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const t = UI_TEXT[lang];
  const slides = PROMO_SLIDES;

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isPaused || prefersReduced) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  const slide = slides[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section
      aria-label="Акции Sushi Store"
      className="mx-auto max-w-6xl px-3 sm:px-4 pt-4 sm:pt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
          {/* Text column */}
          <div className="md:col-span-7 p-5 sm:p-8 flex flex-col justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-red-600">
                {slide.badge[lang]}
              </p>
              <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-neutral-900 leading-tight [text-wrap:balance]">
                {slide.title[lang]}
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
                {slide.subtitle[lang]}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => onSelectCategory(slide.targetCategory)}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{slide.cta[lang]}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              {/* Controls: arrows + slide dots */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={t.prevSlide}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5 px-1">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`${idx + 1} / ${slides.length}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex ? 'w-6 bg-red-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={t.nextSlide}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Image column */}
          <div className="md:col-span-5 relative min-h-[180px] sm:min-h-[220px] md:min-h-[270px] bg-neutral-100">
            <img
              src={slide.image}
              alt={slide.title[lang]}
              loading={activeIndex === 0 ? 'eager' : 'lazy'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover md:absolute md:inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
