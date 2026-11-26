import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  MapPin,
  Phone,
  Search,
  ShoppingBag,
  Clock,
  Instagram,
  X,
  ChevronDown,
  Truck,
} from 'lucide-react';
import {
  BRANCHES,
  CATEGORIES,
  CategoryId,
  CityId,
  DELIVERY_CONFIG,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  Language,
  MENU_ITEMS,
  UI_TEXT,
} from './data/storeConfig';
import { SushiLogo } from './components/SushiLogo';
import { CityModal } from './components/CityModal';
import { PromoSlideshow } from './components/PromoSlideshow';
import { MenuCard } from './components/MenuCard';
import { CartDrawer, CartEntry } from './components/CartDrawer';

const STORAGE_CITY_KEY = 'sushistore_city';
const STORAGE_LANG_KEY = 'sushistore_lang';
const STORAGE_CART_KEY = 'sushistore_cart';

function WhatsAppIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.004 3.2C8.94 3.2 3.2 8.94 3.2 16.004c0 2.26.59 4.464 1.71 6.405L3.1 28.8l6.548-1.716a12.75 12.75 0 0 0 6.356 1.688h.005c7.06 0 12.795-5.74 12.795-12.804C28.804 8.94 23.068 3.2 16.004 3.2Zm7.45 18.203c-.315.887-1.825 1.694-2.52 1.797-.646.096-1.462.136-2.36-.149-.544-.173-1.244-.404-2.138-.79-3.763-1.625-6.22-5.417-6.408-5.667-.188-.25-1.53-2.036-1.53-3.884 0-1.848.968-2.756 1.31-3.13.344-.376.75-.47 1-.47h.72c.23 0 .54-.087.845.645.313.75 1.064 2.596 1.158 2.785.094.188.156.407.031.657-.125.25-.188.407-.376.626-.187.22-.394.49-.562.658-.188.187-.384.39-.165.766.22.375.975 1.608 2.094 2.606 1.438 1.282 2.651 1.68 3.027 1.867.375.188.594.157.813-.094.22-.25.939-1.095 1.189-1.47.25-.376.5-.313.845-.188.344.125 2.189 1.032 2.565 1.22.375.188.625.281.719.438.094.156.094.906-.22 1.793Z" />
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      return saved === 'ky' ? 'ky' : 'ru';
    } catch {
      return 'ru';
    }
  });

  const [city, setCity] = useState<CityId | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CITY_KEY);
      return saved === 'kyzyl-kiya' || saved === 'kadamjay' ? saved : null;
    } catch {
      return null;
    }
  });

  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const catalogRef = useRef<HTMLElement | null>(null);

  const [cart, setCart] = useState<CartEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (city === null) {
      setIsCityModalOpen(true);
    }
  }, [city]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore storage failure
    }
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (city) {
      try {
        localStorage.setItem(STORAGE_CITY_KEY, city);
      } catch {
        // ignore storage failure
      }
    }
  }, [city]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage failure
    }
  }, [cart]);

  const activeCity: CityId = city ?? 'kyzyl-kiya';
  const branch = BRANCHES[activeCity];
  const t = UI_TEXT[lang];
  const currency = DELIVERY_CONFIG.currency[lang];

  const handleSelectCity = (nextCity: CityId) => {
    setCity(nextCity);
    setIsCityModalOpen(false);
  };

  const handleAddToCart = (itemId: string, variantId?: string) => {
    const key = `${itemId}::${variantId || 'base'}`;
    setCart((prev) => {
      const existing = prev.find((c) => c.key === key);
      if (existing) {
        return prev.map((c) => (c.key === key ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { key, itemId, variantId, quantity: 1 }];
    });
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.key === key ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const { totalCount, subtotal } = useMemo(() => {
    let count = 0;
    let sum = 0;
    cart.forEach((entry) => {
      const item = MENU_ITEMS.find((m) => m.id === entry.itemId);
      if (!item) return;
      const variant = entry.variantId
        ? item.variants?.find((v) => v.id === entry.variantId)
        : item.variants?.[0];
      const unitPrice = variant ? variant.price : item.price;
      count += entry.quantity;
      sum += unitPrice * entry.quantity;
    });
    return { totalCount: count, subtotal: sum };
  }, [cart]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    MENU_ITEMS.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, []);

  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length > 0;

  const filteredItems = useMemo(() => {
    const q = trimmedQuery.toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (q) {
        return (
          item.name.ru.toLowerCase().includes(q) ||
          item.name.ky.toLowerCase().includes(q) ||
          item.description.ru.toLowerCase().includes(q) ||
          item.description.ky.toLowerCase().includes(q) ||
          (item.meta?.ru.toLowerCase().includes(q) ?? false) ||
          (item.meta?.ky.toLowerCase().includes(q) ?? false)
        );
      }
      return activeCategory === 'all' || item.category === activeCategory;
    });
  }, [activeCategory, trimmedQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSelectCategoryAndScroll = (cat: CategoryId | 'all') => {
    setSearchQuery('');
    setActiveCategory(cat);
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const quickWhatsappHref = `https://wa.me/${branch.whatsappNumber}`;

  return (
    <div className="min-h-screen bg-white text-neutral-900 pb-36 md:pb-24">
      {/* Top Info Strip: completely hidden on mobile (<768px), visible on desktop (>=768px) */}
      <div className="hidden md:block border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-1.5 min-w-0">
            <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
            <span>{t.topBarDelivery}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0" role="group" aria-label="Language">
            <button
              type="button"
              onClick={() => setLang('ru')}
              className={`min-h-[28px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                lang === 'ru'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              RU
            </button>
            <button
              type="button"
              onClick={() => setLang('ky')}
              className={`min-h-[28px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                lang === 'ky'
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              KY
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Header: 2 clean rows on mobile (<768px), 1 row on desktop (>=768px) */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          {/* Mobile Header (<768px) */}
          <div className="md:hidden py-2 space-y-2">
            {/* Row 1: Logo left, compact RU/KY + Cart with sum right */}
            <div className="flex items-center justify-between gap-2">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="shrink-0"
              >
                <SushiLogo compact />
              </a>

              <div className="flex items-center gap-1.5 shrink-0">
                <div
                  className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 text-[11px] font-semibold"
                  role="group"
                  aria-label="Language"
                >
                  <button
                    type="button"
                    onClick={() => setLang('ru')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      lang === 'ru'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    RU
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('ky')}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      lang === 'ky'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    KY
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="tabular-nums">
                    {totalCount > 0 ? `${subtotal} ${currency}` : `0 ${currency}`}
                  </span>
                </button>
              </div>
            </div>

            {/* Row 2: City selector + Search */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setIsCityModalOpen(true)}
                className="min-h-[40px] inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title={t.switchCity}
              >
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{branch.name[lang]}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative flex-1 min-w-0">
                <button
                  type="submit"
                  aria-label={t.searchButtonLabel}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-red-600 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  aria-label={t.searchPlaceholder}
                  className="w-full min-h-[40px] pl-9 pr-8 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-600"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label={t.clearSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-neutral-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Desktop Header (1 row, >=768px) */}
          <div className="hidden md:flex h-16 items-center justify-between gap-4">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="shrink-0"
            >
              <SushiLogo />
            </a>

            <div className="flex items-center gap-3 lg:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => setIsCityModalOpen(true)}
                className="min-h-[42px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-sm font-semibold text-neutral-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title={t.switchCity}
              >
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>{branch.name[lang]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              </button>

              <form onSubmit={handleSearchSubmit} className="relative w-56 lg:w-72">
                <button
                  type="submit"
                  aria-label={t.searchButtonLabel}
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-red-600 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  aria-label={t.searchPlaceholder}
                  className="w-full min-h-[42px] pl-9 pr-8 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-red-600"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label={t.clearSearch}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-neutral-400 hover:text-neutral-800 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              <a
                href={branch.phoneHref}
                className="hidden lg:inline-flex items-center gap-1.5 text-sm font-bold text-neutral-900 hover:text-red-600 transition-colors whitespace-nowrap shrink-0 tabular-nums"
              >
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span>{branch.phoneDisplay}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{t.cartButtonShort}</span>
              <span className="tabular-nums">
                {totalCount > 0 ? `${subtotal} ${currency}` : `0 ${currency}`}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Promo Slideshow Banner (kept as-is) */}
        <PromoSlideshow lang={lang} onSelectCategory={handleSelectCategoryAndScroll} />

        {/* Category Showcase Cards */}
        {!isSearching && (
          <section
            className="mx-auto max-w-6xl px-3 sm:px-4 pt-8 sm:pt-10"
            aria-labelledby="categories-heading"
          >
            <div className="flex flex-wrap items-end justify-between gap-2 mb-4 sm:mb-5">
              <div>
                <h2
                  id="categories-heading"
                  className="font-display text-xl sm:text-2xl font-bold text-neutral-900"
                >
                  {t.menuHeading}
                </h2>
                <p className="mt-0.5 text-sm text-neutral-500">{t.menuSubheading}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategoryAndScroll(cat.id)}
                    className={`group text-left rounded-2xl border overflow-hidden transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-red-600 ${
                      isSelected
                        ? 'border-red-600 ring-1 ring-red-600 bg-red-50/30'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                      <img
                        src={cat.image}
                        alt={cat.title[lang]}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="p-3 sm:p-3.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-display text-sm sm:text-base font-bold text-neutral-900 truncate">
                          {cat.title[lang]}
                        </h3>
                        <span className="text-xs text-neutral-500 tabular-nums shrink-0">
                          {t.itemsCount(categoryCounts[cat.id] || 0)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-neutral-500 truncate hidden sm:block">
                        {cat.subtitle[lang]}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Menu Filter Bar & Catalog Grid */}
        <section
          id="menu-catalog"
          ref={catalogRef}
          className="mx-auto max-w-6xl px-3 sm:px-4 pt-8 sm:pt-10 scroll-mt-28 md:scroll-mt-20"
          aria-labelledby="dishes-heading"
        >
          <div className="flex flex-col gap-3 border-b border-neutral-200 pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="dishes-heading"
                className="font-display text-xl sm:text-2xl font-bold text-neutral-900"
              >
                {isSearching ? t.searchResultsHeading(trimmedQuery) : t.dishesHeading}
              </h2>

              {isSearching && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="min-h-[36px] px-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer"
                >
                  {t.resetFilters}
                </button>
              )}
            </div>

            <div
              className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
              role="tablist"
              aria-label={t.menuHeading}
            >
              <button
                type="button"
                role="tab"
                aria-selected={!isSearching && activeCategory === 'all'}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  !isSearching && activeCategory === 'all'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {t.allCategories}
              </button>
              {CATEGORIES.map((cat) => {
                const isSelected = !isSearching && activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory(cat.id);
                    }}
                    className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {cat.title[lang]}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="my-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 sm:p-8 text-center">
              <h3 className="font-display text-lg font-bold text-neutral-900">
                {t.nothingFoundTitle}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-600">{t.nothingFoundSubtitle}</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-4 min-h-[44px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {t.resetFilters}
              </button>
            </div>
          ) : !isSearching && activeCategory === 'all' ? (
            <div className="space-y-10 pt-6">
              {CATEGORIES.map((cat) => {
                const itemsInCat = filteredItems.filter((i) => i.category === cat.id);
                if (itemsInCat.length === 0) return null;
                return (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg sm:text-xl font-bold text-neutral-900">
                        {cat.title[lang]}
                      </h3>
                      <span className="text-xs font-medium text-neutral-500 tabular-nums">
                        {t.itemsCount(itemsInCat.length)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {itemsInCat.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          lang={lang}
                          cart={cart}
                          onAdd={handleAddToCart}
                          onUpdateQty={handleUpdateQty}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  lang={lang}
                  cart={cart}
                  onAdd={handleAddToCart}
                  onUpdateQty={handleUpdateQty}
                />
              ))}
            </div>
          )}
        </section>

        {/* Branches, Contacts & Delivery Conditions */}
        <section
          id="contacts"
          className="mx-auto max-w-6xl px-3 sm:px-4 pt-12 sm:pt-16 pb-6"
          aria-labelledby="contacts-heading"
        >
          <div className="border-t border-neutral-200 pt-10">
            <h2
              id="contacts-heading"
              className="font-display text-xl sm:text-2xl font-bold text-neutral-900"
            >
              {t.contactsTitle}
            </h2>
            <p className="mt-1 text-sm text-neutral-600">{t.contactsSubtitle}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {([BRANCHES['kyzyl-kiya'], BRANCHES.kadamjay] as const).map((b) => {
                const isActive = activeCity === b.id;
                return (
                  <div
                    key={b.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 ${
                      isActive ? 'border-red-600 bg-red-50/20' : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-lg font-bold text-neutral-900">
                          {b.name[lang]}
                        </h3>
                        {isActive && (
                          <span className="text-xs font-semibold text-red-600">
                            {t.selectedCityActive}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-neutral-600 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{b.address[lang]}</span>
                      </p>
                      <p className="mt-1.5 text-sm text-neutral-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                        <span>{b.hours[lang]}</span>
                      </p>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex flex-wrap gap-2">
                      <a
                        href={b.phoneHref}
                        className="min-h-[44px] flex-1 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-sm font-semibold text-neutral-900 transition-colors tabular-nums whitespace-nowrap"
                      >
                        <Phone className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{b.phoneDisplay}</span>
                      </a>
                      <a
                        href={`https://wa.me/${b.whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-semibold transition-colors whitespace-nowrap"
                      >
                        <WhatsAppIcon className="w-4 h-4 shrink-0" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}

              {/* Delivery Terms & Instagram Card */}
              <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-neutral-900">
                    <Truck className="w-5 h-5 text-red-600 shrink-0" />
                    <h3 className="font-display text-lg font-bold">{t.deliveryTermsTitle}</h3>
                  </div>
                  <p className="mt-2.5 text-sm text-neutral-600 leading-relaxed">
                    {t.deliveryTermsBody}
                  </p>
                </div>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-sm font-semibold text-neutral-900 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-red-600 shrink-0" />
                  <span>@{INSTAGRAM_HANDLE}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer (extra right padding so floating buttons never cover text) */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 pr-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} Sushi Store · take away or order</span>
          <span>
            {BRANCHES['kyzyl-kiya'].name[lang]} ({BRANCHES['kyzyl-kiya'].phoneDisplay}) ·{' '}
            {BRANCHES.kadamjay.name[lang]} ({BRANCHES.kadamjay.phoneDisplay})
          </span>
        </div>
      </footer>

      {/* Floating Call & WhatsApp buttons: fixed right 12px, bottom 16px + safe-area, 48x48px, always visible on first screen */}
      <div
        className="fixed right-[12px] z-40 flex flex-col gap-2.5"
        style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        <a
          href={branch.phoneHref}
          aria-label={`${t.callBtn}: ${branch.phoneDisplay}`}
          title={`${t.callBtn}: ${branch.phoneDisplay}`}
          className="h-12 w-12 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-lg flex items-center justify-center transition-colors"
        >
          <Phone className="w-5 h-5" />
        </a>
        <a
          href={quickWhatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.whatsappBtn}: ${branch.name[lang]}`}
          title={`${t.whatsappBtn}: ${branch.name[lang]}`}
          className="h-12 w-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-lg flex items-center justify-center transition-colors"
        >
          <WhatsAppIcon className="w-6 h-6" />
        </a>
      </div>

      {/* Mobile Sticky Bottom Cart Pill (sits cleanly to the left of floating Call/WhatsApp buttons) */}
      {totalCount > 0 && (
        <div
          className="md:hidden fixed left-3 right-[76px] z-30"
          style={{ bottom: 'calc(16px + env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 shadow-lg flex items-center justify-between text-sm font-semibold transition-colors cursor-pointer"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>
                {t.cartButtonShort} ({totalCount})
              </span>
            </span>
            <span className="tabular-nums font-bold">
              {subtotal} {currency}
            </span>
          </button>
        </div>
      )}

      {/* City Selection Modal */}
      <CityModal
        isOpen={isCityModalOpen}
        lang={lang}
        currentCity={city}
        canClose={city !== null}
        onSelectCity={handleSelectCity}
        onClose={() => setIsCityModalOpen(false)}
      />

      {/* Cart & WhatsApp Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        lang={lang}
        branch={branch}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
