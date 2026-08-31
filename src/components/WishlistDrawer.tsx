import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#190a03] border-l border-[#ff8d3f]/25 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#230f06]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#d9661c] fill-[#d9661c]" />
              <h3 className="font-serif-luxury font-bold text-lg text-white">
                Saved Wishlist ({wishlistItems.length})
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

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#d9661c] mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <h4 className="font-serif-luxury font-bold text-lg text-white">No Saved Items</h4>
                <p className="text-xs text-[#fedbc4]/70 mt-1 max-w-xs mx-auto">
                  Click the heart icon on any door or window to save it for later comparison or custom quotation.
                </p>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 flex gap-4 group"
                >
                  <div 
                    onClick={() => {
                      onClose();
                      onSelectProduct(item);
                    }}
                    className="w-20 h-24 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10 cursor-pointer"
                  >
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => {
                            onClose();
                            onSelectProduct(item);
                          }}
                          className="font-serif-luxury font-bold text-sm text-white line-clamp-1 cursor-pointer hover:text-[#ffaa6b]"
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(item)}
                          className="text-white/40 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#ffaa6b] font-medium block mt-0.5">
                        {item.woodType} • {item.dimensions.split('(')[0]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="font-bold text-white text-sm">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => {
                          onAddToCart(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#d9661c] hover:bg-[#eb7323] text-white text-xs font-bold flex items-center gap-1 shadow"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-6 bg-[#230f06] border-t border-white/10">
              <button
                onClick={() => {
                  wishlistItems.forEach(item => onAddToCart(item));
                  onClose();
                }}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#ffaa6b]" />
                <span>Add All ({wishlistItems.length}) to Cart</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
