import React, { useState } from 'react';
import { Plus, Minus, UtensilsCrossed } from 'lucide-react';
import {
  DELIVERY_CONFIG,
  Language,
  MenuItem,
  UI_TEXT,
} from '../data/storeConfig';
import { CartEntry } from './CartDrawer';

interface MenuCardProps {
  item: MenuItem;
  lang: Language;
  cart: CartEntry[];
  onAdd: (itemId: string, variantId?: string) => void;
  onUpdateQty: (key: string, delta: number) => void;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  lang,
  cart,
  onAdd,
  onUpdateQty,
}) => {
  const t = UI_TEXT[lang];
  const currency = DELIVERY_CONFIG.currency[lang];
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    item.variants?.[0]?.id
  );
  const [imgError, setImgError] = useState(false);

  const activeVariant =
    item.variants?.find((v) => v.id === selectedVariantId) ?? item.variants?.[0];
  const displayPrice = activeVariant ? activeVariant.price : item.price;
  const cartKey = `${item.id}::${activeVariant ? activeVariant.id : 'base'}`;
  const cartEntry = cart.find((c) => c.key === cartKey);
  const qty = cartEntry?.quantity ?? 0;

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-shadow hover:shadow-md min-w-0">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden">
        {item.image && !imgError ? (
          <img
            src={item.image}
            alt={item.name[lang]}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-400 p-4 text-center">
            <UtensilsCrossed className="w-7 h-7" />
            <span className="text-xs font-medium text-neutral-500">{item.name[lang]}</span>
          </div>
        )}
      </div>

      {/* Content: Title -> 1 short quantity/weight line -> 1 short composition line -> Price + CTA */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 gap-3 min-w-0">
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold text-neutral-900 leading-snug">
            {item.name[lang]}
          </h3>

          {item.meta && (
            <p className="mt-1 text-xs font-medium text-neutral-500 tabular-nums truncate">
              {item.meta[lang]}
            </p>
          )}

          {item.description[lang] && (
            <p className="mt-1 text-sm text-neutral-600 leading-snug line-clamp-2">
              {item.description[lang]}
            </p>
          )}

          {item.variants && item.variants.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {item.variants.map((variant) => {
                const isSelected = variant.id === activeVariant?.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariantId(variant.id)}
                    className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {variant.label[lang]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price + Action */}
        <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div className="font-display text-lg font-extrabold text-neutral-900 tabular-nums whitespace-nowrap">
            {displayPrice}{' '}
            <span className="text-sm font-semibold text-neutral-600">{currency}</span>
          </div>

          {qty === 0 ? (
            <button
              type="button"
              onClick={() => onAdd(item.id, activeVariant?.id)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.addToCart}
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 p-0.5 shrink-0">
              <button
                type="button"
                onClick={() => onUpdateQty(cartKey, -1)}
                aria-label="-"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-white text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="min-w-[28px] text-center text-sm font-bold text-red-700 tabular-nums">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => onUpdateQty(cartKey, 1)}
                aria-label="+"
                className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
