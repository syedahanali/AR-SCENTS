import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside
      role="banner"
      aria-label="Promotional Announcement"
      className="hidden sm:block w-full bg-[#0E0E0E] text-white/90 text-[10px] sm:text-[11px] py-2 px-4 tracking-[0.18em] font-medium transition-colors border-b border-stone-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <span className="whitespace-nowrap hover:text-white transition cursor-default">
          KARACHI DELIVERY ONLY · FLAT PKR 200 DELIVERY FEE
        </span>
        <span className="mx-3 text-stone-500 font-light" aria-hidden="true">|</span>
        <span className="whitespace-nowrap hover:text-white transition cursor-default">
          EASYPAISA ADVANCE PAYMENT · 2 COMPLIMENTARY SAMPLES
        </span>
      </div>
    </aside>
  );
};
