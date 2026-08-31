import React, { useState } from 'react';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  Youtube, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Leaf, 
  ArrowRight,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { ProductCategory, BusinessSettings } from '../types';

interface FooterProps {
  settings?: BusinessSettings | null;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenCustomDesign: () => void;
  onOpenQuote: () => void;
  onOpenFAQ: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onSelectCategory,
  onOpenCustomDesign,
  onOpenQuote,
  onOpenFAQ,
  onOpenAdmin,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const phonePrimary = settings?.phone || '9842404467';
  const phoneAlternate = settings?.alternatePhone || '7708378003';
  const contactEmail = settings?.email || 'tawfiqmmohammed361@gmail.com';
  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanPhone = phonePrimary.replace(/[^0-9]/g, '');
  const cleanAltPhone = phoneAlternate.replace(/[^0-9]/g, '');
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer id="contact" className="bg-[#120a05] border-t border-white/10 text-[#fdfcf0]/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center text-[#d47a24] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#fdfcf0] text-sm">15-Year Timber Warranty</h4>
              <p className="text-xs text-[#fdfcf0]/60">Guaranteed protection against warping, termites & structural cracks.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center text-[#d47a24] shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#fdfcf0] text-sm">FSC Certified Hardwoods</h4>
              <p className="text-xs text-[#fdfcf0]/60">Sourced exclusively from legal, seasoned plantation forests.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center text-[#d47a24] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#fdfcf0] text-sm">Free Doorstep Measurement</h4>
              <p className="text-xs text-[#fdfcf0]/60">Master carpenter laser site inspection across India.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#d47a24] flex items-center justify-center rotate-45 shadow-md shadow-[#d47a24]/30">
                <span className="font-serif font-bold text-white text-xs -rotate-45">W</span>
              </div>
              <span className="font-serif font-bold text-xl tracking-[0.2em] text-[#fdfcf0]">
                WOODCRAFT
              </span>
            </div>

            <p className="text-sm font-serif italic text-[#d47a24]">
              "Natural elegance, crafted for generations."
            </p>

            <p className="text-xs text-[#fdfcf0]/70 leading-relaxed max-w-sm">
              India's premier manufacturer of custom solid teak, rosewood, and oak entrance doors, acoustic bedroom portals, sacred pooja doors, and French casement windows.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d47a24] text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d47a24] text-white flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d47a24] text-white flex items-center justify-center transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#d47a24] text-white flex items-center justify-center transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Doors & Windows */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fdfcf0] mb-4">
              Doors & Windows
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('main-doors')} className="hover:text-[#d47a24] transition-colors">
                  Main Entrance Doors
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bedroom-doors')} className="hover:text-[#d47a24] transition-colors">
                  Acoustic Bedroom Doors
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('pooja-doors')} className="hover:text-[#d47a24] transition-colors">
                  Pooja Mandir Bell Doors
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('wooden-windows')} className="hover:text-[#d47a24] transition-colors">
                  French Casement Windows
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('sliding-windows')} className="hover:text-[#d47a24] transition-colors">
                  Sliding Balcony Windows
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('teak-doors')} className="hover:text-[#d47a24] transition-colors">
                  100% Solid Burma Teak
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Custom Design */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fdfcf0] mb-4">
              Bespoke Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenCustomDesign} className="hover:text-[#d47a24] transition-colors text-left">
                  3D Door Customizer Studio
                </button>
              </li>
              <li>
                <button onClick={onOpenQuote} className="hover:text-[#d47a24] transition-colors text-left">
                  Book Free Site Measurement
                </button>
              </li>
              <li>
                <button onClick={onOpenFAQ} className="hover:text-[#d47a24] transition-colors text-left">
                  Timber Seasoning & Care FAQs
                </button>
              </li>
              <li>
                <span className="hover:text-[#d47a24] cursor-pointer">Shipping & Wooden Crating</span>
              </li>
              <li>
                <span className="hover:text-[#d47a24] cursor-pointer">15-Year Timber Warranty</span>
              </li>
              <li>
                <span className="hover:text-[#d47a24] cursor-pointer">Architect & Interior Partner Program</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Showrooms */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#fdfcf0] mb-4">
              Architectural Newsletter
            </h4>
            <p className="text-xs text-[#fdfcf0]/70 mb-3">
              Receive quarterly catalogs of new timber carvings, veneer arrivals, and woodwork discounts.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#d47a24] hover:bg-[#be6a1c] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{subscribed ? '✓ Subscribed' : 'Join Woodcraft Club'}</span>
                {!subscribed && <ArrowRight className="w-3 h-3" />}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-white/10 text-xs space-y-2 text-[#fdfcf0]/70">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d47a24] shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${cleanPhone}`} className="hover:text-white transition-colors block font-medium">
                    {phonePrimary}
                  </a>
                  {phoneAlternate && (
                    <a href={`tel:${cleanAltPhone}`} className="hover:text-white transition-colors block text-[11px] text-[#fdfcf0]/60">
                      Alt: {phoneAlternate}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d47a24] shrink-0" />
                <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors truncate">
                  {contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a 
                  href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello WOODCRAFT, I have an architectural woodwork enquiry.')}`}
                  target="_blank" 
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  WhatsApp: {whatsappNum}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#fdfcf0]/60">
          <div>
            © {new Date().getFullYear()} WOODCRAFT Joinery Ltd. All rights reserved. Handcrafted in India.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-white cursor-pointer">FSC Forest Certification</span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-[#d47a24] text-white/50 cursor-pointer transition-colors flex items-center gap-1 font-semibold"
              >
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

