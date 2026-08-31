import React from 'react';
import { TreePine, Hammer, Ruler, ShieldCheck, Flame, CheckCircle2 } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      id: 'premium-wood',
      title: 'Premium Wood',
      subtitle: 'Carefully selected quality wood.',
      description: 'We source only certified 40+ year-old slow-grown heartwood logs from sustainable plantations in Burma, CP, and Nilambur. Naturally rich in protective teak oils.',
      icon: TreePine,
      badge: 'FSC Certified Heartwood',
    },
    {
      id: 'expert-craftsmanship',
      title: 'Expert Craftsmanship',
      subtitle: 'Skilled craftsmen with attention to detail.',
      description: 'Generational artisans utilize traditional interlocking mortise-and-tenon structural joints, preventing sagging and ensuring doors withstand decades of daily use.',
      icon: Hammer,
      badge: 'Master Joinery',
    },
    {
      id: 'custom-sizes',
      title: 'Custom Sizes',
      subtitle: 'Made according to your measurements.',
      description: 'Every home and architectural opening is unique. We provide free doorstep laser measurements and engineer custom frames down to the exact millimeter.',
      icon: Ruler,
      badge: 'Millimeter Precision',
    },
    {
      id: 'long-lasting-quality',
      title: 'Long-Lasting Quality',
      subtitle: 'Built for strength, beauty and durability.',
      description: 'Kiln-dried in computer-monitored chambers to achieve <8-10% moisture content. Backed by our 15-year termite, borer, and warp replacement guarantee.',
      icon: ShieldCheck,
      badge: '15-Year Warranty',
    },
  ];

  const processSteps = [
    { step: '01', title: 'Timber Selection', desc: 'Heartwood density testing' },
    { step: '02', title: 'Vacuum Seasoning', desc: 'Moisture reduced to <9%' },
    { step: '03', title: 'Precision Joinery', desc: 'CNC & Hand Mortise tenons' },
    { step: '04', title: '4-Coat PU Polish', desc: 'German weatherproof lacquer' },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs uppercase tracking-[0.25em] text-[#d47a24] font-bold">
          The WOODCRAFT Standard
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-bold italic text-[#fdfcf0] mt-1.5">
          Why Choose WOODCRAFT
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-[#fdfcf0]/70 leading-relaxed">
          From sustainable forest harvesting to your home's threshold, we preserve the timeless beauty of pure solid timber with uncompromising engineering.
        </p>
      </div>

      {/* 4 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              id={`feature-card-${item.id}`}
              className="group relative p-6 sm:p-7 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#d47a24] transition-all duration-500 hover:shadow-2xl hover:shadow-black/70 flex flex-col justify-between"
            >
              <div>
                {/* Icon Badge */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#d47a24] to-[#7a3c0b] flex items-center justify-center text-white shadow-lg shadow-[#d47a24]/30 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47a24] block">
                  {item.badge}
                </span>

                <h3 className="text-xl font-serif font-bold text-[#fdfcf0] mt-1">
                  {item.title}
                </h3>

                <p className="text-xs font-semibold text-[#d47a24] mt-1">
                  {item.subtitle}
                </p>

                <p className="text-xs text-[#fdfcf0]/70 mt-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#d47a24]">
                <span>Certified Standard</span>
                <CheckCircle2 className="w-4 h-4 text-[#d47a24]" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Seasoning & Craftsmanship Banner */}
      <div 
        className="mt-12 p-6 sm:p-8 rounded-3xl border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6"
        style={{ background: 'linear-gradient(145deg, #22140a 0%, #160d06 100%)' }}
      >
        <div className="max-w-md">
          <div className="flex items-center gap-2 text-[#d47a24] text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 text-[#d47a24]" />
            <span>Chamber Kiln Seasoning Process</span>
          </div>
          <h4 className="text-xl font-serif font-bold text-[#fdfcf0]">
            Zero Warping. Zero Cracking. Guaranteed.
          </h4>
          <p className="text-xs text-[#fdfcf0]/70 mt-1.5 leading-relaxed">
            Raw unseasoned wood expands and jams during monsoons. Every WOODCRAFT plank undergoes 21 days of computerized kiln drying to lock moisture below 9%.
          </p>
        </div>

        {/* 4 Steps timeline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
          {processSteps.map((step) => (
            <div key={step.step} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-xs font-bold text-[#d47a24]">{step.step}</span>
              <span className="text-xs font-bold text-[#fdfcf0] block mt-0.5">{step.title}</span>
              <span className="text-[10px] text-[#fdfcf0]/50 block mt-0.5">{step.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

