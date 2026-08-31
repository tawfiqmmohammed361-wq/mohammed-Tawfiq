import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, TreePine, ShieldCheck, Truck, Ruler, Phone, Mail, MessageSquare } from 'lucide-react';
import { BusinessSettings } from '../types';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
  settings?: BusinessSettings | null;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose, onOpenQuote, settings }) => {
  if (!isOpen) return null;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const phonePrimary = settings?.phone || '9842404467';
  const phoneAlternate = settings?.alternatePhone || '7708378003';
  const contactEmail = settings?.email || 'tawfiqmmohammed361@gmail.com';
  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanPhone = phonePrimary.replace(/[^0-9]/g, '');
  const cleanAltPhone = phoneAlternate.replace(/[^0-9]/g, '');
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const faqs = [
    {
      q: 'What is the difference between Burma Teak and CP / African Teak?',
      a: 'Burma Teak (Tectona grandis) is the gold standard of architectural timber, harvested from mature old-growth natural forests with high natural oil content, tight grain lines, and supreme golden-brown luster. CP (Central Province / African) Teak is a fast-growing, durable alternative with slightly wider grain patterns, offering exceptional strength at approximately 30-40% lower cost.',
    },
    {
      q: 'How does WOODCRAFT prevent doors from jamming during monsoon seasons?',
      a: 'Doors jam when unseasoned timber absorbs airborne moisture and swells. At WOODCRAFT, 100% of our timber undergoes 21 days of vacuum chamber kiln drying to bring moisture content strictly below 8-10%, followed by a 4-coat moisture-sealing polyurethane barrier that completely isolates the timber from humidity.',
    },
    {
      q: 'Do you provide on-site measurement before placing an order?',
      a: 'Yes! We provide 100% complimentary doorstep site measurement by certified master carpenters across all major Indian cities (Bangalore, Mumbai, Delhi NCR, Hyderabad, Chennai, Pune, Kochi, Ahmedabad, Kolkata). Simply click "Get a Free Quote" or book through the top navigation.',
    },
    {
      q: 'Can you build custom doors according to my interior designer’s CAD drawings?',
      a: 'Absolutely. Over 40% of our production is bespoke architectural orders. You can use our 3D Custom Studio or upload your architect’s CAD/PDF drawings in the quote form. We provide millimeter-accurate shop drawings and wood grain samples for sign-off prior to production.',
    },
    {
      q: 'What does the 15-Year Timber Warranty cover?',
      a: 'Our comprehensive warranty covers structural integrity against wood warping, dimensional sagging, termite/borer infestations, and joint delamination under standard residential use. If a defect occurs, we repair or replace the unit completely free of charge.',
    },
    {
      q: 'What are the payment terms for custom orders?',
      a: 'For custom manufactured doors and windows, we require only a 30% booking advance to begin kiln seasoning and CNC joinery. The balance 70% is payable only after safe doorstep delivery and physical inspection at your site.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#1c0d06] border border-[#ff8d3f]/30 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#251208]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#ffaa6b]" />
            <h3 className="font-serif-luxury font-bold text-lg text-white">
              Timber & Joinery Knowledge Base (FAQs)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQs List */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-serif-luxury font-bold text-sm text-white hover:text-[#ffaa6b] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-[#ffaa6b]" /> : <ChevronDown className="w-4 h-4 shrink-0 text-white/50" />}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-[#fedbc4]/80 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-6 p-5 rounded-2xl bg-[#2a1307] border border-[#ff8d3f]/20 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm">Have a specific architectural requirement?</h4>
                <p className="text-xs text-[#fedbc4]/70">Our master timber engineer is available for free phone and site consultations.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenQuote();
                }}
                className="px-5 py-2.5 rounded-full bg-[#d9661c] hover:bg-[#eb7323] text-white font-bold text-xs shrink-0 shadow-md cursor-pointer"
              >
                Book Free Site Visit
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#fedbc4]/80">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#ffaa6b]" />
                <span>Call: <a href={`tel:${cleanPhone}`} className="text-white font-bold hover:text-[#ffaa6b]">{phonePrimary}</a> {phoneAlternate && <>| <a href={`tel:${cleanAltPhone}`} className="text-white hover:text-[#ffaa6b]">{phoneAlternate}</a></>}</span>
              </div>
              <a
                href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello WOODCRAFT, I have a question regarding timber and doors.')}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp ({whatsappNum})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
