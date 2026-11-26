import React, { useMemo, useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MessageCircle,
  Copy,
  Check,
  ShoppingBag,
  MapPin,
  Truck,
  Store,
  Clock,
} from 'lucide-react';
import {
  BranchConfig,
  DELIVERY_CONFIG,
  Language,
  MENU_ITEMS,
  UI_TEXT,
} from '../data/storeConfig';

export interface CartEntry {
  key: string;
  itemId: string;
  variantId?: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  lang: Language;
  branch: BranchConfig;
  cart: CartEntry[];
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  lang,
  branch,
  cart,
  onClose,
  onUpdateQty,
  onClearCart,
}) => {
  const t = UI_TEXT[lang];
  const currency = DELIVERY_CONFIG.currency[lang];

  const [customerName, setCustomerName] = useState('');
  const [receiveMethod, setReceiveMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [comment, setComment] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const resolvedItems = useMemo(() => {
    return cart
      .map((entry) => {
        const item = MENU_ITEMS.find((m) => m.id === entry.itemId);
        if (!item) return null;
        const variant = entry.variantId
          ? item.variants?.find((v) => v.id === entry.variantId)
          : item.variants?.[0];
        const unitPrice = variant ? variant.price : item.price;
        const displayName = variant
          ? `${item.name[lang]} (${variant.label[lang]})`
          : item.name[lang];
        const ruName = variant
          ? `${item.name.ru} (${variant.label.ru})`
          : item.name.ru;
        return {
          key: entry.key,
          name: displayName,
          ruName,
          unitPrice,
          quantity: entry.quantity,
          lineTotal: unitPrice * entry.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [cart, lang]);

  const subtotal = useMemo(
    () => resolvedItems.reduce((sum, row) => sum + row.lineTotal, 0),
    [resolvedItems]
  );

  const deliveryFee =
    receiveMethod === 'pickup' || subtotal === 0 || subtotal >= DELIVERY_CONFIG.freeFrom
      ? 0
      : DELIVERY_CONFIG.fee;

  const total = subtotal + deliveryFee;
  const remainingForFree = Math.max(0, DELIVERY_CONFIG.freeFrom - subtotal);

  // Текст заказа в WhatsApp всегда на русском по заданному формату
  const whatsappText = useMemo(() => {
    const lines: string[] = [];
    lines.push('Новый заказ с сайта Sushi Store');
    lines.push(`Город: ${branch.name.ru}`);
    if (customerName.trim()) {
      lines.push(`Имя: ${customerName.trim()}`);
    }
    lines.push(`Способ: ${receiveMethod === 'delivery' ? 'Доставка' : 'Самовывоз'}`);
    if (receiveMethod === 'delivery') {
      lines.push(`Адрес: ${address.trim()}`);
    }
    lines.push('Блюда:');
    resolvedItems.forEach((item) => {
      lines.push(`${item.ruName} × ${item.quantity} — ${item.lineTotal} сом`);
    });
    if (receiveMethod === 'delivery') {
      lines.push(`Доставка: ${deliveryFee === 0 ? 'бесплатно' : `${deliveryFee} сом`}`);
    }
    lines.push(`Итого: ${total} сом`);
    lines.push(`Оплата: ${paymentMethod === 'cash' ? 'Наличные' : 'Перевод'}`);
    if (comment.trim()) {
      lines.push(`Комментарий: ${comment.trim()}`);
    }
    return lines.join('\n');
  }, [
    address,
    branch.name.ru,
    comment,
    customerName,
    deliveryFee,
    paymentMethod,
    receiveMethod,
    resolvedItems,
    total,
  ]);

  const whatsappUrl = `https://wa.me/${branch.whatsappNumber}?text=${encodeURIComponent(
    whatsappText
  )}`;

  const canSubmit =
    resolvedItems.length > 0 &&
    (receiveMethod === 'pickup' || address.trim().length > 0);

  const handleOrderClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!canSubmit) {
      e.preventDefault();
      return;
    }
    setOrderSubmitted(true);
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard errors gracefully
    }
  };

  const handleConfirmSentAndClear = () => {
    setOrderSubmitted(false);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label={t.cartTitle}
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="font-display text-lg font-bold text-neutral-900">
              {t.cartTitle} · {branch.name[lang]}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {resolvedItems.length > 0 && !orderSubmitted && (
              <button
                type="button"
                onClick={onClearCart}
                className="min-h-[44px] px-3 text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                {t.clearCart}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {resolvedItems.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg font-bold text-neutral-900">
                {t.cartEmptyTitle}
              </h3>
              <p className="mt-1.5 text-sm text-neutral-600 max-w-xs mx-auto">
                {t.cartEmptySubtitle}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 min-h-[44px] px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                {t.goToMenu}
              </button>
            </div>
          ) : orderSubmitted ? (
            <div className="py-4 space-y-5">
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                <p className="font-display text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                  {t.orderSentHint}
                </p>
                <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
                  {t.orderReadySubtitle}
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-semibold transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {t.openWhatsappAgain} ({branch.phoneDisplay})
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyText}
                    className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copied ? t.copiedFeedback : t.copyOrderBtn}</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <pre className="whitespace-pre-wrap font-sans text-xs text-neutral-700 leading-relaxed">
                  {whatsappText}
                </pre>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleConfirmSentAndClear}
                  className="min-h-[48px] w-full rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  {t.orderSentConfirmBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setOrderSubmitted(false)}
                  className="min-h-[44px] w-full rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-sm font-medium transition-colors cursor-pointer"
                >
                  {t.backToCartEditBtn}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="divide-y divide-neutral-100">
                {resolvedItems.map((row) => (
                  <div key={row.key} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 leading-snug">
                        {row.name}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500 tabular-nums">
                        {row.unitPrice} {currency} × {row.quantity} ={' '}
                        <span className="font-semibold text-neutral-800">
                          {row.lineTotal} {currency}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQty(row.key, -1)}
                        aria-label="-"
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        {row.quantity === 1 ? (
                          <Trash2 className="w-4 h-4 text-neutral-500" />
                        ) : (
                          <Minus className="w-4 h-4" />
                        )}
                      </button>
                      <span className="w-7 text-center text-sm font-bold tabular-nums">
                        {row.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQty(row.key, 1)}
                        aria-label="+"
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Threshold Progress */}
              {receiveMethod === 'delivery' && (
                <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3.5">
                  <div className="flex items-center justify-between gap-2 text-xs font-medium">
                    <span className={remainingForFree === 0 ? 'text-emerald-700' : 'text-neutral-700'}>
                      {remainingForFree === 0
                        ? t.freeDeliveryAchieved
                        : t.freeDeliveryHint(remainingForFree)}
                    </span>
                    <span className="text-neutral-500 tabular-nums shrink-0">
                      {Math.min(subtotal, DELIVERY_CONFIG.freeFrom)} / {DELIVERY_CONFIG.freeFrom}{' '}
                      {currency}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className={`h-full transition-all ${
                        remainingForFree === 0 ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((subtotal / DELIVERY_CONFIG.freeFrom) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Simplified Checkout Form (no Phone field; Name optional; Address only when Delivery) */}
              <div className="space-y-4 pt-2 border-t border-neutral-200">
                <h3 className="font-display text-base font-bold text-neutral-900">
                  {t.orderFormTitle}
                </h3>

                {/* Optional Name */}
                <div>
                  <label
                    htmlFor="order-name"
                    className="block text-xs font-semibold text-neutral-700 mb-1"
                  >
                    {t.nameLabel}
                  </label>
                  <input
                    id="order-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full min-h-[44px] rounded-xl border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                  />
                </div>

                {/* Delivery / Pickup Toggle */}
                <div>
                  <span className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    {t.receiveMethodLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100">
                    <button
                      type="button"
                      onClick={() => setReceiveMethod('delivery')}
                      className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        receiveMethod === 'delivery'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>{t.deliveryOption}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReceiveMethod('pickup')}
                      className={`min-h-[44px] flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        receiveMethod === 'pickup'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>{t.pickupOption}</span>
                    </button>
                  </div>
                </div>

                {/* Address (only when Delivery) OR Pickup branch address info */}
                {receiveMethod === 'delivery' ? (
                  <div>
                    <label
                      htmlFor="order-address"
                      className="block text-xs font-semibold text-neutral-700 mb-1"
                    >
                      {t.addressLabel} *
                    </label>
                    <input
                      id="order-address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.addressPlaceholder}
                      className="w-full min-h-[44px] rounded-xl border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600"
                    />
                    {!address.trim() && (
                      <p className="mt-1 text-xs text-neutral-500">{t.errAddress}</p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-neutral-700 leading-relaxed">
                      <span className="font-semibold text-neutral-900">
                        {t.pickupAddressPrefix}
                      </span>{' '}
                      {branch.address[lang]}
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <span className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    {t.paymentMethodLabel}
                  </span>
                  <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-neutral-100">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`min-h-[44px] px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {t.cashOption}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`min-h-[44px] px-3 rounded-lg text-sm font-semibold transition-colors cursor-pointer truncate ${
                        paymentMethod === 'transfer'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {t.transferOption}
                    </button>
                  </div>
                </div>

                {/* Optional Comment */}
                <div>
                  <label
                    htmlFor="order-comment"
                    className="block text-xs font-semibold text-neutral-700 mb-1"
                  >
                    {t.commentLabel}
                  </label>
                  <textarea
                    id="order-comment"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t.commentPlaceholder}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer Totals + Working hours/delivery conditions + WhatsApp CTA */}
        {resolvedItems.length > 0 && !orderSubmitted && (
          <div className="border-t border-neutral-200 bg-white px-5 py-4 space-y-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>{t.subtotal}</span>
                <span className="tabular-nums font-medium text-neutral-900">
                  {subtotal} {currency}
                </span>
              </div>
              {receiveMethod === 'delivery' && (
                <div className="flex justify-between text-neutral-600">
                  <span>{t.deliveryLabel}</span>
                  <span
                    className={`tabular-nums font-medium ${
                      deliveryFee === 0 ? 'text-emerald-700' : 'text-neutral-900'
                    }`}
                  >
                    {deliveryFee === 0 ? t.deliveryFree : `${deliveryFee} ${currency}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between pt-1.5 border-t border-neutral-100 text-base font-bold text-neutral-900">
                <span>{t.totalLabel}</span>
                <span className="tabular-nums text-red-600">
                  {total} {currency}
                </span>
              </div>
              <p className="pt-1 text-[11px] text-neutral-500 flex items-start gap-1.5 leading-snug">
                <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                <span>{t.cartTermsNote}</span>
              </p>
            </div>

            {canSubmit ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                className="min-h-[48px] w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm sm:text-base font-semibold transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>{t.orderWhatsappBtn}</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="min-h-[48px] w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-200 text-neutral-500 text-sm sm:text-base font-semibold cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5 shrink-0" />
                <span>{t.orderWhatsappBtn}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
