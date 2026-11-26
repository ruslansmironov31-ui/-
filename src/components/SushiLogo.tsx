import React from 'react';

interface SushiLogoProps {
  compact?: boolean;
}

export const SushiLogo: React.FC<SushiLogoProps> = ({ compact = false }) => {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none">
      <svg
        width="38"
        height="38"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Outer circle */}
        <circle cx="32" cy="32" r="29" fill="#FFFFFF" stroke="#18181B" strokeWidth="2.5" />
        {/* Red Yin-Yang fish half (right/bottom) */}
        <path
          d="M32 3C48.0163 3 61 15.9837 61 32C61 48.0163 48.0163 61 32 61C23.9919 61 17.5 54.5081 17.5 46.5C17.5 38.4919 23.9919 32 32 32C40.0081 32 46.5 25.5081 46.5 17.5C46.5 9.49187 40.0081 3 32 3Z"
          fill="#DC2626"
        />
        {/* White fish fin accent */}
        <path
          d="M17 20C14 23 13.5 27 16 29.5C17.5 27.5 19.5 26 21 25"
          stroke="#18181B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Red fish tail/fin subtle stroke */}
        <path
          d="M46.5 39C49.5 36 50.5 32 48.5 29"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Fish eyes */}
        <circle cx="32" cy="17.5" r="3" fill="#18181B" />
        <circle cx="33" cy="16.8" r="0.9" fill="#FFFFFF" />
        <circle cx="32" cy="46.5" r="3" fill="#FFFFFF" />
        <circle cx="31" cy="45.8" r="0.9" fill="#18181B" />
        {/* Dividing curve */}
        <path
          d="M32 3C40.0081 3 46.5 9.49187 46.5 17.5C46.5 25.5081 40.0081 32 32 32C23.9919 32 17.5 38.4919 17.5 46.5C17.5 54.5081 23.9919 61 32 61"
          stroke="#18181B"
          strokeWidth="2.2"
        />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900">
          <span className="text-red-600">Суши</span>
          <span>Store</span>
        </span>
        {!compact && (
          <span className="text-[11px] font-medium text-neutral-500 tracking-tight mt-0.5">
            take away or order
          </span>
        )}
      </div>
    </div>
  );
};
