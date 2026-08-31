import React, { useState } from 'react';
import { CartItem } from '../types';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  Check, 
  Sparkles,
  Compass
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  onExploreProducts,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  // 18% GST on architectural timber joinery
  const gst = Math.round(subtotal * 0.18);
  
  // Free delivery on orders over ₹25,000
  const shipping = subtotal > 25000 || subtotal === 0 ? 0 : 2500;
  
  const discountAmount = appliedPromo ? Math.round(subtotal * promoDiscount) : 0;
  const total = subtotal + gst + shipping - discountAmount;
  const bookingAdvance30 = Math.round(total * 0.3);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'WOODCRAFT10' || promoCode.trim().toUpperCase() === 'WELCOME10') {
      setAppliedPromo(promoCode.trim().toUpperCase());
      setPromoDiscount(0.10);
    } else {
      alert('Invalid coupon. Try WELCOME10 for 10% discount on your order!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Slide-out Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Right Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#190a03] border-l border-[#ff8d3f]/25 shadow-2xl flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#230f06]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#d9661c]" />
              <h3 className="font-serif-luxury font-bold text-lg text-white">
                Your Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})
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

          {/* Cart Items List Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#d9661c] mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury font-bold text-lg text-white">Your Cart is Empty</h4>
                <p className="text-xs text-[#fedbc4]/70 mt-1 max-w-xs mx-auto">
                  Explore our solid teak doors, casement windows, or create a custom architectural design.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExploreProducts();
                  }}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#d9661c] text-white text-xs font-bold shadow-lg"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 flex gap-4 relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif-luxury font-bold text-sm text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-white/40 hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Wood & Size */}
                      <div className="text-[11px] text-[#fedbc4]/80 mt-1 space-y-0.5">
                        <div><strong className="text-white">Wood:</strong> {item.selectedWood}</div>
                        <div><strong className="text-white">Size:</strong> {item.selectedSize}</div>
                        <div><strong className="text-white">Finish:</strong> {item.selectedFinish}</div>
                        {(item.customEngravingText || item.customConfig?.customEngravingText) && (
                          <div className="text-[#ffaa6b] font-semibold text-[10px] bg-[#ffaa6b]/10 px-2 py-0.5 rounded border border-[#ffaa6b]/20 mt-1 inline-block">
                            Engraving: <span className="font-bold text-white tracking-wider">"{item.customEngravingText || item.customConfig?.customEngravingText}"</span>
                          </div>
                        )}
                        {item.isCustom && (
                          <div className="text-[#ffaa6b] font-bold text-[10px] flex items-center gap-1">
                            <Compass className="w-3 h-3" /> Bespoke Custom Blueprint
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price & Quantity Adjuster */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="font-bold text-white text-sm">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>

                      <div className="flex items-center border border-white/20 rounded-full bg-black/60 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-full hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-full hover:bg-white/20 text-white font-bold flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#230f06] border-t border-white/10 space-y-4">
              
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#fedbc4]/50" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white uppercase placeholder:normal-case placeholder-[#fedbc4]/40 focus:outline-none focus:border-[#d9661c]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center justify-between bg-emerald-950/30 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                  <span>✓ Promo code <strong>{appliedPromo}</strong> applied (10% OFF)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#fedbc4]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18% Timber Joinery)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wooden Crate Freight Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shipping.toLocaleString('en-IN')}`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Order Value</span>
                  <span className="text-base font-serif-luxury text-[#ffaa6b]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* 30% Booking Token Callout */}
              <div className="p-3 rounded-xl bg-black/40 border border-[#ff8d3f]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#fedbc4]/70 block">30% Booking Advance Option:</span>
                  <strong className="text-white font-bold">₹{bookingAdvance30.toLocaleString('en-IN')}</strong>
                </div>
                <span className="text-[10px] text-[#ffaa6b] font-semibold text-right">
                  Balance on Door Delivery & Inspection
                </span>
              </div>

              {/* Checkout Button */}
              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#d9661c] to-[#a83f08] hover:from-[#eb7323] hover:to-[#bc470a] text-white font-bold text-sm shadow-xl shadow-[#d9661c]/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <span>Proceed to Checkout (₹{total.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
