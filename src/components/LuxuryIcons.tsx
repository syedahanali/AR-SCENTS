import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const WomenPerfumeIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Cap */}
    <circle cx="12" cy="4" r="2.5" />
    <path d="M10 6.5h4v2h-4z" />
    {/* Bottle Body */}
    <path d="M7 10h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" />
    {/* Label outline inside */}
    <rect x="8.5" y="13" width="7" height="5.5" rx="0.5" strokeDasharray="1 1" opacity="0.6" />
  </svg>
);

export const MenPerfumeIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Masculine geometric cap */}
    <rect x="9" y="2" width="6" height="4.5" rx="0.5" />
    <path d="M10.5 6.5h3v1.5h-3z" />
    {/* Chamfered heavy base bottle */}
    <path d="M6 9.5h12v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5v-11z" />
    <line x1="8.5" y1="14" x2="15.5" y2="14" opacity="0.6" />
  </svg>
);

export const UnisexFragranceIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* First bottle (smaller) */}
    <rect x="3.5" y="4" width="3.5" height="3" rx="0.5" />
    <path d="M2.5 8h5.5v12a1 1 0 0 1-1 1h-3.5a1 1 0 0 1-1-1V8z" />
    {/* Second bottle (taller) */}
    <circle cx="15.5" cy="5" r="2" />
    <path d="M14 7h3v2h-3z" />
    <path d="M11.5 10.5h8a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5h-8a1.5 1.5 0 0 1-1.5-1.5v-8a1.5 1.5 0 0 1 1.5-1.5z" />
  </svg>
);

export const GiftSetIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Bow */}
    <path d="M12 7.5C10.5 5 8 5 8 6.5s2.5 2 4 2c1.5 0 4-.5 4-2S13.5 5 12 7.5z" />
    {/* Lid */}
    <path d="M4 8.5h16v3H4z" />
    {/* Box */}
    <path d="M5.5 11.5h13v9a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-9z" />
    {/* Vertical ribbon */}
    <line x1="12" y1="8.5" x2="12" y2="21.5" />
  </svg>
);

export const PerfumeOilIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Roller cap */}
    <path d="M9.5 2h5v4.5h-5z" />
    {/* Rollerball housing */}
    <path d="M10 6.5h4v2h-4z" />
    {/* Slim cylinder vial */}
    <path d="M8 8.5h8v12.5a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 8 21V8.5z" />
    <circle cx="12" cy="14" r="1.5" opacity="0.6" />
  </svg>
);

export const DiscoverySetIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Presentation Box */}
    <rect x="2.5" y="4" width="19" height="17" rx="1" />
    {/* Vial 1 */}
    <rect x="5.5" y="8" width="2.5" height="9" rx="0.5" />
    <path d="M6 6.5h1.5v1.5H6z" />
    {/* Vial 2 */}
    <rect x="10.75" y="8" width="2.5" height="9" rx="0.5" />
    <path d="M11.25 6.5h1.5v1.5h-1.5z" />
    {/* Vial 3 */}
    <rect x="16" y="8" width="2.5" height="9" rx="0.5" />
    <path d="M16.5 6.5h1.5v1.5h-1.5z" />
  </svg>
);

export const FinestIngredientsIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export const LongLastingIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 2h6v3H9z" />
    <path d="M10 5v2.5" />
    <path d="M14 5v2.5" />
    <path d="M6 7.5h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-12z" />
    <path d="M12 11v3l2 1" />
  </svg>
);

export const ElegantPackagingIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 7.5c-1.5-2.5-4-2.5-4-1s2.5 2 4 2 4-.5 4-2-2.5-1.5-4 1z" />
    <rect x="3" y="8" width="18" height="4" rx="0.5" />
    <path d="M5 12v8a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5v-8" />
    <line x1="12" y1="8" x2="12" y2="21.5" />
  </svg>
);

export const MadeWithPassionIcon: React.FC<IconProps> = ({ className = "w-5 h-5", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const ShippingTruckIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 6h11v11H3z" />
    <path d="M14 9h4l3 3v5h-7" />
    <circle cx="7.5" cy="18.5" r="2" />
    <circle cx="17.5" cy="18.5" r="2" />
    <line x1="9.5" y1="18.5" x2="15.5" y2="18.5" />
  </svg>
);

export const SampleVialIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {/* Cap */}
    <rect x="10" y="3" width="4" height="4" rx="0.5" />
    {/* Vial */}
    <path d="M8.5 7h7v13a2.5 2.5 0 0 1-2.5 2.5h-2A2.5 2.5 0 0 1 8.5 20V7z" />
    {/* Liquid level */}
    <path d="M8.5 13c1.5-1 3.5 1 5 0s1.5-.5 2 0" opacity="0.6" />
    <line x1="8.5" y1="16" x2="12" y2="16" opacity="0.4" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

export const SecureLockIcon: React.FC<IconProps> = ({ className = "w-6 h-6", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="10" width="14" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    <circle cx="12" cy="15.5" r="1.5" />
  </svg>
);
