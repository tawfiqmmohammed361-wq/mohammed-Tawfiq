import React, { useState } from 'react';
import { Product, WoodType, WoodFinish } from '../types';
import { WOOD_PRICING_MULTIPLIERS, FINISH_SURCHARGE } from '../data/products';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Ruler, 
  Sparkles, 
  ShoppingBag, 
  Zap, 
  FileText, 
  Heart, 
  Scale, 
  Check, 
  Info,
  ChevronRight,
  Award,
  MessageSquare
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product, 
    wood: WoodType, 
    size: string, 
    finish: WoodFinish, 
    glass?: string, 
    hardware?: string, 
    qty?: number,
    customDims?: { width: number; height: number; thickness: number; notes?: string; customEngravingText?: string }
  ) => void;
  onBuyNow: (
    product: Product, 
    wood: WoodType, 
    size: string, 
    finish: WoodFinish, 
    glass?: string, 
    hardware?: string, 
    qty?: number,
    customDims?: { width: number; height: number; thickness: number; notes?: string; customEngravingText?: string }
  ) => void;
  onRequestQuote: (productName: string, woodType: string, size: string) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isWishlisted: boolean;
  isCompared: boolean;
  whatsappNumber?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onRequestQuote,
  onToggleWishlist,
  onToggleCompare,
  isWishlisted,
  isCompared,
  whatsappNumber = '9842404467',
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedWood, setSelectedWood] = useState<WoodType>(product.woodType);
  const [selectedSize, setSelectedSize] = useState<string>(product.availableSizes[0] || product.dimensions);
  const [selectedFinish, setSelectedFinish] = useState<WoodFinish>(product.finishes[0] || 'Natural Matte');
  const [selectedGlass, setSelectedGlass] = useState<string>(product.glassOption?.[0] || 'None');
  const [selectedHardware, setSelectedHardware] = useState<string>(product.hardware?.[0] || 'None');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'care' | 'custom'>('overview');
  const [engravingText, setEngravingText] = useState(product.supportsEngraving ? 'SAHI SAMI SABEER' : '');

  // Custom Dimensions State (if user chooses custom sizes)
  const [isCustomSize, setIsCustomSize] = useState(selectedSize.includes('Custom'));
  const [customWidth, setCustomWidth] = useState(42); // in inches
  const [customHeight, setCustomHeight] = useState(84); // in inches
  const [customThickness, setCustomThickness] = useState(40); // in mm
  const [customNotes, setCustomNotes] = useState('');

  // Calculate dynamic price based on wood multiplier and finish
  const basePrice = product.price;
  const woodMultiplier = WOOD_PRICING_MULTIPLIERS[selectedWood] || 1.0;
  const finishCost = FINISH_SURCHARGE[selectedFinish] || 0;
  
  // Custom dimension sq footage multiplier
  let dimensionMultiplier = 1.0;
  if (isCustomSize) {
    const standardSqFt = 3.5 * 7.0; // 24.5 sq ft
    const currentSqFt = (customWidth / 12) * (customHeight / 12);
    dimensionMultiplier = Math.max(0.85, currentSqFt / standardSqFt);
  }

  const calculatedUnitPrice = Math.round((basePrice * woodMultiplier * dimensionMultiplier) + finishCost);
  const totalPrice = calculatedUnitPrice * quantity;
  const originalCalculatedPrice = Math.round(totalPrice * 1.25);

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setIsCustomSize(size.includes('Custom'));
  };

  const handleAddToCartClick = () => {
    onAddToCart(
      product,
      selectedWood,
      isCustomSize ? `Custom: ${customWidth}"W x ${customHeight}"H x ${customThickness}mm` : selectedSize,
      selectedFinish,
      selectedGlass,
      selectedHardware,
      quantity,
      {
        width: customWidth,
        height: customHeight,
        thickness: customThickness,
        notes: customNotes,
        customEngravingText: engravingText.trim() ? engravingText.trim() : undefined,
      }
    );
  };

  const handleBuyNowClick = () => {
    onBuyNow(
      product,
      selectedWood,
      isCustomSize ? `Custom: ${customWidth}"W x ${customHeight}"H x ${customThickness}mm` : selectedSize,
      selectedFinish,
      selectedGlass,
      selectedHardware,
      quantity,
      {
        width: customWidth,
        height: customHeight,
        thickness: customThickness,
        notes: customNotes,
        customEngravingText: engravingText.trim() ? engravingText.trim() : undefined,
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#1a110a] border border-white/15 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Sticky Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#24140a]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-widest text-[#d47a24]">
              {product.categoryName}
            </span>
            <span className="text-white/30">•</span>
            <span className="text-xs text-[#fdfcf0]/80">{product.seasoningGrade}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-[#d47a24] text-white border-[#d47a24]'
                  : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={() => onToggleCompare(product)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#d47a24] text-white border-[#d47a24]'
                  : 'bg-white/5 border-white/15 text-white hover:bg-white/10'
              }`}
              title="Compare"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              id="close-product-modal"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all ml-1 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Multi-image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            
            {/* Main Image Viewport */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-black/40 border border-white/15 shadow-xl">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs text-[#fdfcf0] font-semibold border border-white/10">
                View {activeImageIndex + 1} of {product.images.length}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-semibold">{selectedWood} • {selectedFinish}</span>
                <span className="bg-[#d47a24] px-2.5 py-0.5 rounded-full font-bold">100% Solid Heartwood</span>
              </div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeImageIndex
                      ? 'border-[#d9661c] ring-2 ring-[#d9661c]/50 scale-105'
                      : 'border-white/20 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Quick Guarantees Badge */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <ShieldCheck className="w-4 h-4 text-[#ffaa6b] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-white block">15-Yr Warranty</span>
                <span className="text-[9px] text-[#fedbc4]/60">Anti-termite & warp</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <Truck className="w-4 h-4 text-[#ffaa6b] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-white block">Pan-India Delivery</span>
                <span className="text-[9px] text-[#fedbc4]/60">Safe wooden crate</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                <Ruler className="w-4 h-4 text-[#ffaa6b] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-white block">Free Measurement</span>
                <span className="text-[9px] text-[#fedbc4]/60">Carpenter site visit</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details, Options, & Customizer */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Rating & In-Stock */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[#d47a24]">
                  <Star className="w-4 h-4 fill-[#d47a24]" />
                  <span className="text-sm font-bold text-white">{product.rating}</span>
                  <span className="text-xs text-[#fdfcf0]/60">({product.reviewsCount} customer reviews)</span>
                </div>
                <span className="text-white/20">•</span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Ready for Crafting
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0] mt-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm text-[#fdfcf0]/80 mt-1 leading-relaxed">
                {product.subtitle}
              </p>

              {/* Pricing Section with Dynamic Updates */}
              <div className="my-5 p-4 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#fdfcf0]/70 font-semibold block">
                    Total Estimated Price (Incl. GST)
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-bold font-serif text-white">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-[#fdfcf0]/50 line-through">
                      ₹{originalCalculatedPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-[#d47a24]/20 border border-[#d47a24]/40 text-[#d47a24] text-xs font-bold block">
                    Save ₹{(originalCalculatedPrice - totalPrice).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#fdfcf0]/60 mt-1 block">
                    30% Booking Advance: ₹{Math.round(totalPrice * 0.3).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Option Selectors Tabs */}
              <div className="space-y-4">
                
                {/* 1. Hardwood Type Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] flex items-center justify-between mb-2">
                    <span>1. Select Wood Species:</span>
                    <span className="text-white font-medium">{selectedWood}</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.availableWoods.map((wood) => {
                      const isSelected = selectedWood === wood;
                      return (
                        <button
                          key={wood}
                          onClick={() => setSelectedWood(wood)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#d47a24] text-white border-[#d47a24] shadow-md shadow-[#d47a24]/30'
                              : 'bg-white/5 border-white/10 text-[#fdfcf0] hover:bg-white/10'
                          }`}
                        >
                          <span className="block leading-snug">{wood}</span>
                          <span className="text-[10px] opacity-75">
                            {WOOD_PRICING_MULTIPLIERS[wood] > 1 ? `+${Math.round((WOOD_PRICING_MULTIPLIERS[wood] - 1) * 100)}%` : 'Base Price'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Dimensions / Size Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] flex items-center justify-between mb-2">
                    <span>2. Door / Window Size:</span>
                    <span className="text-white font-medium">{selectedSize}</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.availableSizes.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#d47a24] text-white border-[#d47a24] shadow-md shadow-[#d47a24]/30'
                              : 'bg-white/5 border-white/10 text-[#fdfcf0] hover:bg-white/10'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Sizing Sub-form when selected */}
                  {isCustomSize && (
                    <div className="mt-3 p-3.5 rounded-xl bg-black/60 border border-white/15 space-y-3">
                      <span className="text-[11px] font-bold text-[#d47a24] block">
                        Enter Your Custom Measurements (Millimeter Precision):
                      </span>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-[#fdfcf0]/70 block mb-1">Width (Inches)</label>
                          <input
                            type="number"
                            min="24"
                            max="72"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#fdfcf0]/70 block mb-1">Height (Inches)</label>
                          <input
                            type="number"
                            min="48"
                            max="120"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#fdfcf0]/70 block mb-1">Thickness</label>
                          <select
                            value={customThickness}
                            onChange={(e) => setCustomThickness(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white"
                          >
                            <option value={32}>32 mm (Internal)</option>
                            <option value={38}>38 mm (Heavy)</option>
                            <option value={45}>45 mm (Main Entry)</option>
                            <option value={50}>50 mm (Pivot / Villa)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Polish & Finish Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] flex items-center justify-between mb-2">
                    <span>3. Wood Polish / Finish:</span>
                    <span className="text-white font-medium">{selectedFinish}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((finish) => {
                      const isSelected = selectedFinish === finish;
                      return (
                        <button
                          key={finish}
                          onClick={() => setSelectedFinish(finish)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-white text-[#1a110a] border-white font-bold shadow'
                              : 'bg-white/5 text-[#fdfcf0] border-white/15 hover:bg-white/10'
                          }`}
                        >
                          {finish}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Glass & Hardware Options */}
                {product.glassOption && product.glassOption.length > 0 && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] block mb-2">
                      4. Glass Option:
                    </label>
                    <select
                      value={selectedGlass}
                      onChange={(e) => setSelectedGlass(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                    >
                      {product.glassOption.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 5. Custom Engraved Name / Initials (for personalized headboards, cots, doors) */}
                {(product.supportsEngraving || product.category === 'headboards' || product.category === 'cots-beds') && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#2a170b] to-[#1e1008] border border-[#d47a24]/40 shadow-inner">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Personalized Name / Family Crest Engraving:</span>
                      </label>
                      <span className="text-[10px] bg-[#d47a24]/20 text-[#d47a24] px-2 py-0.5 rounded-full font-bold border border-[#d47a24]/30">
                        FREE Workshop Service
                      </span>
                    </div>
                    <p className="text-[11px] text-[#fdfcf0]/70 mb-2.5">
                      Enter the names or initials you want hand-chiseled into the central heart / wood medallion.
                    </p>
                    <input
                      type="text"
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                      placeholder={product.engravingPlaceholder || 'e.g. SAHI SAMI SABEER or RRRR'}
                      maxLength={35}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/25 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24] focus:ring-1 focus:ring-[#d47a24] uppercase tracking-widest font-mono"
                    />

                    {/* Live Carved Timber Preview Banner */}
                    {engravingText.trim() && (
                      <div className="mt-2.5 p-3 rounded-xl bg-[#140b06] border border-[#d47a24]/30 text-center">
                        <span className="text-[9px] uppercase tracking-widest text-[#d47a24]/80 block font-bold">
                          Live Workshop Carving Preview:
                        </span>
                        <div className="font-serif italic font-black text-base text-[#ffc68a] tracking-widest mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          ❦ {engravingText.toUpperCase()} ❦
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Quantity, Add to Cart, Buy Now, Custom Quote */}
            <div className="mt-8 pt-6 border-t border-white/15 space-y-3">
              
              {/* Quantity Counter & Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#fdfcf0]">Quantity:</span>
                  <div className="flex items-center border border-white/20 rounded-full bg-black/40 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRequestQuote(product.name, selectedWood, selectedSize)}
                  className="text-xs font-bold text-[#d47a24] hover:text-white flex items-center gap-1 underline underline-offset-4 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Request Custom Quote</span>
                </button>
              </div>

              {/* Primary Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="modal-add-to-cart"
                  onClick={handleAddToCartClick}
                  className="py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#d47a24]" />
                  <span>Add to Cart</span>
                </button>

                <button
                  id="modal-buy-now"
                  onClick={handleBuyNowClick}
                  className="py-3.5 rounded-full bg-[#d47a24] hover:bg-[#be6a1c] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d47a24]/30 active:scale-95 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now (₹{totalPrice.toLocaleString('en-IN')})</span>
                </button>
              </div>

              {/* WhatsApp Quick Enquiry Button */}
              {(() => {
                const cleanPhone = (whatsappNumber || '9842404467').replace(/[^0-9]/g, '');
                const engravingNote = engravingText.trim() ? `\nCustom Engraved Name: ${engravingText.trim()}` : '';
                const waMessage = `Hello WOODCRAFT,\n\nI saw your website and I'm interested in this product.\n\nProduct: ${product.name}\nProduct ID: ${product.id.toUpperCase()}\nWood: ${selectedWood}\nSize: ${selectedSize}\nFinish: ${selectedFinish}${engravingNote}\nPrice: ₹${totalPrice.toLocaleString('en-IN')}\nQuantity: ${quantity}\n\nI'd like to know more about availability, dimensions and delivery.\n\nThank you.`;
                return (
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md border border-emerald-400/30 cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enquire on WhatsApp (Direct to Workshop)</span>
                  </a>
                );
              })()}

              {/* Have Questions? Section */}
              <div className="p-4 rounded-2xl bg-[#24150c] border border-[#d47a24]/30 flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Have Questions?</span>
                  </h4>
                  <p className="text-[11px] text-[#fdfcf0]/80 mt-0.5">
                    Not sure which door is right for your home? Talk to us. We'll help you choose.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`tel:${(whatsappNumber || '9842404467').replace(/[^0-9]/g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white transition-all"
                  >
                    Call Us
                  </a>
                  <a
                    href={`https://wa.me/${(whatsappNumber || '9842404467').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello WOODCRAFT,\nI need advice on choosing the right door for my home: ${product.name} (Product ID: ${product.id.toUpperCase()})`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-500 text-[11px] font-bold text-white transition-all"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Technical Specifications Accordion / Footer Tab */}
        <div className="p-6 bg-black/50 border-t border-white/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#d47a24] mb-3">
            Craftsmanship & Technical Specifications:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#fdfcf0]/80">
            <div>
              <span className="text-[10px] text-[#fdfcf0]/50 block">Moisture Content</span>
              <span className="font-semibold text-white">&lt; 8-10% Kiln Dried</span>
            </div>
            <div>
              <span className="text-[10px] text-[#fdfcf0]/50 block">Structural Warranty</span>
              <span className="font-semibold text-white">{product.warranty.split(' ')[0]} {product.warranty.split(' ')[1]}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#fdfcf0]/50 block">Timber Certification</span>
              <span className="font-semibold text-white">100% Legal FSC Certified</span>
            </div>
            <div>
              <span className="text-[10px] text-[#fdfcf0]/50 block">Surface Sealant</span>
              <span className="font-semibold text-white">German 4-Coat Polyurethane</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
