import React from 'react';
import { HeartHandshake, ShieldCheck, TreePine, Sparkles, MessageSquare, Phone, MapPin, Hammer, Users, ArrowRight } from 'lucide-react';
import { BusinessSettings } from '../types';

interface PeopleSectionProps {
  settings?: BusinessSettings | null;
  onOpenQuote?: () => void;
}

export const PeopleSection: React.FC<PeopleSectionProps> = ({ settings, onOpenQuote }) => {
  const phonePrimary = settings?.phone || '9842404467';
  const phoneAlternate = settings?.alternatePhone || '7708378003';
  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanPhone = phonePrimary.replace(/[^0-9]/g, '');
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const teamStories = [
    {
      title: 'Who Started the Business',
      subtitle: 'Generations of Timber Passion',
      story: 'WOODCRAFT was founded with a straightforward belief: every home deserves genuine, unadulterated solid wood crafted with honesty. Started by Tawfiq Mohammed alongside veteran wood artisans, our journey began in local timber yards hand-inspecting raw logs rather than selling mass-produced synthetic doors.',
      highlight: 'Direct woodcraft without corporate shortcuts',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
      caption: 'Tawfiq Mohammed & Master Woodwrights inspecting grain symmetry'
    },
    {
      title: 'How Our Business Works',
      subtitle: 'From Timber Yard Directly to Your Home',
      story: 'We operate our own woodworking workshop and seasoning facility in Bengaluru. There are no middlemen, no commission agents, and no inflated distributor markups. When you talk to us, you are speaking directly with the people who cut, plane, and hand-polish your wood.',
      highlight: 'Transparent pricing & direct artisan accountability',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      caption: 'Our Bengaluru workshop floor where every door frame is shaped'
    },
    {
      title: 'How Timber is Selected',
      subtitle: 'Only Kiln-Dried Mature Hardwood',
      story: 'We never use green or unseasoned wood. We personally travel to certified timber depots to hand-pick Burma Teak, African Teak, and Rosewood logs. Every log is checked for straight grain, natural resin content, and moisture equilibrium before it is allowed into our seasoning kilns.',
      highlight: 'Strict 8–10% moisture content standard',
      image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
      caption: 'Hand-grading raw timber planks for acoustic density and strength'
    },
    {
      title: 'How Craftsmen Make Products',
      subtitle: 'Traditional Joinery & Gentle Hand Polishing',
      story: 'Instead of relying solely on metal screws or chemical glue, our carpenters employ traditional interlocking mortise-and-tenon joinery. Each door shutter is hand-sanded across multiple grit stages and sealed with 4 coats of breathable natural polyurethane.',
      highlight: 'Built to last 50+ years and age with character',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      caption: 'Fine hand chiseling and custom relief work by our senior carpenters'
    },
    {
      title: 'How Customers Are Supported',
      subtitle: 'WhatsApp Updates & Honest Guidance',
      story: 'From the day your timber is selected, we share regular WhatsApp photo and video updates from our workshop. We offer on-site measurement consultations, ensure careful delivery in wooden crates, and assist your local carpenter or provide our own installation team.',
      highlight: 'Lifelong guidance on wood care and maintenance',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      caption: 'Completed custom front entrance door safely installed at a family home'
    }
  ];

  return (
    <section id="people" className="py-20 sm:py-28 bg-[#170e08] relative border-t border-b border-white/10 overflow-hidden">
      {/* Subtle Warm Glow Ambient Background */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#d47a24]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#d47a24]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d47a24]/15 border border-[#d47a24]/30 text-[#d47a24] text-xs font-bold uppercase tracking-wider mb-4">
            <Users className="w-4 h-4" />
            <span>Real Artisans, Real Wood</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Meet the People Behind <span className="italic text-[#d47a24]">WOODCRAFT</span>
          </h2>
          <p className="text-sm sm:text-base text-[#fdfcf0]/75 mt-4 leading-relaxed font-light">
            We are not a faceless e-commerce website or a mass factory reseller. We are a family of passionate woodworkers, timber selectors, and carpenters who take pride in shaping raw logs into timeless doors for your home.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Founder & Philosophy Card (Spans 7 cols) */}
          <div className="lg:col-span-7 bg-[#21140c] rounded-3xl border border-white/15 overflow-hidden shadow-2xl flex flex-col justify-between p-6 sm:p-10">
            <div>
              <div className="flex items-center gap-3 text-xs uppercase font-bold tracking-widest text-[#d47a24] mb-3">
                <HeartHandshake className="w-4 h-4" />
                <span>Our Founding Commitment</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
                "We treat every piece of timber as if it were being fitted in our own home."
              </h3>
              <p className="text-sm text-[#fdfcf0]/80 leading-relaxed space-y-4">
                When you invest in a solid wood door or window, you are choosing something that will welcome your family every morning and greet your guests for decades. That is why we avoid shortcuts, hollow cores, or synthetic veneers.
              </p>
              <p className="text-sm text-[#fdfcf0]/80 leading-relaxed mt-3">
                Our workshop doors are always open. You are welcome to walk into our yard, smell the fresh teak shavings, inspect the timber seasoning readings, and sit down for a cup of tea while discussing your architectural plans.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#d47a24]/20 border border-[#d47a24]/40 flex items-center justify-center text-white font-serif font-bold text-lg">
                  TM
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tawfiq Mohammed</h4>
                  <p className="text-xs text-[#fdfcf0]/60">Founder & Master Wood Selector</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#d47a24]" />
                  <span>Call: {phonePrimary}</span>
                </a>
                <a
                  href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello Tawfiq, I would like to consult with you about doors for my home.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-xs font-semibold text-white transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Direct</span>
                </a>
              </div>
            </div>
          </div>

          {/* Side Photo Card (Spans 5 cols) */}
          <div className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/15 relative min-h-[340px] shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
              alt="Craftsman hand-carving wooden door in workshop"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 p-6 text-white">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d47a24] block mb-1">
                Inside the Workshop
              </span>
              <h4 className="text-lg font-serif font-bold">Generational Hand Carving</h4>
              <p className="text-xs text-[#fdfcf0]/75 mt-1 leading-relaxed">
                Our master artisans carve traditional floral motifs and crisp modern shadow-lines by hand with custom chisels.
              </p>
            </div>
          </div>

        </div>

        {/* 4 Core Pillars of How We Work */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {teamStories.slice(1).map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#1d120a] border border-white/10 hover:border-[#d47a24]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 rounded-2xl overflow-hidden mb-4 border border-white/10">
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#d47a24] block mb-1">
                  {item.subtitle}
                </span>
                <h4 className="text-base font-serif font-bold text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-[#fdfcf0]/70 leading-relaxed font-light">
                  {item.story}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <span className="text-[11px] font-semibold text-amber-200/90 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#d47a24] shrink-0" />
                  <span>{item.highlight}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Workshop Visit Invitation Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#26150c] border border-[#d47a24]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-serif font-bold text-white">
              Want to see our team and timber in person?
            </h4>
            <p className="text-xs sm:text-sm text-[#fdfcf0]/75 font-light">
              Visit our live timber yard & workshop in Bengaluru. Walk around freely and see how raw wood turns into finished doors.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('showroom');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-full bg-[#d47a24] hover:bg-[#be6a1c] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              Get Workshop Directions
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
