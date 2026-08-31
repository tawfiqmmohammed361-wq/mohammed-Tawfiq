import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Scale, 
  Menu, 
  X, 
  ChevronRight, 
  Compass, 
  FileText,
  Phone,
  Sparkles,
  MessageSquare,
  Mail
} from 'lucide-react';
import { BusinessSettings } from '../types';

interface NavbarProps {
  settings?: BusinessSettings | null;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenAccount: () => void;
  onOpenSearch: () => void;
  onOpenQuote: () => void;
  onOpenCustomDesign: () => void;
  onOpenFAQ?: () => void;
  onOpenAdmin?: () => void;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  wishlistCount,
  compareCount,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenAccount,
  onOpenSearch,
  onOpenQuote,
  onOpenCustomDesign,
  onOpenFAQ,
  onOpenAdmin,
  activeSection = 'hero',
  onNavigate,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);

  const phonePrimary = settings?.phone || '9842404467';
  const phoneAlternate = settings?.alternatePhone || '7708378003';
  const contactEmail = settings?.email || 'tawfiqmmohammed361@gmail.com';
  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanPhone = phonePrimary.replace(/[^0-9]/g, '');
  const cleanAltPhone = phoneAlternate.replace(/[^0-9]/g, '');
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const handleNavigate = (sectionId: string) => {
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'doors', label: 'Doors', category: 'main-doors' },
    { id: 'windows', label: 'Windows', category: 'wooden-windows' },
    { id: 'custom-design', label: 'Custom Design', action: onOpenCustomDesign },
    { id: 'showroom', label: 'Showroom' },
    { id: 'why-us', label: 'About Us' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 pt-4 sm:pt-6 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
          
          {/* Brand Logo - Rotated Diamond Accent matching Design */}
          <div 
            id="brand-logo"
            onClick={() => handleNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/10 shadow-2xl transition-all"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#d47a24] rounded-sm transform rotate-45 flex items-center justify-center shadow-lg shadow-[#d47a24]/30 group-hover:scale-110 transition-transform">
              <span className="transform -rotate-45 text-white font-black text-xs font-serif">W</span>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-[0.2em] text-[#fdfcf0] font-sans">
                WOODCRAFT
              </span>
            </div>
          </div>

          {/* Floating Pill Navigation Bar (Center) */}
          <nav 
            id="main-nav-pill"
            className="hidden lg:flex items-center gap-6 xl:gap-8 px-8 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl text-xs sm:text-sm font-medium tracking-wide uppercase text-[#fdfcf0]/80"
          >
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => {
                    if (link.action) {
                      link.action();
                    } else {
                      handleNavigate(link.id);
                    }
                  }}
                  className={`transition-colors duration-200 uppercase tracking-widest ${
                    isActive
                      ? 'text-[#d47a24] font-bold opacity-100'
                      : 'hover:text-[#d47a24] hover:opacity-100 opacity-80'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Free Quote Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Get a Free Quote Pill */}
            <button
              id="header-quote-cta"
              onClick={onOpenQuote}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#d47a24] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d47a24]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Quote</span>
            </button>

            {/* Quick Actions Cluster */}
            <div className="flex items-center gap-1 sm:gap-2 p-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              
              {/* Search */}
              <button
                id="search-btn"
                onClick={onOpenSearch}
                title="Search doors & windows"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#fdfcf0]/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Compare */}
              <button
                id="compare-btn"
                onClick={onOpenCompare}
                title="Compare Specifications"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#fdfcf0]/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Compare"
              >
                <Scale className="w-4 h-4" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d47a24] text-white text-[10px] font-bold flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button
                id="wishlist-btn"
                onClick={onOpenWishlist}
                title="Saved Wishlist"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#fdfcf0]/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d47a24] text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Shopping Cart */}
              <button
                id="cart-btn"
                onClick={onOpenCart}
                title="Shopping Cart"
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#fdfcf0]/80 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#d47a24] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <button
                id="user-account-btn"
                onClick={onOpenAccount}
                title="Account & Orders"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#fdfcf0]/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="User Account"
              >
                <User className="w-4 h-4" />
              </button>

              {/* Direct Call / Contact Trigger */}
              <div className="relative">
                <button
                  id="header-contact-btn"
                  onClick={() => setShowContactPopup(!showContactPopup)}
                  title="Contact WOODCRAFT"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[#fdfcf0]/80 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Contact Details"
                >
                  <Phone className="w-4 h-4 text-[#d47a24]" />
                </button>

                {showContactPopup && (
                  <div className="absolute right-0 top-11 w-72 p-4 rounded-2xl bg-[#1a110a]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#d47a24]">Direct Contact</span>
                      <button onClick={() => setShowContactPopup(false)} className="text-white/60 hover:text-white">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="space-y-2.5 text-xs text-[#fdfcf0]">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/50 block">Primary Phone</span>
                        <a href={`tel:${cleanPhone}`} className="font-semibold text-white hover:text-[#d47a24] transition-colors flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-[#d47a24]" />
                          <span>{phonePrimary}</span>
                        </a>
                      </div>
                      {phoneAlternate && (
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-white/50 block">Alternate Phone</span>
                          <a href={`tel:${cleanAltPhone}`} className="font-semibold text-white hover:text-[#d47a24] transition-colors flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-[#d47a24]" />
                            <span>{phoneAlternate}</span>
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-white/50 block">Email Concierge</span>
                        <a href={`mailto:${contactEmail}`} className="font-light text-white/90 hover:text-[#d47a24] transition-colors flex items-center gap-1.5 mt-0.5 truncate">
                          <Mail className="w-3 h-3 text-[#d47a24] shrink-0" />
                          <span className="truncate">{contactEmail}</span>
                        </a>
                      </div>
                      <a
                        href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello WOODCRAFT, I would like to inquire about your doors and windows.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-md"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp ({whatsappNum})</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 max-w-md mx-auto p-5 rounded-3xl bg-[#1a110a]/95 backdrop-blur-xl border border-white/15 shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.action) {
                      link.action();
                    } else {
                      handleNavigate(link.id);
                    }
                  }}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs uppercase tracking-widest font-semibold transition-all ${
                    activeSection === link.id
                      ? 'bg-[#d47a24] text-white font-bold'
                      : 'text-[#fdfcf0]/80 hover:bg-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>
              ))}

              <div className="pt-3 border-t border-white/10 mt-2 flex flex-col gap-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#d47a24]">Direct Enquiries</span>
                    <a href={`tel:${cleanPhone}`} className="font-semibold text-white hover:text-[#d47a24] transition-colors flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#d47a24]" />
                      <span>{phonePrimary}</span>
                    </a>
                  </div>
                  {phoneAlternate && (
                    <div className="flex items-center justify-between text-[11px] text-white/70">
                      <span>Alternate:</span>
                      <a href={`tel:${cleanAltPhone}`} className="hover:text-[#d47a24] transition-colors">
                        {phoneAlternate}
                      </a>
                    </div>
                  )}
                  <a
                    href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello WOODCRAFT, I have a quick question about doors.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Us ({whatsappNum})</span>
                  </a>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuote();
                  }}
                  className="w-full py-3 rounded-full bg-[#d47a24] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Free Measurement Quote</span>
                </button>
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Store Admin Portal</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
