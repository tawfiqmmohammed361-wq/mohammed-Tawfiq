import React, { useState } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';
import { Search, X, Star, ArrowRight, Eye } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products?: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products = PRODUCTS,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');

  const productList = products || PRODUCTS || [];
  const searchResults = query.trim() === '' ? [] : productList.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.woodType.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      (p.features && p.features.some(f => f.toLowerCase().includes(q)))
    );
  });

  const popularSearches = [
    'Burma Teak',
    'Main Entrance Door',
    'Mandir Pooja Door',
    'French Window',
    'Acoustic Bedroom Door',
    'Pivot Door',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-16 sm:pt-24 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1a110a] border border-white/15 shadow-2xl shadow-black overflow-hidden flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center gap-3 bg-[#24140a]">
          <Search className="w-5 h-5 text-[#d47a24] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teak doors, sliding windows, CNC mandir..."
            className="w-full bg-transparent text-white placeholder-[#fdfcf0]/40 text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#fdfcf0]/60 hover:text-white cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {query.trim() === '' ? (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#d47a24] block mb-3">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs text-[#fdfcf0] hover:bg-[#d47a24] hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-[#fdfcf0]/70 text-xs">
              No architectural doors or windows match "{query}". Try keywords like "Teak", "French", or "Pooja".
            </div>
          ) : (
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#d47a24] uppercase tracking-wider block">
                Found {searchResults.length} Match(es)
              </span>
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d47a24]/60 flex items-center justify-between gap-4 cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#d47a24] transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[11px] text-[#fdfcf0]/70 mt-0.5">
                        {product.woodType} • {product.categoryName}
                      </p>
                      <span className="text-xs font-serif font-bold text-white mt-1 block">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-[#d47a24] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
