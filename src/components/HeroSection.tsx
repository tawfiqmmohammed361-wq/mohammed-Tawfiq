import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Sparkles, 
  CheckCircle2, 
  Hammer, 
  Ruler, 
  TreePine, 
  Shield,
  MessageSquare
} from 'lucide-react';
import { Product, BusinessSettings } from '../types';
import { PRODUCTS } from '../data/products';

interface HeroSectionProps {
  onExploreCollection?: () => void;
  onExploreCatalog?: () => void;
  onCustomizeDoor?: () => void;
  onOpenCustomDesign?: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenQuote: () => void;
  featuredProducts?: Product[];
  settings?: BusinessSettings | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCollection,
  onExploreCatalog,
  onCustomizeDoor,
  onOpenCustomDesign,
  onSelectProduct,
  onOpenQuote,
  featuredProducts = PRODUCTS.slice(0, 4),
  settings,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const phonePrimary = settings?.phone || '9842404467';
  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const handleExplore = onExploreCatalog || onExploreCollection || (() => {
    const el = document.getElementById('catalog') || document.getElementById('doors');
    el?.scrollIntoView({ behavior: 'smooth' });
  });

  const currentProduct = featuredProducts[currentIndex] || featuredProducts[0] || PRODUCTS[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section id="hero" className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 px-3 sm:px-6 lg:px-8">
      
      {/* Outer Showcase Container with warm wood gradient & glow */}
      <div 
        className="relative max-w-7xl mx-auto rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/80 flex flex-col justify-between p-6 sm:p-10 lg:p-14 text-[#fdfcf0]"
        style={{ background: 'linear-gradient(145deg, #190f08 0%, #422513 100%)' }}
      >
        
        {/* Ambient Warm Radial Illumination Layer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#d47a24]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#d47a24]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Control Bar: Prev/Next & Quality Guarantee Pill */}
        <div className="relative z-10 flex items-center justify-between mb-4 sm:mb-8">
          <div className="flex items-center gap-2">
            <button
              id="hero-prev-btn"
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#fdfcf0] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              aria-label="Previous design"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="hero-next-btn"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#fdfcf0] transition-all hover:scale-105 active:scale-95 shadow-md cursor-pointer"
              aria-label="Next design"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/15 text-xs text-[#fdfcf0]">
            <ShieldCheck className="w-4 h-4 text-[#d47a24]" />
            <span className="font-semibold tracking-wider text-[11px] uppercase">100% Solid Seasoned Hardwood • Direct Workshop Craft</span>
          </div>
        </div>

        {/* 3-Column Hero Section matching Human Brand Guidelines */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center my-4 sm:my-8">
          
          {/* LEFT COLUMN: Human Headline, Supporting Copy, Price & CTA Buttons */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-[1.15] font-bold text-[#fdfcf0] tracking-tight">
              Made from Good Wood.<br />
              <span className="text-[#d47a24] italic">Made for Your Home.</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base opacity-85 leading-relaxed text-[#fdfcf0] font-light">
              We craft wooden doors and windows with carefully selected timber, traditional workmanship, and attention to every detail. Visit our showroom, talk to us about your requirements, and choose the right design for your home.
            </p>

            {/* Starting Price & Live Spec Indicator */}
            <div className="flex flex-col gap-1 mt-6">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  ₹{currentProduct.price.toLocaleString('en-IN')}
                </span>
                <span className="text-base opacity-40 line-through text-[#fdfcf0]">
                  ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-amber-200/90 font-medium">({currentProduct.woodType})</span>
              </div>
              <span className="text-[11px] uppercase tracking-widest text-[#d47a24] font-bold">
                Featured Design • Handcrafted to Measure
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto">
              <button
                id="hero-explore-btn"
                onClick={handleExplore}
                className="bg-[#d47a24] hover:bg-[#bd6819] text-white px-7 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg shadow-[#d47a24]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Explore Our Doors</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <a
                id="hero-whatsapp-btn"
                href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello WOODCRAFT,\nI saw your website and would like to talk to you about wooden doors and windows for my home.')}`}
                target="_blank"
                rel="noreferrer"
                className="border border-emerald-500/40 bg-emerald-700/20 hover:bg-emerald-600/30 text-white px-6 py-3.5 rounded-full font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Talk to Us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* CENTER COLUMN: Sculpted Wood Door Arch Showcase */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative">
            
            {/* Glowing Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-[#d47a24]/20 rounded-full blur-[90px] pointer-events-none"></div>

            {/* Center Door Architectural Showcase */}
            <div 
              onClick={() => onSelectProduct(currentProduct)}
              className="relative w-full max-w-[320px] aspect-[9/15] bg-[#3a2516] rounded-t-full border-[10px] border-[#2a1b10] shadow-2xl flex items-center justify-center overflow-hidden group cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            >
              {/* Product Background Image */}
              <img 
                src={currentProduct.images[0]} 
                alt={currentProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Wooden Inlay Grid Lines Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none"></div>
              <div className="w-[2px] h-full bg-[#2a1b10] absolute left-1/2 -translate-x-1/2 pointer-events-none"></div>

              {/* Timber Species Tag */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] uppercase font-bold tracking-widest text-[#fdfcf0]">
                {currentProduct.woodType}
              </div>

              {/* Bottom Details Bar */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#1a110a] via-[#1a110a]/80 to-transparent flex items-end justify-between">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#fdfcf0] line-clamp-1">
                    {currentProduct.name}
                  </h3>
                  <p className="text-[11px] text-[#fdfcf0]/70 mt-0.5">
                    {currentProduct.dimensions}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-[#d47a24] uppercase tracking-wider group-hover:text-white transition-colors">
                  View Details &rarr;
                </span>
              </div>
            </div>

            {/* Design Quick Switcher Dots */}
            <div className="flex items-center gap-2.5 mt-4">
              {featuredProducts.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex 
                      ? 'w-8 bg-[#d47a24]' 
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Select ${p.name}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Popular Designs Switcher & Honest Customer Quote */}
          <div className="lg:col-span-3 flex flex-col items-start lg:items-end gap-6 sm:gap-8 z-10">
            
            {/* Popular Designs Selector */}
            <div className="flex flex-col gap-3 items-start lg:items-end w-full">
              <span className="text-xs uppercase tracking-[0.3em] opacity-60 font-bold text-[#fdfcf0]">
                Popular Designs
              </span>
              <div className="flex flex-row lg:flex-col gap-3">
                {featuredProducts.slice(0, 3).map((prod, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-16 h-16 rounded-2xl bg-[#3a2516] border flex items-center justify-center p-1.5 cursor-pointer transition-all duration-300 ${
                        isActive
                          ? 'border-[#d47a24] shadow-lg shadow-[#d47a24]/30 scale-105'
                          : 'border-white/10 hover:border-[#d47a24]'
                      }`}
                    >
                      <img 
                        src={prod.images[0]} 
                        alt={prod.name} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Honest Homeowner Note */}
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 w-full max-w-xs shadow-xl">
              <div className="flex text-[#d47a24] mb-1.5 text-sm">
                ★★★★★
              </div>
              <p className="text-xs italic opacity-85 leading-relaxed mb-2.5 text-[#fdfcf0]">
                "We visited the workshop to see the seasoned Burma teak before ordering. The door has been installed for over a year with zero jamming or issues."
              </p>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#fdfcf0]/90 block">
                — Rajesh M., Sadashivanagar
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM FEATURE QUICK-BAR */}
        <div className="relative z-10 mt-8 pt-8 border-t border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 flex-grow w-full lg:w-auto">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d47a24] shrink-0 border border-white/10">
                <TreePine className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#fdfcf0]">100% Solid Wood</h4>
                <p className="text-[10px] opacity-60 text-[#fdfcf0]">Zero Hollow Cores</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d47a24] shrink-0 border border-white/10">
                <Hammer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#fdfcf0]">Kiln-Dried Timber</h4>
                <p className="text-[10px] opacity-60 text-[#fdfcf0]">8-10% Moisture Balanced</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d47a24] shrink-0 border border-white/10">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#fdfcf0]">Custom Sizing</h4>
                <p className="text-[10px] opacity-60 text-[#fdfcf0]">To Exact Doorway Dimensions</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#d47a24] shrink-0 border border-white/10">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#fdfcf0]">Direct Workshop</h4>
                <p className="text-[10px] opacity-60 text-[#fdfcf0]">No Middlemen Markups</p>
              </div>
            </div>
          </div>

          {/* High-Contrast "Request a Quote" Button */}
          <button
            onClick={onOpenQuote}
            className="bg-white text-black px-7 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#d47a24] hover:text-white transition-all shrink-0 shadow-lg cursor-pointer"
          >
            Get a Detailed Quote
          </button>
        </div>
      </div>
    </section>
  );
};

