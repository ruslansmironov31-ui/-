import React from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { BRANCHES, CityId, Language, UI_TEXT } from '../data/storeConfig';
import { SushiLogo } from './SushiLogo';

interface CityModalProps {
  isOpen: boolean;
  lang: Language;
  currentCity: CityId | null;
  canClose: boolean;
  onSelectCity: (city: CityId) => void;
  onClose: () => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  isOpen,
  lang,
  currentCity,
  canClose,
  onSelectCity,
  onClose,
}) => {
  if (!isOpen) return null;

  const t = UI_TEXT[lang];
  const branchList = [BRANCHES['kyzyl-kiya'], BRANCHES.kadamjay];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="city-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-200">
        <div className="flex items-center justify-between gap-4 mb-4">
          <SushiLogo compact />
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-3 text-sm font-medium text-neutral-500 hover:text-neutral-900 rounded-lg transition-colors"
            >
              {t.close}
            </button>
          )}
        </div>

        <h2 id="city-modal-title" className="font-display text-xl font-bold text-neutral-900">
          {t.chooseCityTitle}
        </h2>
        <p className="mt-1.5 text-sm text-neutral-600 leading-relaxed">
          {t.chooseCitySubtitle}
        </p>

        <div className="mt-5 grid gap-3">
          {branchList.map((branch) => {
            const isSelected = currentCity === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                onClick={() => onSelectCity(branch.id)}
                className={`w-full text-left rounded-xl border p-4 transition-colors min-h-[64px] focus-visible:outline-2 focus-visible:outline-red-600 ${
                  isSelected
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-neutral-200 bg-white hover:border-red-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-bold text-neutral-900">
                    {branch.name[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 tabular-nums">
                    <Phone className="w-4 h-4 shrink-0" />
                    {branch.phoneDisplay}
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1 text-xs text-neutral-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    {branch.address[lang]}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    {branch.hours[lang]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
