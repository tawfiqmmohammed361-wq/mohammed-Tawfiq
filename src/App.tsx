import React, { useState, useEffect } from 'react';
import { Product, CartItem, Order, QuoteRequest, ProductCategory, CustomDesignConfig, BusinessSettings } from './types';
import { PRODUCTS } from './data/products';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCategories } from './components/ProductCategories';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CustomDesignStudio } from './components/CustomDesignStudio';
import { ShowroomSection } from './components/ShowroomSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { CustomerReviews } from './components/CustomerReviews';
import { PeopleSection } from './components/PeopleSection';
import { WorkshopProcessSection } from './components/WorkshopProcessSection';
import { QuoteModal } from './components/QuoteModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ComparisonModal } from './components/ComparisonModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AccountModal } from './components/AccountModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SearchModal } from './components/SearchModal';
import { FAQModal } from './components/FAQModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { CheckCircle2, Heart, Scale, ShoppingBag, Sparkles, Shield, Lock } from 'lucide-react';

export default function App() {
  // --- Live Data from Backend API ---
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  // --- Cart, Wishlist, and Comparison State ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('woodcraft_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('woodcraft_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [compareList, setCompareList] = useState<Product[]>([]);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('woodcraft_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    const saved = localStorage.getItem('woodcraft_quotes');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Modal Visibility States ---
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState<{ itemType?: string; wood?: string; size?: string }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // --- Filtering & UI States ---
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [toastMessage, setToastMessage] = useState<{ text: string; icon?: 'cart' | 'heart' | 'compare' | 'check' } | null>(null);

  // Initial Load from API
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [fetchedProducts, fetchedSettings] = await Promise.all([
        api.getProducts().catch(() => PRODUCTS),
        api.getSettings().catch(() => null),
      ]);

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProductsList(fetchedProducts);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (err) {
      console.warn('Backend API connection note:', err);
    }
  };

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('woodcraft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('woodcraft_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('woodcraft_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('woodcraft_quotes', JSON.stringify(quotes));
  }, [quotes]);

  // Toast Helper
  const showToast = (text: string, icon: 'cart' | 'heart' | 'compare' | 'check' = 'check') => {
    setToastMessage({ text, icon });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- Cart Operations ---
  const handleAddToCart = (
    product: Product,
    options?: { wood?: string; finish?: string; size?: string; price?: number; customDetails?: any; qty?: number; customEngravingText?: string }
  ) => {
    const selectedWood = options?.wood || product.woodType;
    const selectedFinish = options?.finish || product.finishes[0];
    const selectedSize = options?.size || product.dimensions;
    const unitPrice = options?.price || product.price;
    const addQuantity = options?.qty || 1;
    const engraving = options?.customEngravingText || options?.customDetails?.customEngravingText;

    const cartItemId = `${product.id}-${selectedWood}-${selectedFinish}-${selectedSize}${engraving ? `-${engraving}` : ''}`.replace(/\s+/g, '-');

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + addQuantity } : item
        );
      }
      const newItem: CartItem = {
        id: cartItemId,
        productId: product.id,
        name: product.name,
        image: product.images[0],
        selectedWood,
        selectedSize,
        selectedFinish,
        unitPrice,
        quantity: addQuantity,
        customEngravingText: engraving,
        isCustom: !!options?.customDetails || !!engraving,
        customConfig: options?.customDetails,
      };
      return [...prev, newItem];
    });

    showToast(`Added "${product.name}" (${addQuantity}x) to cart`, 'cart');
  };

  const handleBuyNow = (
    product: Product,
    wood: string,
    size: string,
    finish: string,
    glass?: string,
    hardware?: string,
    qty?: number,
    customDims?: any
  ) => {
    handleAddToCart(product, {
      wood,
      size,
      finish,
      price: product.price,
      qty: qty || 1,
      customDetails: customDims,
      customEngravingText: customDims?.customEngravingText,
    });
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleAddCustomConfigToCart = (config: CustomDesignConfig, price: number) => {
    const cartItemId = `custom-${config.productType.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const newItem: CartItem = {
      id: cartItemId,
      productId: 'custom-config',
      name: `Bespoke Custom ${config.productType} (${config.designStyle})`,
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
      selectedWood: config.woodType,
      selectedSize: `${config.widthFeet}.${config.widthInches} ft × ${config.heightFeet}.${config.heightInches} ft (${config.thicknessMm}mm)`,
      selectedFinish: config.finish,
      unitPrice: price,
      quantity: 1,
      isCustom: true,
      customConfig: config,
    };

    setCart((prev) => [...prev, newItem]);
    setIsCartOpen(true);
    showToast(`Custom architectural ${config.productType} added to cart!`, 'cart');
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Wishlist Operations ---
  const handleToggleWishlist = (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed from saved collection`, 'heart');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to Wishlist`, 'heart');
    }
  };

  const isWishlisted = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  // --- Comparison Operations ---
  const handleToggleCompare = (product: Product) => {
    const exists = compareList.some((item) => item.id === product.id);
    if (exists) {
      setCompareList((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed from comparison`, 'compare');
    } else {
      if (compareList.length >= 4) {
        alert('You can compare a maximum of 4 products side-by-side.');
        return;
      }
      setCompareList((prev) => [...prev, product]);
      showToast(`Added to comparison list (${compareList.length + 1}/4)`, 'compare');
    }
  };

  const isCompared = (productId: string) => {
    return compareList.some((item) => item.id === productId);
  };

  // --- Quotation Operations ---
  const handleOpenQuoteModal = (prefill?: { itemType?: string; wood?: string; size?: string }) => {
    if (prefill) {
      setQuotePrefill(prefill);
    } else {
      setQuotePrefill({ itemType: 'Main Entrance Door', wood: 'Burma Teak', size: '4.0 ft x 7.5 ft' });
    }
    setIsQuoteOpen(true);
  };

  const handleSubmitQuote = (newQuote: QuoteRequest) => {
    setQuotes((prev) => [newQuote, ...prev]);
  };

  // --- Order Operations ---
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
  };

  const handleCategorySelect = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCustomDesign = () => {
    const customEl = document.getElementById('custom-design');
    if (customEl) {
      customEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#140803] text-white selection:bg-[#d9661c] selection:text-white relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-[#230f06]/95 border border-[#ff8d3f]/40 shadow-2xl backdrop-blur-md flex items-center gap-3 text-xs font-semibold text-white">
            {toastMessage.icon === 'cart' && <ShoppingBag className="w-4 h-4 text-[#ffaa6b]" />}
            {toastMessage.icon === 'heart' && <Heart className="w-4 h-4 text-red-400 fill-red-400" />}
            {toastMessage.icon === 'compare' && <Scale className="w-4 h-4 text-amber-400" />}
            {toastMessage.icon === 'check' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Floating Glassmorphism Navbar */}
      <Navbar
        settings={settings}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenQuote={() => handleOpenQuoteModal()}
        onOpenCustomDesign={scrollToCustomDesign}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="space-y-12 sm:space-y-20">
        
        {/* 1. Large Rounded Hero Section */}
        <HeroSection
          onExploreCatalog={() => {
            const catalogEl = document.getElementById('catalog');
            catalogEl?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCustomDesign={scrollToCustomDesign}
          onOpenQuote={() => handleOpenQuoteModal()}
          onSelectProduct={(p) => setSelectedProduct(p)}
          settings={settings}
        />

        {/* 2. Product Categories Grid */}
        <ProductCategories
          onSelectCategory={handleCategorySelect}
        />

        {/* 3. Product Catalog with Live Filters, Sort & WhatsApp Integration */}
        <ProductCatalog
          products={productsList}
          activeCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
          onToggleWishlist={(p) => handleToggleWishlist(p)}
          onToggleCompare={(p) => handleToggleCompare(p)}
          isWishlisted={isWishlisted}
          isCompared={isCompared}
          onOpenCustomStudio={scrollToCustomDesign}
          onOpenQuoteModal={handleOpenQuoteModal}
          whatsappNumber={settings?.whatsappNumber || settings?.whatsapp}
        />

        {/* 4. See How Your Door Is Made (8-Stage Transparent Process) */}
        <WorkshopProcessSection
          onRequestVisit={() => handleOpenQuoteModal({ itemType: 'Showroom & Workshop Visit' })}
          whatsappNumber={settings?.whatsappNumber || settings?.whatsapp}
        />

        {/* 5. Meet the People Behind WOODCRAFT */}
        <PeopleSection
          onTalkToUs={() => handleOpenQuoteModal({ itemType: 'Custom Timber Consultation' })}
          whatsappNumber={settings?.whatsappNumber || settings?.whatsapp}
          phoneNumber={settings?.phone}
        />

        {/* 6. Interactive 3D Custom Design Studio & Timber Estimator */}
        <CustomDesignStudio
          onAddCustomToCart={handleAddCustomConfigToCart}
          onRequestQuoteWithConfig={(config, price) => {
            handleOpenQuoteModal({
              itemType: `Custom ${config.productType} (${config.designStyle})`,
              wood: config.woodType,
              size: `${config.widthFeet}.${config.widthInches} ft x ${config.heightFeet}.${config.heightInches} ft (${config.thicknessMm}mm)`,
            });
          }}
        />

        {/* 7. Showroom & Physical Shop Experience (with real address and contact) */}
        <ShowroomSection
          onRequestVisit={() => handleOpenQuoteModal({ itemType: 'Showroom Visit & Factory Tour' })}
          settings={settings || undefined}
        />

        {/* 8. Why Choose Us (Craftsmanship, Timber Seasoning, 15-Yr Guarantee) */}
        <WhyChooseUs />

        {/* 9. Genuine Customer Reviews & Homeowner Stories */}
        <CustomerReviews />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onSelectCategory={handleCategorySelect}
        onOpenCustomDesign={scrollToCustomDesign}
        onOpenQuote={() => handleOpenQuoteModal()}
        onOpenFAQ={() => setIsFAQOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* --- MODALS & DRAWERS --- */}

      {/* 1. Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(prod, wood, size, finish, glass, hardware, qty, customDims) => {
            handleAddToCart(prod, {
              wood,
              size,
              finish,
              price: prod.price,
              qty,
              customDetails: customDims,
            });
          }}
          onBuyNow={handleBuyNow}
          onRequestQuote={(prodName, wood, size) => {
            setSelectedProduct(null);
            handleOpenQuoteModal({ itemType: prodName, wood, size });
          }}
          onToggleWishlist={handleToggleWishlist}
          onToggleCompare={handleToggleCompare}
          isWishlisted={isWishlisted(selectedProduct.id)}
          isCompared={isCompared(selectedProduct.id)}
          whatsappNumber={settings?.whatsappNumber || settings?.whatsapp}
        />
      )}

      {/* 2. Quote / Free Site Measurement Modal */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        onSubmitQuote={handleSubmitQuote}
        prefillItemType={quotePrefill.itemType}
        prefillWood={quotePrefill.wood}
        prefillSize={quotePrefill.size}
        settings={settings}
      />

      {/* 3. Shopping Cart Slide-out Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onExploreProducts={() => {
          const cat = document.getElementById('catalog');
          cat?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 4. Wishlist Slide-out Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 5. Product Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        compareProducts={compareList}
        onRemoveFromCompare={handleToggleCompare}
        onAddToCart={(p) => handleAddToCart(p)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onClearAll={() => setCompareList([])}
      />

      {/* 6. Multi-step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={handleOrderSuccess}
        onTrackOrder={handleTrackOrder}
        settings={settings}
      />

      {/* 7. Customer Account & Order History Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        quotes={quotes}
        onTrackOrder={handleTrackOrder}
        onOpenCustomStudio={scrollToCustomDesign}
      />

      {/* 8. Live Timber Production Tracking Modal */}
      {trackingOrderId && (
        <OrderTrackingModal
          isOpen={!!trackingOrderId}
          onClose={() => setTrackingOrderId(null)}
          orderId={trackingOrderId}
        />
      )}

      {/* 9. Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={productsList}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 10. Timber Knowledge Base & FAQ Modal */}
      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        onOpenQuote={() => handleOpenQuoteModal()}
        settings={settings}
      />

      {/* 11. Secure Administrative Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          loadInitialData(); // Refresh any updated products or settings
        }}
      />

    </div>
  );
}
