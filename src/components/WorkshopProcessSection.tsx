import React, { useState } from 'react';
import { 
  TreePine, Flame, Scissors, Hammer, Sparkles, Paintbrush, 
  CheckCircle2, Truck, ChevronRight, ArrowRight, ShieldCheck, MessageSquare 
} from 'lucide-react';
import { BusinessSettings } from '../types';

interface WorkshopProcessSectionProps {
  settings?: BusinessSettings | null;
  onOpenQuote?: () => void;
}

export const WorkshopProcessSection: React.FC<WorkshopProcessSectionProps> = ({ settings, onOpenQuote }) => {
  const [activeStage, setActiveStage] = useState(0);

  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const stages = [
    {
      id: 'selection',
      stepNumber: '01',
      title: 'Timber Selection',
      icon: TreePine,
      shortDesc: 'Hand-inspecting logs for grain density, age, and zero sapwood.',
      detail: 'We personally visit government-certified timber depots to select mature, slow-grown Burma Teak, African Teak, and Rosewood logs. We check growth ring density and ensure there is no soft sapwood or hidden knots that could weaken the door structure.',
      whyItMatters: 'Mature heartwood contains natural oils that resist termites, moisture, and fungal decay for decades.',
      image: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1000&q=80',
      specs: ['Log Maturity: 35+ Years', 'Heartwood Purity: 100%', 'Inspection: Log by Log']
    },
    {
      id: 'seasoning',
      stepNumber: '02',
      title: 'Wood Seasoning',
      icon: Flame,
      shortDesc: 'Controlled kiln drying to 8–10% moisture content.',
      detail: 'Raw timber is placed inside our specialized vacuum and temperature-controlled kiln seasoning chamber. We slowly extract excess cellular moisture until the wood reaches a stable 8–10% moisture level matching indoor humidity.',
      whyItMatters: 'Unseasoned wood bends and jams during monsoon. Proper kiln seasoning ensures your door stays perfectly straight year-round.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      specs: ['Moisture Level: 8% - 10%', 'Chamber Time: 18–24 Days', 'Anti-Warp Guaranteed']
    },
    {
      id: 'cutting',
      stepNumber: '03',
      title: 'Precision Cutting',
      icon: Scissors,
      shortDesc: 'Slicing stable planks along the natural grain line.',
      detail: 'Once seasoned, the logs are precision-sawn into thick, sturdy timber planks. Our sawyers align every cut with the grain direction (quarter-sawn or rift-sawn) to maximize structural strength and showcase stunning natural wood figures.',
      whyItMatters: 'Cutting along natural grain lines prevents seasonal expansion stress and highlights beautiful wood textures.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
      specs: ['Thickness: 38mm to 50mm Solid Core', 'Grain Alignment: Book-Matched', 'Tolerance: ±0.5mm']
    },
    {
      id: 'carpentry',
      stepNumber: '04',
      title: 'Carpentry & Joinery',
      icon: Hammer,
      shortDesc: 'Interlocking mortise-and-tenon joints crafted by senior artisans.',
      detail: 'Our master carpenters construct the door frames and panel insets using traditional deep mortise-and-tenon joinery. Each tenon is precision-chiseled to interlock snugly without depending solely on screws or glue.',
      whyItMatters: 'Mortise-and-tenon joints have held ancient wooden architecture together for centuries; they never wobble or sag over time.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
      specs: ['Joinery: Full Mortise & Tenon', 'Carving: Hand-Relief & CNC Hybrid', 'Reinforced Stiles']
    },
    {
      id: 'sanding',
      stepNumber: '05',
      title: 'Hand Sanding',
      icon: Sparkles,
      shortDesc: 'Multi-stage grit progression from 80 to 400 grit.',
      detail: 'The assembled door is carefully hand-sanded in five gradual stages (80, 120, 180, 240, and 400 grit). Between sandings, we lightly mist the surface with water to raise any hidden fibers and smooth them away.',
      whyItMatters: 'Thorough sanding gives the wood a silky, touchable feel and allows rich stains to penetrate evenly into the pores.',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1000&q=80',
      specs: ['Sanding Stages: 5 Grit Levels', 'Grain Raising: 2 Cycles', 'Touch Finish: Silky Smooth']
    },
    {
      id: 'polishing',
      stepNumber: '06',
      title: 'Hand Polishing',
      icon: Paintbrush,
      shortDesc: '4 coats of breathable natural stains and protective PU sealant.',
      detail: 'We apply hand-rubbed wood stains (such as Honey Oak, Deep Walnut, or Natural Teak) followed by multiple coats of German polyurethane (PU) sealants. This protects the timber against UV rays, spills, and rain while letting the natural grain breathe.',
      whyItMatters: 'High-grade PU polish shields the timber from rain and sunlight without yellowing or peeling over the years.',
      image: 'https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1000&q=80',
      specs: ['Coating: 4-Layer PU System', 'Finish Choices: Matte / Satin / Gloss', 'Weather & UV Proof']
    },
    {
      id: 'quality',
      stepNumber: '07',
      title: 'Quality Check',
      icon: CheckCircle2,
      shortDesc: '8-point diagonal squareness and lock tolerance inspection.',
      detail: 'Before packing, each door undergoes rigorous quality testing: diagonal corner-to-corner squareness, hinge mortise depth check, laser leveling test, and moisture re-verification. Any piece failing standard tolerances is reworked.',
      whyItMatters: 'Even a 2mm misalignment can cause latch friction. Our strict inspection ensures effortless opening and silent closing.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      specs: ['Inspection Points: 8 Parameters', 'Squareness Check: Diagonal Laser', 'Certificate: Signed by Artisan']
    },
    {
      id: 'installation',
      stepNumber: '08',
      title: 'Installation & Fitting',
      icon: Truck,
      shortDesc: 'White-glove wooden crate delivery and expert on-site mounting.',
      detail: 'The finished door is wrapped in shock-absorbing foam and secured in a sturdy wooden crate for transit. Our skilled carpenters or certified fitting team level the frame, mount heavy-duty ball-bearing hinges, and calibrate locks at your home.',
      whyItMatters: 'A great door needs a true frame. Proper installation ensures a perfectly balanced swing, airtight sealing, and security.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      specs: ['Packing: Heavy Wood Crate', 'Mounting: Precision Laser Level', 'Testing: 100 Swing Cycles']
    }
  ];

  const current = stages[activeStage];

  return (
    <section id="workshop" className="py-20 sm:py-28 bg-[#120904] relative border-b border-white/10 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#d47a24]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d47a24]/15 border border-[#d47a24]/30 text-[#d47a24] text-xs font-bold uppercase tracking-widest mb-4">
            <Hammer className="w-3.5 h-3.5" />
            <span>Honest Craftsmanship Process</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            See How Your Door Is Made
          </h2>
          <p className="text-sm sm:text-base text-[#fdfcf0]/75 mt-4 leading-relaxed font-light">
            We believe in complete transparency. Here is the actual 8-stage woodworking journey every tree takes before it becomes a grand entrance for your home.
          </p>
        </div>

        {/* Horizontal Process Steps Bar */}
        <div className="flex items-center justify-between overflow-x-auto pb-4 mb-10 gap-2 scrollbar-thin">
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all shrink-0 cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#d47a24] text-white border-[#d47a24] shadow-lg shadow-[#d47a24]/20 scale-105'
                    : 'bg-[#1e1109] text-[#fdfcf0]/70 border-white/10 hover:bg-[#28170d] hover:text-white'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive ? 'bg-black/20 text-white' : 'bg-white/5 text-[#d47a24]'
                }`}>
                  {stage.stepNumber}
                </div>
                <div className="whitespace-nowrap">
                  <div className="text-xs font-bold">{stage.title}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Showcase Card */}
        <div className="bg-[#1c1008] rounded-3xl border border-white/15 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Workshop Stage Photo */}
          <div className="lg:col-span-6 relative min-h-[350px] sm:min-h-[450px]">
            <img
              src={current.image}
              alt={`${current.title} workshop stage`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs text-[#fdfcf0] font-bold">
              Stage {current.stepNumber} of 08: {current.title}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
              {current.specs.map((spec, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-amber-200"
                >
                  ✓ {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Stage Explanation & Why It Matters */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#d47a24] mb-2">
                <span>Step {current.stepNumber}</span>
                <span className="text-white/30">•</span>
                <span>{current.shortDesc}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4">
                {current.title}
              </h3>

              <p className="text-sm sm:text-base text-[#fdfcf0]/85 leading-relaxed font-light mb-6">
                {current.detail}
              </p>

              {/* Why It Matters Callout */}
              <div className="p-4 rounded-2xl bg-[#28160b] border border-[#d47a24]/30 space-y-1.5">
                <div className="text-xs font-bold text-[#d47a24] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Why This Step Matters for Your Home:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#fdfcf0]/90 leading-relaxed font-medium">
                  {current.whyItMatters}
                </p>
              </div>
            </div>

            {/* Navigation & WhatsApp Enquiry */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 text-xs text-white border border-white/10 transition-all cursor-pointer"
                >
                  &larr; Previous Stage
                </button>
                <button
                  onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white border border-white/15 transition-all cursor-pointer"
                >
                  Next Stage &rarr;
                </button>
              </div>

              <a
                href={`https://wa.me/${cleanWA}?text=${encodeURIComponent(`Hello WOODCRAFT, I was viewing the workshop stage "${current.title}" and would like to ask a question about your wood crafting process.`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Craftsman on WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

        {/* Live Workshop Tour Callout */}
        <div className="mt-10 text-center text-xs text-[#fdfcf0]/60">
          Want to watch this live? You are warmly welcome to visit our Bengaluru workshop and see your door being carved in person.
        </div>

      </div>
    </section>
  );
};
