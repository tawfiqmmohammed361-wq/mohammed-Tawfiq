import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, WoodType, WoodFinish } from '../types';
import { PRODUCTS, CATEGORIES_LIST } from '../data/products';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Scale, 
  Star, 
  Eye, 
  ShoppingBag, 
  Check, 
  RotateCcw,
  Sparkles,
  Shield,
  MessageSquare
} from 'lucide-react';

interface ProductCatalogProps {
  products?: Product[];
  selectedCategory?: ProductCategory;
  activeCategory?: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  wishlistIds?: Set<string>;
  compareIds?: Set<string>;
  isWishlisted?: (productId: string) => boolean;
  isCompared?: (productId: string) => boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onOpenCustomStudio?: () => void;
  onOpenQuoteModal?: (prefill?: { itemType?: string; wood?: string; size?: string }) => void;
  whatsappNumber?: string;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products = PRODUCTS,
  selectedCategory: propSelectedCategory,
  activeCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  onToggleCompare,
  wishlistIds,
  compareIds,
  isWishlisted: propIsWishlisted,
  isCompared: propIsCompared,
  searchQuery: propSearchQuery,
  onSearchChange,
  onOpenCustomStudio,
  onOpenQuoteModal,
  whatsappNumber = '9842404467',
}) => {
  const currentCategory = activeCategory || propSelectedCategory || 'all';
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const activeSearchQuery = propSearchQuery !== undefined ? propSearchQuery : internalSearchQuery;

  const handleSearchChange = (query: string) => {
    if (onSearchChange) {
      onSearchChange(query);
    } else {
      setInternalSearchQuery(query);
    }
  };

  const [selectedWood, setSelectedWood] = useState<string>('all');
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(65000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [showFilters, setShowFilters] = useState(false);

  // Available wood types
  const woodTypes: WoodType[] = [
    'Burma Teak',
    'African Teak (CP)',
    'Indian Rosewood (Sheesham)',
    'American White Oak',
    'Honshu Pine',
    'Mahogany',
  ];

  // Available finishes
  const finishes: WoodFinish[] = [
    'Natural Matte',
    'Honey Oak Polish',
    'Deep Walnut Gloss',
    'Espresso Dark',
    'Rustic Weathered',
  ];

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    const list = products && products.length > 0 ? products : PRODUCTS;
    return list.filter((product) => {
      // Category filter
      if (currentCategory !== 'all' && product.category !== currentCategory) {
        return false;
      }

      // Search query filter
      if (activeSearchQuery.trim() !== '') {
        const query = activeSearchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesSubtitle = product.subtitle.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        const matchesWood = product.woodType.toLowerCase().includes(query);
        if (!matchesName && !matchesSubtitle && !matchesCategory && !matchesWood) {
          return false;
        }
      }

      // Wood filter
      if (selectedWood !== 'all' && product.woodType !== selectedWood && !product.availableWoods.includes(selectedWood as WoodType)) {
        return false;
      }

      // Finish filter
      if (selectedFinish !== 'all' && !product.finishes.includes(selectedFinish as WoodFinish)) {
        return false;
      }

      // Price filter
      if (product.price > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default order
    });
  }, [products, currentCategory, activeSearchQuery, selectedWood, selectedFinish, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedWood('all');
    setSelectedFinish('all');
    setMaxPrice(65000);
    setSortBy('featured');
    handleSearchChange('');
    onSelectCategory('all');
  };

  return (
    <section id="collections" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header & Section Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d47a24] font-bold">
            The Master Woodcraft Collection
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold italic text-[#fdfcf0] mt-1.5">
            Doors, Windows, Cots & Beds
          </h2>
          <p className="text-xs sm:text-sm text-[#fdfcf0]/70 mt-1">
            Showing <strong className="text-white">{filteredProducts.length}</strong> handcrafted items ready for direct order, personalized engraving & delivery
          </p>
        </div>

        {/* Search & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#fdfcf0]/50" />
            <input
              type="text"
              value={activeSearchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search teak, cot, headboard, carved..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24] focus:ring-1 focus:ring-[#d47a24]"
            />
            {activeSearchQuery && (
              <button 
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              showFilters
                ? 'bg-[#d47a24] text-white border-[#d47a24]'
                : 'bg-white/5 text-[#fdfcf0] border-white/15 hover:bg-white/10'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {CATEGORIES_LIST.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`filter-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as ProductCategory)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/30 font-bold scale-105'
                  : 'bg-white/5 text-[#fdfcf0]/80 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Filter Panel */}
      {showFilters && (
        <div className="p-5 sm:p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Wood Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] block mb-2">
              Hardwood Species
            </label>
            <select
              value={selectedWood}
              onChange={(e) => setSelectedWood(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d47a24]"
            >
              <option value="all">All Hardwoods</option>
              {woodTypes.map((wood) => (
                <option key={wood} value={wood}>{wood}</option>
              ))}
            </select>
          </div>

          {/* Finish Filter */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] block mb-2">
              Finish / Polish
            </label>
            <select
              value={selectedFinish}
              onChange={(e) => setSelectedFinish(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d47a24]"
            >
              <option value="all">All Finishes</option>
              {finishes.map((fin) => (
                <option key={fin} value={fin}>{fin}</option>
              ))}
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24]">
                Max Price
              </label>
              <span className="text-xs font-bold text-white">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="14000"
              max="65000"
              step="2000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#d47a24] bg-white/10 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#fdfcf0]/50 mt-1">
              <span>₹14k</span>
              <span>₹65k+</span>
            </div>
          </div>

          {/* Sort & Reset */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#d47a24] block mb-2">
              Sort Order
            </label>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/20 text-xs text-white focus:outline-none focus:border-[#d47a24]"
              >
                <option value="featured">Featured Artisanal</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white/5 border border-white/10">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[#d47a24] mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#fdfcf0]">No Matching Doors or Windows Found</h3>
          <p className="text-sm text-[#fdfcf0]/70 mt-1 max-w-md mx-auto">
            Try adjusting your search keywords, increasing price limits, or clearing wood species filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-6 px-6 py-2.5 rounded-full bg-[#d47a24] text-white font-bold text-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isWishlisted = propIsWishlisted
              ? propIsWishlisted(product.id)
              : wishlistIds
              ? wishlistIds.has(product.id)
              : false;
            const isCompared = propIsCompared
              ? propIsCompared(product.id)
              : compareIds
              ? compareIds.has(product.id)
              : false;
            const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className="group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#d47a24] transition-all duration-500 hover:shadow-2xl hover:shadow-black/70 flex flex-col justify-between"
              >
                {/* Product Image Area */}
                <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient Shading */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a110a]/90 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white uppercase tracking-wider">
                      {product.woodType}
                    </span>
                    {discountPercent > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d47a24] text-[10px] font-extrabold text-white shadow-md w-fit">
                        {discountPercent}% OFF
                      </span>
                    )}
                    {product.supportsEngraving && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-600/90 text-[9px] font-bold text-white shadow-md w-fit flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Name Engraving
                      </span>
                    )}
                  </div>

                  {/* Top Right Action Icons */}
                  <div className="absolute top-3.5 right-3.5 flex flex-col gap-2 z-10">
                    
                    {/* Wishlist Button */}
                    <button
                      id={`wishlist-toggle-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(product);
                      }}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-[#d47a24] text-white shadow-md'
                          : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70 border border-white/20'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    {/* Compare Button */}
                    <button
                      id={`compare-toggle-${product.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCompare(product);
                      }}
                      title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
                      className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all cursor-pointer ${
                        isCompared
                          ? 'bg-[#d47a24] text-white shadow-md font-bold'
                          : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70 border border-white/20'
                      }`}
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rating Badge on bottom of image */}
                  <div className="absolute bottom-3 left-3.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs text-white">
                    <Star className="w-3.5 h-3.5 text-[#d47a24] fill-[#d47a24]" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-[10px] text-[#fdfcf0]/70">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-gradient-to-b from-[#24140a]/60 to-[#180e06]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d47a24] font-bold">
                      {product.categoryName}
                    </span>
                    
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="font-serif font-bold text-base text-[#fdfcf0] mt-1 leading-snug line-clamp-1 cursor-pointer hover:text-[#d47a24] transition-colors"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-[#fdfcf0]/70 mt-1 line-clamp-2 leading-relaxed">
                      {product.subtitle}
                    </p>

                    {/* Dimensions & Seasoning */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#fdfcf0]/70 pt-2 border-t border-white/10">
                      <span>{product.dimensions.split('(')[0]}</span>
                      <span className="text-[#d47a24] font-medium">100% Solid Wood</span>
                    </div>
                  </div>

                  {/* Pricing & Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold font-serif text-[#fdfcf0]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#fdfcf0]/50 line-through ml-2">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> In Stock
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        id={`view-product-btn-${product.id}`}
                        onClick={() => onSelectProduct(product)}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#fdfcf0] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Product</span>
                      </button>

                      <button
                        id={`add-to-cart-btn-${product.id}`}
                        onClick={() => onAddToCart(product)}
                        className="w-full py-2.5 rounded-xl bg-[#d47a24] hover:bg-[#be6a1c] text-white text-xs font-bold transition-all shadow-md shadow-[#d47a24]/25 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>

                    {/* WhatsApp Quick Enquiry Button */}
                    {(() => {
                      const cleanPhone = (whatsappNumber || '+919845012345').replace(/[^0-9]/g, '');
                      const waMessage = `Hello WOODCRAFT,\nI am interested in:\nProduct: ${product.name}\nProduct ID: ${product.id}\nPrice: ₹${product.price.toLocaleString('en-IN')}\nQuantity: 1`;
                      return (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-white text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400 group-hover:text-white" />
                          <span>Enquire on WhatsApp</span>
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Special Custom Photo Order / Bespoke Carpentry Card */}
          <div className="rounded-3xl overflow-hidden bg-gradient-to-b from-[#2a170b] via-[#1a0e06] to-[#0f0803] border-2 border-dashed border-[#d47a24]/50 p-6 flex flex-col justify-between shadow-xl relative group hover:border-[#d47a24] transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#d47a24]/20 border border-[#d47a24]/40 flex items-center justify-center text-[#d47a24]">
                <Sparkles className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#d47a24] font-bold">
                  Bespoke Woodworking
                </span>
                <h3 className="font-serif font-bold text-xl text-white mt-1 leading-snug">
                  Have Your Own Photo or Custom Design?
                </h3>
                <p className="text-xs text-[#fdfcf0]/70 mt-2 leading-relaxed">
                  Upload any photo of a cot bed, headboard, main door, or window from WhatsApp, Pinterest, or your architect. We'll hand-carve it in 100% solid timber.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-[#ffaa6b]">
                <span className="bg-black/40 px-2 py-0.5 rounded-full border border-white/10">✓ Any Wood Species</span>
                <span className="bg-black/40 px-2 py-0.5 rounded-full border border-white/10">✓ Custom Engravings</span>
                <span className="bg-black/40 px-2 py-0.5 rounded-full border border-white/10">✓ Exact Site Dimensions</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <a
                href={`https://wa.me/${(whatsappNumber || '9842404467').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello WOODCRAFT,\n\nI have a photo/sketch of a wooden design (door/bed/headboard/window) that I would like made in solid wood.\n\nPlease let me know where I can send the photo for an estimate.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-[#d47a24] hover:bg-[#bd691b] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Upload Photo on WhatsApp</span>
              </a>
              <span className="text-[10px] text-center block text-[#fdfcf0]/60">
                Direct reply from Master Carpenter within 15 minutes
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
