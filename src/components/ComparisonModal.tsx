import React from 'react';
import { Product } from '../types';
import { X, Scale, ShoppingBag, Trash2, Check, Star } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  compareProducts: Product[];
  onRemoveFromCompare: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onClearAll: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  compareProducts,
  onRemoveFromCompare,
  onAddToCart,
  onSelectProduct,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#1c0d06] border border-[#ff8d3f]/30 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#251208]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#ffaa6b]" />
            <h3 className="font-serif-luxury font-bold text-lg text-white">
              Compare Specifications ({compareProducts.length}/4)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {compareProducts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-[#fedbc4]/70 hover:text-white underline underline-offset-4"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6">
          {compareProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#d9661c] mb-4">
                <Scale className="w-8 h-8" />
              </div>
              <h4 className="font-serif-luxury font-bold text-lg text-white">No Models Selected for Comparison</h4>
              <p className="text-xs text-[#fedbc4]/70 mt-1 max-w-xs mx-auto">
                Click the balance scale icon on product cards to compare specifications, timber moisture, and pricing side-by-side.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/15">
                    <th className="p-3 text-xs font-bold uppercase text-[#ffaa6b] w-44">Feature</th>
                    {compareProducts.map((p) => (
                      <th key={p.id} className="p-3 text-center min-w-[180px]">
                        <div className="relative group flex flex-col items-center">
                          <button
                            onClick={() => onRemoveFromCompare(p)}
                            className="absolute -top-1 -right-1 p-1 rounded-full bg-black/60 hover:bg-red-500/80 text-white"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <div 
                            onClick={() => {
                              onClose();
                              onSelectProduct(p);
                            }}
                            className="w-24 h-28 rounded-xl overflow-hidden bg-black/40 border border-white/15 cursor-pointer"
                          >
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <span 
                            onClick={() => {
                              onClose();
                              onSelectProduct(p);
                            }}
                            className="text-xs font-bold text-white mt-2 line-clamp-1 cursor-pointer hover:text-[#ffaa6b]"
                          >
                            {p.name}
                          </span>
                          <span className="text-sm font-bold font-serif-luxury text-[#ffaa6b] mt-0.5">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-xs text-[#fedbc4]/80">
                  <tr>
                    <td className="p-3 font-semibold text-white">Primary Wood</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center font-bold text-[#ffaa6b]">{p.woodType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Category</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center">{p.categoryName}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Standard Dimensions</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center">{p.dimensions}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Seasoning Grade</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center">{p.seasoningGrade}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Customer Rating</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 font-bold text-white">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {p.rating} ({p.reviewsCount})
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Warranty</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center text-emerald-400 font-medium">{p.warranty}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Available Finishes</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center text-[11px]">{p.finishes.join(', ')}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Action</td>
                    {compareProducts.map(p => (
                      <td key={p.id} className="p-3 text-center">
                        <button
                          onClick={() => {
                            onAddToCart(p);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#d9661c] hover:bg-[#eb7323] text-white text-xs font-bold inline-flex items-center gap-1 shadow"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
