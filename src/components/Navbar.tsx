import React, { useState } from 'react';
import { Search, User, ShoppingBag, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onSelectCategory: (categoryId: string) => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onSelectCategory,
  onOpenAccount
}) => {
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    setIsShopMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          
          {/* Brand Logo (Left) */}
          <div className="flex-shrink-0 min-w-0">
            <a
              href="#"
              className="flex flex-col items-center justify-center group text-stone-900 focus:outline-none"
            >
              <span className="font-serif text-lg sm:text-3xl tracking-[0.16em] sm:tracking-[0.24em] font-medium whitespace-nowrap transition-opacity group-hover:opacity-80">
                AR SCENTS
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links (Center) */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-semibold tracking-[0.16em] text-stone-800 uppercase">
            
            {/* SHOP with Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsShopMenuOpen(true)}
              onMouseLeave={() => setIsShopMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => scrollToSection('featured-fragrances')}
                className="flex items-center gap-1.5 hover:text-stone-950 transition-colors py-1 cursor-pointer focus:outline-none"
                aria-expanded={isShopMenuOpen}
              >
                <span>SHOP</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isShopMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Shop Megamenu Dropdown */}
              {isShopMenuOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-stone-200 shadow-xl rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <p className="text-[10px] tracking-[0.2em] text-stone-400 font-semibold mb-3 border-b border-stone-100 pb-1.5">
                    COLLECTIONS
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700 tracking-wider">
                    <li>
                      <button
                        onClick={() => { onSelectCategory('all'); scrollToSection('featured-fragrances'); }}
                        className="w-full text-left hover:text-stone-950 hover:translate-x-1 transition flex items-center justify-between"
                      >
                        <span>All Fragrances</span>
                        <span className="text-[10px] text-stone-400">5 Extrait</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { onSelectCategory('women'); scrollToSection('featured-fragrances'); }}
                        className="w-full text-left hover:text-stone-950 hover:translate-x-1 transition"
                      >
                        Women's Fragrances
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { onSelectCategory('men'); scrollToSection('featured-fragrances'); }}
                        className="w-full text-left hover:text-stone-950 hover:translate-x-1 transition"
                      >
                        Men's Fragrances
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { onSelectCategory('unisex'); scrollToSection('featured-fragrances'); }}
                        className="w-full text-left hover:text-stone-950 hover:translate-x-1 transition"
                      >
                        Unisex Haute Parfumerie
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { onSelectCategory('discovery-sets'); scrollToSection('promotions'); }}
                        className="w-full text-left hover:text-stone-950 hover:translate-x-1 transition"
                      >
                        Discovery Sets
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => { onSelectCategory('gift-sets'); scrollToSection('promotions'); }}
                        className="w-full text-left hover:text-stone-950 hover:translate-x-1 transition"
                      >
                        Gift Sets & Collections
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <button
              onClick={() => { onSelectCategory('all'); scrollToSection('featured-fragrances'); }}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus:outline-none"
            >
              BEST SELLERS
            </button>

            <button
              onClick={() => scrollToSection('category-strip')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus:outline-none"
            >
              COLLECTIONS
            </button>

            <button
              onClick={() => scrollToSection('promotions')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus:outline-none"
            >
              DISCOVERY SETS
            </button>

            <button
              onClick={() => scrollToSection('about-craft')}
              className="hover:text-stone-950 transition-colors py-1 cursor-pointer focus:outline-none"
            >
              ABOUT
            </button>
          </nav>

          {/* Action Utilities (Right) */}
          <div className="flex items-center space-x-1.5 sm:space-x-5 text-stone-800 shrink-0">
            {/* Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1.5 hover:text-stone-950 transition-colors cursor-pointer rounded-full hover:bg-stone-200/50 focus:outline-none"
              title="Search fragrances"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* User Account Button */}
            <button
              type="button"
              onClick={onOpenAccount}
              className="p-1.5 hover:text-stone-950 transition-colors cursor-pointer rounded-full hover:bg-stone-200/50 focus:outline-none"
              title="Client account & orders"
              aria-label="Account"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Shopping Bag Button with Badge */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1.5 hover:text-stone-950 transition-colors cursor-pointer rounded-full hover:bg-stone-200/50 focus:outline-none"
              title="View shopping bag"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none ring-2 ring-[#FAF8F5]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 hover:text-stone-950 transition-colors cursor-pointer shrink-0 focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden w-full max-h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-4 border-t border-stone-200/80 bg-[#FAF8F5] animate-in fade-in duration-200">
            <div className="flex flex-col space-y-2.5 text-xs tracking-widest font-semibold uppercase text-stone-800 w-full">
              <button
                type="button"
                onClick={() => scrollToSection('featured-fragrances')}
                className="w-full text-left py-2.5 px-1 hover:text-stone-950 border-b border-stone-200/40 whitespace-normal break-words"
              >
                Shop All Fragrances
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('featured-fragrances')}
                className="w-full text-left py-2.5 px-1 hover:text-stone-950 border-b border-stone-200/40 whitespace-normal break-words"
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('category-strip')}
                className="w-full text-left py-2.5 px-1 hover:text-stone-950 border-b border-stone-200/40 whitespace-normal break-words"
              >
                Collections
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('promotions')}
                className="w-full text-left py-2.5 px-1 hover:text-stone-950 border-b border-stone-200/40 whitespace-normal break-words"
              >
                Discovery Sets
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about-craft')}
                className="w-full text-left py-2.5 px-1 hover:text-stone-950 whitespace-normal break-words"
              >
                About &amp; Craftsmanship
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
