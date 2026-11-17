import React from 'react';
import {
  ShippingTruckIcon,
  SampleVialIcon,
  RefreshIcon,
  SecureLockIcon
} from './LuxuryIcons';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: <ShippingTruckIcon className="w-6 h-6 text-stone-800" />,
      title: 'KARACHI DELIVERY',
      subtitle: 'Flat PKR 200 fee'
    },
    {
      icon: <SampleVialIcon className="w-6 h-6 text-stone-800" />,
      title: 'COMPLIMENTARY SAMPLES',
      subtitle: '2 vials with every order'
    },
    {
      icon: <RefreshIcon className="w-6 h-6 text-stone-800" />,
      title: 'EASYPAISA PAYMENT',
      subtitle: 'Advance transfer verification'
    },
    {
      icon: <SecureLockIcon className="w-6 h-6 text-stone-800" />,
      title: 'AUTHENTIC LUXURY',
      subtitle: 'Premium fragrance experience.'
    }
  ];

  return (
    <section
      id="trust-strip"
      aria-label="Client Guarantees & Services"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
    >
      <div className="bg-white/80 backdrop-blur-xs rounded-2xl border border-stone-200/70 shadow-xs py-7 px-4 sm:px-6">
        {/* CSS Grid 4 Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/70">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center space-x-4 px-2 sm:px-4 ${
                index !== 0 ? 'pt-4 sm:pt-0' : ''
              }`}
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-center">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-stone-900 leading-tight">
                  {item.title}
                </span>
                <span className="text-[11px] text-stone-500 font-normal mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
