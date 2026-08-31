import React from 'react';
import { ProductCategory } from '../types';
import { CATEGORIES_LIST } from '../data/products';
import { ArrowUpRight } from 'lucide-react';

interface ProductCategoriesProps {
  selectedCategory?: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
}

export const ProductCategories: React.FC<ProductCategoriesProps> = ({
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  // Exclude 'all' from the grid cards (since it's a filter tab)
  const displayCategories = CATEGORIES_LIST.filter(cat => cat.id !== 'all');

  return (
    <section id="doors" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d47a24] font-bold">
            Curated Timber Categories
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold italic text-[#fdfcf0] mt-1.5">
            Explore Doors & Windows
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#fdfcf0]/70 max-w-md leading-relaxed">
          Discover hand-crafted solid timber main doors, acoustic bedroom doors, sacred mandir designs, and French casement windows.
        </p>
      </div>

      {/* 8 Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {displayCategories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              id={`cat-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`group relative aspect-[3/4] sm:aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500 flex flex-col justify-end p-4 sm:p-6 ${
                isSelected
                  ? 'border-[#d47a24] ring-2 ring-[#d47a24] shadow-2xl shadow-[#d47a24]/25 scale-[1.02]'
                  : 'border-white/10 hover:border-[#d47a24] hover:shadow-2xl hover:shadow-black/70 hover:scale-[1.02]'
              }`}
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a110a] via-[#1a110a]/50 to-transparent group-hover:from-[#1a110a]/95 transition-all"></div>

              {/* Category Number Tag */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 group-hover:bg-[#d47a24] group-hover:text-white transition-all">
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#d47a24]">
                  0{idx + 1} / Handcrafted
                </span>
                <h3 className="font-serif font-bold text-base sm:text-xl text-[#fdfcf0] mt-1 leading-snug group-hover:text-[#d47a24] transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#fdfcf0]/60 mt-1 block">
                  {cat.count}+ Master Designs
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
