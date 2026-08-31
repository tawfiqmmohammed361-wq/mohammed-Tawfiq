import React, { useState } from 'react';
import { WoodType, WoodFinish, CustomDesignConfig } from '../types';
import { WOOD_PRICING_MULTIPLIERS, FINISH_SURCHARGE } from '../data/products';
import { 
  Compass, 
  Sparkles, 
  Ruler, 
  Layers, 
  Palette, 
  Check, 
  ShoppingBag, 
  FileText, 
  RotateCw,
  Info,
  ShieldCheck
} from 'lucide-react';

interface CustomDesignStudioProps {
  onAddCustomToCart: (config: CustomDesignConfig, price: number) => void;
  onRequestQuoteWithConfig: (config: CustomDesignConfig, price: number) => void;
}

export const CustomDesignStudio: React.FC<CustomDesignStudioProps> = ({
  onAddCustomToCart,
  onRequestQuoteWithConfig,
}) => {
  const [productType, setProductType] = useState<CustomDesignConfig['productType']>('Main Door');
  const [widthFeet, setWidthFeet] = useState<number>(3);
  const [widthInches, setWidthInches] = useState<number>(6);
  const [heightFeet, setHeightFeet] = useState<number>(7);
  const [heightInches, setHeightInches] = useState<number>(0);
  const [thicknessMm, setThicknessMm] = useState<32 | 38 | 45 | 50>(45);
  const [woodType, setWoodType] = useState<WoodType>('Burma Teak');
  const [designStyle, setDesignStyle] = useState<CustomDesignConfig['designStyle']>('4-Panel Classic Roman');
  const [finish, setFinish] = useState<WoodFinish>('Honey Oak Polish');
  const [glassOption, setGlassOption] = useState<CustomDesignConfig['glassOption']>('None (Solid Wood)');
  const [hardware, setHardware] = useState<CustomDesignConfig['hardware']>('Antique Brass Heritage Handle & Lock');
  const [includeFrame, setIncludeFrame] = useState<boolean>(true);
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [customSuccess, setCustomSuccess] = useState<boolean>(false);

  // Calculate Sq Footage & Base Price
  const totalWidthInches = (widthFeet * 12) + widthInches;
  const totalHeightInches = (heightFeet * 12) + heightInches;
  const squareFeet = (totalWidthInches * totalHeightInches) / 144;

  // Base price per sq ft based on timber type & thickness
  const baseRatePerSqFt = {
    'Burma Teak': 1250,
    'Indian Rosewood (Sheesham)': 1100,
    'American White Oak': 980,
    'African Teak (CP)': 850,
    'Mahogany': 920,
    'Honshu Pine': 650,
    'Red Meranti': 700,
  }[woodType] || 850;

  // Thickness factor
  const thicknessFactor = {
    32: 0.9,
    38: 1.0,
    45: 1.15,
    50: 1.3,
  }[thicknessMm];

  // Design style surcharge
  const styleSurcharge = {
    'Minimal Plain Solid': 0,
    '4-Panel Classic Roman': 2500,
    'CNC Geometric Lattice': 4500,
    'Sacred Brass Inset': 6000,
    'Fluted Glass Contemporary': 3800,
    'Chevron Herringbone Inlay': 5200,
  }[designStyle];

  // Frame cost
  const frameCost = includeFrame ? Math.round((totalHeightInches * 2 + totalWidthInches) / 12 * 380) : 0;
  
  // Glass cost
  const glassCost = glassOption.includes('None') ? 0 : 2200;

  // Hardware cost
  const hardwareCost = hardware.includes('None') ? 0 : 3500;

  // Finish cost
  const finishCost = FINISH_SURCHARGE[finish] || 1500;

  // Final Estimated Total
  const estimatedTotal = Math.round(
    (squareFeet * baseRatePerSqFt * thicknessFactor) +
    styleSurcharge +
    frameCost +
    glassCost +
    hardwareCost +
    finishCost
  );

  const currentConfig: CustomDesignConfig = {
    productType,
    widthFeet,
    widthInches,
    heightFeet,
    heightInches,
    thicknessMm,
    woodType,
    designStyle,
    finish,
    glassOption,
    hardware,
    includeFrame,
    additionalNotes,
  };

  // Color tone simulation based on finish
  const getWoodToneBg = () => {
    switch (finish) {
      case 'Honey Oak Polish':
        return 'from-[#a1551a] via-[#853f0b] to-[#592404]';
      case 'Deep Walnut Gloss':
        return 'from-[#4a2411] via-[#33180b] to-[#1e0d05]';
      case 'Espresso Dark':
        return 'from-[#2e160a] via-[#1a0c05] to-[#0e0602]';
      case 'Natural Matte':
        return 'from-[#bd7a3d] via-[#9e5c24] to-[#6d3a10]';
      case 'Rustic Weathered':
        return 'from-[#7a5338] via-[#5c3e29] to-[#3a2517]';
      default:
        return 'from-[#a1551a] via-[#853f0b] to-[#592404]';
    }
  };

  const handleAddToCart = () => {
    onAddCustomToCart(currentConfig, estimatedTotal);
    setCustomSuccess(true);
    setTimeout(() => setCustomSuccess(false), 3000);
  };

  return (
    <section id="custom-design" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Container with luxury border and warm backdrop */}
      <div className="relative rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 bg-gradient-to-br from-[#2a1409] via-[#1f0d05] to-[#120702] border border-[#ff8d3f]/30 shadow-2xl shadow-black overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d9661c]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ffaa6b]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Section Heading matching user prompt */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d9661c]/20 border border-[#d9661c]/40 text-xs font-bold text-[#ffaa6b] mb-4">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span className="uppercase tracking-wider">3D Architectural Studio</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white tracking-tight">
            Designed For Your Home
          </h2>

          <p className="mt-4 text-[#fedbc4]/90 text-sm sm:text-base leading-relaxed">
            Choose your wood, size, finish and design. We create doors and windows according to your requirements.
          </p>
        </div>

        {/* Studio Grid: Left Configurator Controls | Right Interactive Live Visual Preview */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT 7 COLUMNS: Step-by-Step Customization Panel */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Product Category */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-[#ffaa6b] flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-[#d9661c] text-white flex items-center justify-center text-[10px]">1</span>
                <span>Select Architectural Item Type</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Main Door',
                  'Bedroom Door',
                  'Pooja Door',
                  'Wooden Window',
                  'Sliding Window',
                  'French Door',
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setProductType(type as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                      productType === type
                        ? 'bg-[#d9661c] text-white border-[#d9661c] shadow-md'
                        : 'bg-white/5 border-white/10 text-[#fedbc4] hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dimensions & Thickness */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-[#ffaa6b] flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d9661c] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Custom Measurements</span>
                </div>
                <span className="text-xs text-white font-bold">{squareFeet.toFixed(2)} Sq. Ft.</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Width */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[10px] text-[#fedbc4]/70 uppercase font-semibold block mb-1.5">Width</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={widthFeet}
                      onChange={(e) => setWidthFeet(Number(e.target.value))}
                      className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {[2, 3, 4, 5, 6, 8].map(ft => (
                        <option key={ft} value={ft}>{ft} ft</option>
                      ))}
                    </select>
                    <select
                      value={widthInches}
                      onChange={(e) => setWidthInches(Number(e.target.value))}
                      className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {[0, 2, 4, 6, 8, 10].map(inch => (
                        <option key={inch} value={inch}>{inch} in</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Height */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[10px] text-[#fedbc4]/70 uppercase font-semibold block mb-1.5">Height</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {[4, 5, 6, 7, 8, 9, 10].map(ft => (
                        <option key={ft} value={ft}>{ft} ft</option>
                      ))}
                    </select>
                    <select
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                    >
                      {[0, 3, 6, 9].map(inch => (
                        <option key={inch} value={inch}>{inch} in</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Thickness */}
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[10px] text-[#fedbc4]/70 uppercase font-semibold block mb-1.5">Shutter Thickness</span>
                  <select
                    value={thicknessMm}
                    onChange={(e) => setThicknessMm(Number(e.target.value) as any)}
                    className="w-full bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs text-white"
                  >
                    <option value={32}>32 mm (Interior)</option>
                    <option value={38}>38 mm (Heavy Duty)</option>
                    <option value={45}>45 mm (Main Entry)</option>
                    <option value={50}>50 mm (Grand Pivot)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Wood Species */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
              <label className="text-xs font-bold uppercase tracking-wider text-[#ffaa6b] flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d9661c] text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Select Seasoned Hardwood</span>
                </div>
                <span className="text-white font-semibold text-xs">{woodType}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Burma Teak',
                  'African Teak (CP)',
                  'Indian Rosewood (Sheesham)',
                  'American White Oak',
                  'Mahogany',
                  'Honshu Pine',
                ].map((wood) => (
                  <button
                    key={wood}
                    onClick={() => setWoodType(wood as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                      woodType === wood
                        ? 'bg-[#d9661c] text-white border-[#d9661c] shadow-md'
                        : 'bg-white/5 border-white/10 text-[#fedbc4] hover:bg-white/10'
                    }`}
                  >
                    <span className="block">{wood}</span>
                    <span className="text-[10px] opacity-70">100% Solid Heartwood</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Design Style & Finish */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Design Pattern */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ffaa6b] flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#d9661c] text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Carving & Style</span>
                </label>
                <div className="space-y-2">
                  {[
                    '4-Panel Classic Roman',
                    'Minimal Plain Solid',
                    'CNC Geometric Lattice',
                    'Sacred Brass Inset',
                    'Fluted Glass Contemporary',
                    'Chevron Herringbone Inlay',
                  ].map((style) => (
                    <button
                      key={style}
                      onClick={() => setDesignStyle(style as any)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        designStyle === style
                          ? 'bg-[#d9661c] text-white border-[#d9661c] shadow-md'
                          : 'bg-white/5 border-white/10 text-[#fedbc4] hover:bg-white/10'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Polish / Finish */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ffaa6b] flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-[#d9661c] text-white flex items-center justify-center text-[10px]">5</span>
                  <span>Surface Polish</span>
                </label>
                <div className="space-y-2">
                  {[
                    'Honey Oak Polish',
                    'Natural Matte',
                    'Deep Walnut Gloss',
                    'Espresso Dark',
                    'Rustic Weathered',
                  ].map((fin) => (
                    <button
                      key={fin}
                      onClick={() => setFinish(fin as any)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                        finish === fin
                          ? 'bg-white text-[#1c0a02] border-white font-bold shadow'
                          : 'bg-white/5 border-white/10 text-[#fedbc4] hover:bg-white/10'
                      }`}
                    >
                      {fin}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Frame & Hardware Options Checkbox */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeFrame}
                  onChange={(e) => setIncludeFrame(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#d9661c]"
                />
                <span className="text-xs text-white font-semibold">
                  Include Matching Solid Timber Outer Door Frame (Chowkhat)
                </span>
              </label>
            </div>
          </div>

          {/* RIGHT 5 COLUMNS: Live Visual Simulation Canvas & Realtime Estimate */}
          <div className="lg:col-span-5 sticky top-24 space-y-6">
            
            {/* 3D Visual Rendering Canvas */}
            <div className="relative rounded-3xl overflow-hidden bg-black/70 border border-[#ff8d3f]/30 p-6 shadow-2xl flex flex-col items-center justify-center min-h-[460px]">
              
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] text-[#ffaa6b] font-bold">
                LIVE BLUEPRINT SIMULATION
              </div>

              {/* Realistic Door Frame Container */}
              <div 
                className={`relative w-48 sm:w-56 aspect-[1/2] rounded-t-xl rounded-b-sm border-8 transition-all duration-700 shadow-2xl flex flex-col justify-between p-3 ${
                  includeFrame ? 'border-[#381c0c] ring-2 ring-[#703918]' : 'border-transparent'
                } bg-gradient-to-b ${getWoodToneBg()}`}
              >
                {/* Wood Grain Texture Lines */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                {/* Render Style Overlay */}
                {designStyle === '4-Panel Classic Roman' && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full z-10">
                    <div className="rounded border-2 border-black/30 bg-black/10 shadow-inner"></div>
                    <div className="rounded border-2 border-black/30 bg-black/10 shadow-inner"></div>
                    <div className="rounded border-2 border-black/30 bg-black/10 shadow-inner"></div>
                    <div className="rounded border-2 border-black/30 bg-black/10 shadow-inner"></div>
                  </div>
                )}

                {designStyle === 'CNC Geometric Lattice' && (
                  <div className="h-full w-full rounded border-2 border-amber-900/40 bg-black/30 flex items-center justify-center p-2 z-10">
                    <div className="w-full h-full border border-dashed border-amber-400/40 rounded flex items-center justify-center text-[10px] text-amber-200/80 font-serif">
                      CNC Jali Lattice
                    </div>
                  </div>
                )}

                {designStyle === 'Sacred Brass Inset' && (
                  <div className="h-full w-full flex flex-col justify-around items-center z-10">
                    <div className="w-6 h-6 rounded-full bg-amber-400/80 border border-amber-200 shadow-lg flex items-center justify-center text-[8px] text-black font-bold">
                      🔔
                    </div>
                    <div className="w-full h-0.5 bg-amber-400/60 shadow"></div>
                    <div className="w-6 h-6 rounded-full bg-amber-400/80 border border-amber-200 shadow-lg flex items-center justify-center text-[8px] text-black font-bold">
                      🔔
                    </div>
                  </div>
                )}

                {designStyle === 'Fluted Glass Contemporary' && (
                  <div className="h-full w-full flex gap-1 z-10">
                    <div className="w-1/2 h-full rounded bg-black/20 border border-black/20"></div>
                    <div className="w-1/2 h-full rounded bg-cyan-900/20 backdrop-blur-sm border border-cyan-300/30 flex items-center justify-center text-[9px] text-cyan-200">
                      Fluted Glass
                    </div>
                  </div>
                )}

                {designStyle === 'Chevron Herringbone Inlay' && (
                  <div className="h-full w-full flex flex-col justify-around opacity-75 z-10">
                    <div className="w-full h-1 bg-amber-300/60 rotate-12"></div>
                    <div className="w-full h-1 bg-amber-300/60 -rotate-12"></div>
                    <div className="w-full h-1 bg-amber-300/60 rotate-12"></div>
                  </div>
                )}

                {/* Handle & Lock Hardware simulation */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-10 rounded-sm bg-gradient-to-b from-amber-300 to-amber-600 shadow-md border border-amber-200/50 z-20"></div>
              </div>

              {/* Blueprint Dimension Tags */}
              <div className="mt-4 flex items-center gap-4 text-xs text-[#fedbc4]/80">
                <span className="font-semibold">{widthFeet}'-{widthInches}" W × {heightFeet}'-{heightInches}" H</span>
                <span>•</span>
                <span>{thicknessMm} mm Core</span>
                <span>•</span>
                <span className="text-[#ffaa6b] font-bold">{woodType}</span>
              </div>
            </div>

            {/* Instant Real-Time Price Estimate Box */}
            <div className="p-6 rounded-3xl bg-black/60 border border-[#ff8d3f]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#fedbc4]/70 font-semibold block">
                    Custom Instant Quotation
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold font-serif-luxury text-white mt-1">
                    ₹{estimatedTotal.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-bold block">
                    ✓ All Taxes Included
                  </span>
                  <span className="text-[10px] text-[#fedbc4]/60">
                    Free Site Measurement
                  </span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#fedbc4]/80">
                <div className="flex justify-between">
                  <span>Solid Timber ({squareFeet.toFixed(1)} sq ft @ {woodType})</span>
                  <span>₹{Math.round(squareFeet * baseRatePerSqFt * thicknessFactor).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Craftsmanship & Pattern ({designStyle})</span>
                  <span>₹{styleSurcharge.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Surface Treatment ({finish})</span>
                  <span>₹{finishCost.toLocaleString('en-IN')}</span>
                </div>
                {includeFrame && (
                  <div className="flex justify-between">
                    <span>Timber Frame (Chowkhat)</span>
                    <span>₹{frameCost.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              {/* Custom Actions */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <button
                  id="add-custom-to-cart-btn"
                  onClick={handleAddToCart}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d9661c] to-[#a83f08] hover:from-[#eb7323] hover:to-[#bc470a] text-white font-bold text-sm shadow-xl shadow-[#d9661c]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{customSuccess ? '✓ Added Custom Door!' : 'Add Custom Door to Cart'}</span>
                </button>

                <button
                  id="custom-request-quote-btn"
                  onClick={() => onRequestQuoteWithConfig(currentConfig, estimatedTotal)}
                  className="w-full py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-[#ffaa6b]" />
                  <span>Get Engineer Quote & Free Carpenter Visit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
