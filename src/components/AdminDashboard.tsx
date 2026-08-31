import React, { useState, useEffect } from 'react';
import {
  Shield, LayoutDashboard, Package, ShoppingCart, Users, FileText,
  Star, Mail, Settings, Plus, Edit2, Trash2, CheckCircle2,
  XCircle, Clock, ExternalLink, RefreshCw, AlertTriangle, Image as ImageIcon,
  DollarSign, ArrowUpRight, Search, Check, Eye, X, Upload, Database
} from 'lucide-react';
import { Product, ProductCategory, WoodType, WoodFinish } from '../types';
import { api, DashboardStats, BusinessSettings } from '../services/api';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshProducts?: () => void;
}

type TabType = 'dashboard' | 'products' | 'orders' | 'quotes' | 'customers' | 'reviews' | 'messages' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onRefreshProducts,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('wc_admin_token'));
  });
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Dashboard Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [sheetsStatus, setSheetsStatus] = useState<{ configured: boolean; sheetId: string | null }>({ configured: false, sheetId: null });

  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Product Add / Edit Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [imageInputs, setImageInputs] = useState<string[]>(['']);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Partial<BusinessSettings>>({});

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadAllData();
    }
  }, [isOpen, isAuthenticated]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [
        statsData,
        productsData,
        ordersData,
        quotesData,
        customersData,
        reviewsData,
        messagesData,
        settingsData,
        sheetsData,
      ] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getQuotes(),
        api.getCustomers(),
        api.getAllReviews(),
        api.getContacts(),
        api.getSettings(),
        api.getSheetsStatus(),
      ]);

      setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setQuotes(quotesData);
      setCustomers(customersData);
      setReviews(reviewsData);
      setMessages(messagesData);
      setSettings(settingsData);
      setSettingsForm(settingsData);
      setSheetsStatus(sheetsData);
    } catch (err: any) {
      console.error('[Admin] Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin({ username, password });
      localStorage.setItem('wc_admin_token', res.token);
      setIsAuthenticated(true);
      setPassword('');
      loadAllData();
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wc_admin_token');
    setIsAuthenticated(false);
  };

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Product actions
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: `wc-prod-${Date.now().toString(36)}`,
      name: '',
      subtitle: '',
      category: 'main-doors',
      categoryName: 'Main Doors',
      price: 24999,
      originalPrice: 29999,
      inStock: true,
      woodType: 'Burma Teak',
      availableWoods: ['Burma Teak', 'African Teak (CP)', 'American White Oak'],
      dimensions: '3.5 ft x 7.0 ft x 38mm',
      availableSizes: ['3.5 ft x 7.0 ft', '4.0 ft x 7.5 ft'],
      finishes: ['Natural Matte', 'Honey Oak Polish', 'Deep Walnut Gloss'],
      glassOption: ['None (Solid Wood)'],
      hardware: ['None (Frame & Shutter)'],
      features: ['100% Seasoned Kiln-Dried Hardwood', '10 Years Structural Warranty'],
      warranty: '10 Years Warranty',
      seasoningGrade: 'Grade A+ Kiln-Dried',
      images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
      description: '',
    });
    setImageInputs(['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80']);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setImageInputs(prod.images && prod.images.length > 0 ? [...prod.images] : ['']);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    try {
      const cleanImages = imageInputs.filter((url) => url.trim() !== '');
      const payload: Partial<Product> = {
        ...editingProduct,
        images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'],
        price: Number(editingProduct.price),
        originalPrice: Number(editingProduct.originalPrice),
      };

      const isExisting = products.some((p) => p.id === editingProduct.id);
      if (isExisting) {
        await api.updateProduct(editingProduct.id!, payload);
        showNotification('Product updated and synced to Google Sheets!');
      } else {
        await api.addProduct(payload);
        showNotification('Product created successfully and logged to Google Sheets!');
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadAllData();
      if (onRefreshProducts) onRefreshProducts();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      showNotification('Product removed');
      loadAllData();
      if (onRefreshProducts) onRefreshProducts();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      showNotification(`Order status updated to "${status}"`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Quote status update
  const handleUpdateQuoteStatus = async (quoteId: string, status: string) => {
    try {
      await api.updateQuoteStatus(quoteId, status);
      showNotification(`Quote status updated to "${status}"`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Review status update
  const handleUpdateReviewStatus = async (reviewId: string, status: 'Approved' | 'Rejected' | 'Pending') => {
    try {
      await api.updateReviewStatus(reviewId, status);
      showNotification(`Review marked as ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Contact status update
  const handleUpdateContactStatus = async (id: string, status: string) => {
    try {
      await api.updateContactStatus(id, status);
      showNotification(`Message marked as ${status}`);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateSettings(settingsForm);
      setSettings(updated);
      showNotification('Showroom settings updated successfully!');
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  // Google Sheets Sync
  const handleSyncSheets = async () => {
    try {
      showNotification('Syncing all products, orders, and quotes to Google Sheets...');
      const res = await api.syncGoogleSheets();
      showNotification(res.message);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Sheets sync failed. Check configuration.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-7xl h-[92vh] rounded-3xl bg-[#180e08] border border-white/15 shadow-2xl shadow-black overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#22130b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d47a24] flex items-center justify-center text-white shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-serif font-bold text-white tracking-wide">
                  WOODCRAFT
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#d47a24]/20 border border-[#d47a24]/40 text-[#d47a24] text-[10px] font-bold uppercase tracking-widest">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-[#fdfcf0]/60">
                Live Timber Joinery, Orders & Google Sheets Sync
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                <button
                  onClick={loadAllData}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-xs text-white/80 transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 shrink-0 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-600/90 text-white'
                : 'bg-red-600/90 text-white'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Authentication View */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#140b06]">
            <div className="w-full max-w-md bg-[#22130b] border border-white/15 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#d47a24]/20 border border-[#d47a24]/40 flex items-center justify-center text-[#d47a24] mx-auto mb-4">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white">
                  Management Authentication
                </h3>
                <p className="text-xs text-[#fdfcf0]/60 mt-1">
                  Enter authorized administrator credentials to access orders, pricing, and database sheets.
                </p>
              </div>

              {loginError && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d47a24] mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-[#d47a24]"
                    placeholder="admin"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#d47a24] mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-sm text-white focus:outline-none focus:border-[#d47a24]"
                    placeholder="••••••••"
                  />
                  <p className="text-[10px] text-[#fdfcf0]/40 mt-1">
                    Default: <code className="text-[#d47a24]">woodcraft@2026</code> (Configurable via .env)
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#d47a24]/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  <span>{isLoggingIn ? 'Verifying...' : 'Access Dashboard'}</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Authenticated Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-[#1c0f08] border-r border-white/10 p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
              
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Products</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                  {products.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Orders</span>
                </div>
                {stats?.pendingOrders ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold">
                    {stats.pendingOrders}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                    {orders.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('quotes')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'quotes'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4" />
                  <span>Quote Requests</span>
                </div>
                {stats?.newQuoteRequests ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#d47a24]/40 text-white text-[10px] font-bold animate-pulse">
                    {stats.newQuoteRequests}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                    {quotes.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Customers</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
                  {customers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4" />
                  <span>Reviews</span>
                </div>
                {stats?.pendingReviews ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold">
                    {stats.pendingReviews} New
                  </span>
                ) : null}
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4" />
                  <span>Messages</span>
                </div>
                {stats?.pendingMessages ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 text-[10px] font-bold">
                    {stats.pendingMessages}
                  </span>
                ) : null}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#d47a24] text-white shadow-lg shadow-[#d47a24]/20'
                    : 'text-[#fdfcf0]/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>

              {/* Database Status Mini Card */}
              <div className="mt-auto pt-4 border-t border-white/10 hidden md:block">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-[11px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#fdfcf0]/60">Google Sheets:</span>
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        sheetsStatus.configured ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sheetsStatus.configured ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                      {sheetsStatus.configured ? 'Synced' : 'Local Fallback'}
                    </span>
                  </div>
                  <button
                    onClick={handleSyncSheets}
                    className="w-full py-1.5 px-2 bg-white/5 hover:bg-[#d47a24] text-white rounded-lg text-[10px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Database className="w-3 h-3" />
                    <span>Sync to Sheets</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#140b06] space-y-6">
              
              {/* TAB 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-3xl bg-[#22130b] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between text-[#d47a24] mb-2">
                        <Package className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#fdfcf0]/60">Total</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                        {stats?.totalProducts || products.length}
                      </h4>
                      <p className="text-xs text-[#fdfcf0]/60 mt-1">Active Catalog Products</p>
                    </div>

                    <div className="p-5 rounded-3xl bg-[#22130b] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between text-emerald-400 mb-2">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/80">Active</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                        {orders.length}
                      </h4>
                      <p className="text-xs text-[#fdfcf0]/60 mt-1">
                        {stats?.pendingOrders || 0} Pending Joinery
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-[#22130b] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between text-amber-400 mb-2">
                        <FileText className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/80">Leads</span>
                      </div>
                      <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                        {quotes.length}
                      </h4>
                      <p className="text-xs text-[#fdfcf0]/60 mt-1">
                        {stats?.newQuoteRequests || 0} New Quote Requests
                      </p>
                    </div>

                    <div className="p-5 rounded-3xl bg-[#22130b] border border-white/10 shadow-lg">
                      <div className="flex items-center justify-between text-[#d47a24] mb-2">
                        <DollarSign className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#fdfcf0]/60">Revenue</span>
                      </div>
                      <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                        ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                      </h4>
                      <p className="text-xs text-[#fdfcf0]/60 mt-1">Confirmed Orders Value</p>
                    </div>
                  </div>

                  {/* Quick Recent Orders & Leads Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Recent Orders */}
                    <div className="bg-[#22130b] border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base font-serif font-bold text-white">
                            Recent Joinery Orders
                          </h4>
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-xs text-[#d47a24] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>View All</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {orders.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#fdfcf0]/50">
                            No orders placed yet. Orders made via checkout will log here and in Google Sheets automatically.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {orders.slice(0, 4).map((order) => (
                              <div
                                key={order.id}
                                className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <div className="font-bold text-white">{order.customerName}</div>
                                  <div className="text-[#fdfcf0]/60 text-[11px]">
                                    {order.id} • {order.items?.length || 1} item(s)
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-[#d47a24]">
                                    ₹{order.total?.toLocaleString('en-IN')}
                                  </div>
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white mt-0.5">
                                    {order.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Quote Inquiries */}
                    <div className="bg-[#22130b] border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-base font-serif font-bold text-white">
                            Recent Quotation Requests
                          </h4>
                          <button
                            onClick={() => setActiveTab('quotes')}
                            className="text-xs text-[#d47a24] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>View All</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {quotes.length === 0 ? (
                          <div className="py-8 text-center text-xs text-[#fdfcf0]/50">
                            No quote requests yet. "Get a Free Quote" submissions appear here.
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {quotes.slice(0, 4).map((quote) => (
                              <div
                                key={quote.id}
                                className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                              >
                                <div>
                                  <div className="font-bold text-white">{quote.customerName}</div>
                                  <div className="text-[#fdfcf0]/60 text-[11px]">
                                    {quote.itemType} • {quote.woodType} • {quote.location}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d47a24]/20 text-[#d47a24]">
                                    {quote.status}
                                  </span>
                                  <div className="text-[10px] text-[#fdfcf0]/50 mt-1">
                                    {quote.phone}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 2: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white">
                        Door & Window Catalog Management
                      </h3>
                      <p className="text-xs text-[#fdfcf0]/60">
                        Add, edit prices, update stock, and upload multi-angle photos. Synced to Google Sheets "PRODUCTS".
                      </p>
                    </div>
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-4 py-2.5 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold rounded-2xl shadow-lg shadow-[#d47a24]/30 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Products Table */}
                  <div className="bg-[#22130b] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-white/90">
                        <thead className="bg-black/40 text-[10px] font-bold uppercase tracking-wider text-[#d47a24] border-b border-white/10">
                          <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Wood & Specs</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {products.map((prod) => (
                            <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={prod.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80'}
                                    alt={prod.name}
                                    className="w-12 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-white">{prod.name}</div>
                                    <div className="text-[10px] text-[#fdfcf0]/60">{prod.id}</div>
                                    <div className="text-[10px] text-[#d47a24] mt-0.5">
                                      {prod.images?.length || 1} Photo(s)
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-[#fdfcf0]/80">
                                {prod.categoryName || prod.category}
                              </td>
                              <td className="p-4">
                                <div className="font-semibold text-white">{prod.woodType}</div>
                                <div className="text-[10px] text-[#fdfcf0]/60">{prod.dimensions}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-[#d47a24]">
                                  ₹{prod.price?.toLocaleString('en-IN')}
                                </div>
                                {prod.originalPrice > prod.price && (
                                  <div className="text-[10px] line-through text-[#fdfcf0]/40">
                                    ₹{prod.originalPrice?.toLocaleString('en-IN')}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                    prod.inStock
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                                  }`}
                                >
                                  {prod.inStock ? 'In Stock' : 'Made to Order'}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleOpenEditProduct(prod)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-[#d47a24] text-white transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(prod.id)}
                                    className="p-2 rounded-xl bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 3: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Customer Joinery Orders
                    </h3>
                    <p className="text-xs text-[#fdfcf0]/60">
                      Manage real production statuses. Updates reflect instantly on customer Order Tracking.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="p-12 text-center bg-[#22130b] border border-white/10 rounded-3xl text-xs text-[#fdfcf0]/60">
                        No customer orders placed yet. Place an order through checkout to test the workflow.
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-[#22130b] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-[#d47a24]">
                                  {order.id}
                                </span>
                                <span className="text-xs text-[#fdfcf0]/50">•</span>
                                <span className="text-xs text-white font-semibold">
                                  {order.customerName}
                                </span>
                              </div>
                              <div className="text-xs text-[#fdfcf0]/60 mt-0.5">
                                Phone: <a href={`tel:${order.phone}`} className="text-[#d47a24] hover:underline">{order.phone}</a> • Placed: {order.orderDate}
                              </div>
                            </div>

                            {/* Status Changer */}
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#fdfcf0]/70 font-semibold">Status:</span>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Ready">Ready</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </div>
                          </div>

                          {/* Ordered Items */}
                          <div className="space-y-2">
                            <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#d47a24]">
                              Items ({order.items?.length || 0})
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(order.items || []).map((item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center gap-3 text-xs"
                                >
                                  <img
                                    src={item.image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80'}
                                    alt={item.name}
                                    className="w-10 h-12 rounded-lg object-cover border border-white/10 shrink-0"
                                  />
                                  <div className="flex-1">
                                    <div className="font-bold text-white">{item.name}</div>
                                    <div className="text-[10px] text-[#fdfcf0]/60">
                                      {item.selectedWood} • {item.selectedSize} • Qty: {item.quantity}
                                    </div>
                                    <div className="text-[11px] font-semibold text-[#d47a24] mt-0.5">
                                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Address & Total */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-3 border-t border-white/5 text-xs">
                            <div className="text-[#fdfcf0]/70">
                              <span className="font-semibold text-white">Delivery: </span>
                              {order.deliveryAddress || `${order.city}, ${order.pincode}`}
                            </div>
                            <div className="text-right font-serif font-bold text-sm text-white">
                              Total: <span className="text-[#d47a24]">₹{order.total?.toLocaleString('en-IN')}</span> ({order.paymentMethod})
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* TAB 4: QUOTE REQUESTS */}
              {activeTab === 'quotes' && (
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Custom Quotation Leads
                    </h3>
                    <p className="text-xs text-[#fdfcf0]/60">
                      Customer inquiries from "Get a Free Quote" & "Design Your Door". Synced to Google Sheets "QUOTE REQUESTS".
                    </p>
                  </div>

                  <div className="space-y-4">
                    {quotes.length === 0 ? (
                      <div className="p-12 text-center bg-[#22130b] border border-white/10 rounded-3xl text-xs text-[#fdfcf0]/60">
                        No quote requests received yet.
                      </div>
                    ) : (
                      quotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="bg-[#22130b] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-white/10">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-base">
                                  {quote.customerName}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-[#d47a24]/20 text-[#d47a24] text-[10px] font-bold">
                                  {quote.itemType}
                                </span>
                              </div>
                              <div className="text-xs text-[#fdfcf0]/60 mt-0.5">
                                Phone: <a href={`tel:${quote.phone}`} className="text-[#d47a24] hover:underline font-semibold">{quote.phone}</a> • Email: {quote.email || 'N/A'} • Location: {quote.location}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-[#fdfcf0]/70 font-semibold">Status:</span>
                              <select
                                value={quote.status}
                                onChange={(e) => handleUpdateQuoteStatus(quote.id, e.target.value)}
                                className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/20 text-xs font-bold text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                              >
                                <option value="New">New</option>
                                <option value="Pending Review">Pending Review</option>
                                <option value="Estimator Assigned">Estimator Assigned</option>
                                <option value="Quote Sent">Quote Sent</option>
                                <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                                <option value="Completed">Completed</option>
                                <option value="Declined">Declined</option>
                              </select>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                              <span className="text-[10px] uppercase font-bold text-[#d47a24] block">Wood Type</span>
                              <span className="font-semibold text-white">{quote.woodType}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                              <span className="text-[10px] uppercase font-bold text-[#d47a24] block">Dimensions</span>
                              <span className="font-semibold text-white">{quote.width} x {quote.height}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                              <span className="text-[10px] uppercase font-bold text-[#d47a24] block">Finish & Glass</span>
                              <span className="font-semibold text-white">{quote.finish} • {quote.glassOption}</span>
                            </div>
                            <div className="p-3 rounded-2xl bg-black/30 border border-white/5">
                              <span className="text-[10px] uppercase font-bold text-[#d47a24] block">Quantity</span>
                              <span className="font-semibold text-white">{quote.quantity} Unit(s)</span>
                            </div>
                          </div>

                          {/* Requirements & Uploaded photo */}
                          {quote.additionalRequirements && (
                            <div className="text-xs p-3 rounded-2xl bg-black/20 border border-white/5 text-[#fdfcf0]/80">
                              <strong className="text-white font-semibold">Special Requirements: </strong>
                              {quote.additionalRequirements}
                            </div>
                          )}

                          {quote.uploadedDesign && (
                            <div className="text-xs flex items-center gap-2">
                              <span className="text-[#d47a24] font-semibold">Reference Design Uploaded:</span>
                              <span className="text-white/80">{quote.uploadedDesign}</span>
                            </div>
                          )}

                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* TAB 5: CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Customer Directory
                    </h3>
                    <p className="text-xs text-[#fdfcf0]/60">
                      Directory of clients who have placed orders or requested custom joinery. Synced to Google Sheets "CUSTOMERS".
                    </p>
                  </div>

                  <div className="bg-[#22130b] border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left text-xs text-white/90">
                      <thead className="bg-black/40 text-[10px] font-bold uppercase tracking-wider text-[#d47a24] border-b border-white/10">
                        <tr>
                          <th className="p-4">Customer ID & Name</th>
                          <th className="p-4">Phone & Email</th>
                          <th className="p-4">Address / City</th>
                          <th className="p-4">Orders</th>
                          <th className="p-4 text-right">Total Spend</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {customers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-xs text-[#fdfcf0]/50">
                              No customer records logged yet.
                            </td>
                          </tr>
                        ) : (
                          customers.map((c) => (
                            <tr key={c.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-white">{c.name}</div>
                                <div className="text-[10px] text-[#fdfcf0]/50">{c.id}</div>
                              </td>
                              <td className="p-4">
                                <div>{c.phone}</div>
                                <div className="text-[10px] text-[#fdfcf0]/60">{c.email || 'N/A'}</div>
                              </td>
                              <td className="p-4 text-[#fdfcf0]/80">
                                {c.city ? `${c.city}, ${c.pincode || ''}` : c.address || 'India'}
                              </td>
                              <td className="p-4 font-semibold text-white">
                                {c.ordersCount || 1} Order(s)
                              </td>
                              <td className="p-4 text-right font-bold text-[#d47a24]">
                                ₹{(c.totalSpend || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

              {/* TAB 6: REVIEWS MODERATION */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Customer Reviews & Moderation
                    </h3>
                    <p className="text-xs text-[#fdfcf0]/60">
                      Approve customer reviews before they appear publicly on the storefront. Synced to Google Sheets "REVIEWS".
                    </p>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-[#22130b] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-white/10">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{rev.customerName}</span>
                              <span className="text-xs text-[#fdfcf0]/50">•</span>
                              <span className="text-xs text-[#d47a24] font-semibold">{rev.product}</span>
                            </div>
                            <div className="text-[11px] text-[#fdfcf0]/60">
                              {rev.city} • Rating: {rev.rating}/5 Stars • {rev.date}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                rev.approvalStatus === 'Approved'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : rev.approvalStatus === 'Rejected'
                                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {rev.approvalStatus}
                            </span>
                            {rev.approvalStatus !== 'Approved' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(rev.id, 'Approved')}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {rev.approvalStatus !== 'Rejected' && (
                              <button
                                onClick={() => handleUpdateReviewStatus(rev.id, 'Rejected')}
                                className="px-3 py-1 bg-white/10 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#fdfcf0]/80 italic">
                          "{rev.review}"
                        </p>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 7: MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Contact Inquiries
                    </h3>
                    <p className="text-xs text-[#fdfcf0]/60">
                      Messages received through the Contact Us form. Synced to Google Sheets "CONTACT MESSAGES".
                    </p>
                  </div>

                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="p-12 text-center bg-[#22130b] border border-white/10 rounded-3xl text-xs text-[#fdfcf0]/60">
                        No contact messages received yet.
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="bg-[#22130b] border border-white/10 rounded-3xl p-5 shadow-xl space-y-3"
                        >
                          <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <div>
                              <span className="font-bold text-white text-sm">{msg.name}</span>
                              <div className="text-xs text-[#fdfcf0]/60 mt-0.5">
                                Phone: <a href={`tel:${msg.phone}`} className="text-[#d47a24]">{msg.phone}</a> • Email: {msg.email} • {msg.date}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white">
                                {msg.status}
                              </span>
                              {msg.status !== 'Replied' && (
                                <button
                                  onClick={() => handleUpdateContactStatus(msg.id, 'Replied')}
                                  className="px-2.5 py-1 bg-[#d47a24] text-white rounded-lg text-xs font-semibold cursor-pointer"
                                >
                                  Mark Replied
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-white/90 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                </div>
              )}

              {/* TAB 8: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white">
                      Showroom & Business Configuration
                    </h3>
                    <p className="text-xs text-[#fdfcf0]/60">
                      Configure your official phone numbers, WhatsApp, showroom address, business hours, and Google Sheets setup.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Business Details Form */}
                    <form onSubmit={handleSaveSettings} className="bg-[#22130b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#d47a24] mb-2">
                        Contact & Showroom Details
                      </h4>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          Primary Phone Number *
                        </label>
                        <input
                          type="text"
                          value={settingsForm.phone || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="9842404467"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          Alternate Phone Number
                        </label>
                        <input
                          type="text"
                          value={settingsForm.alternatePhone || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, alternatePhone: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="7708378003"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          WhatsApp Number (Used for product & quotation enquiries)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.whatsapp || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value, whatsappNumber: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="9842404467"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          Official Email Address
                        </label>
                        <input
                          type="email"
                          value={settingsForm.email || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="tawfiqmmohammed361@gmail.com"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          Showroom Experience Center Address
                        </label>
                        <textarea
                          rows={2}
                          value={settingsForm.address || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="Plot 42, Timber Yard Industrial Area..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          Visiting / Business Hours
                        </label>
                        <input
                          type="text"
                          value={settingsForm.businessHours || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="Mon - Sat: 9:30 AM - 8:00 PM | Sun: By Appointment"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#fdfcf0]/70 uppercase mb-1">
                          Showroom Photo URL (Or change in Showroom Section)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.showroomPhotoUrl || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, showroomPhotoUrl: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#d47a24]/30 cursor-pointer"
                      >
                        Save Showroom Settings
                      </button>
                    </form>

                    {/* Google Sheets Database Status */}
                    <div className="bg-[#22130b] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-[#d47a24] mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span>Google Sheets Integration</span>
                      </h4>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#fdfcf0]/70">Connection Status:</span>
                          <span className={`font-bold ${sheetsStatus.configured ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {sheetsStatus.configured ? 'Connected & Active' : 'Fallback Local Engine'}
                          </span>
                        </div>
                        {sheetsStatus.sheetId && (
                          <div className="text-[11px] text-[#fdfcf0]/60">
                            Sheet ID: <code className="text-[#d47a24]">{sheetsStatus.sheetId}</code>
                          </div>
                        )}
                        <p className="text-[11px] text-[#fdfcf0]/60 mt-1 leading-relaxed">
                          All orders, customers, quotes, reviews, and products automatically write to your 6 Google Sheets when configured in your project settings.
                        </p>
                      </div>

                      <button
                        onClick={handleSyncSheets}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Trigger Full 6-Sheet Sync</span>
                      </button>

                      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-[#fdfcf0]/70 space-y-1.5">
                        <span className="font-bold text-white block">Required Google Sheets:</span>
                        <ul className="list-disc list-inside space-y-1 text-[10px]">
                          <li>PRODUCTS</li>
                          <li>CUSTOMERS</li>
                          <li>ORDERS</li>
                          <li>QUOTE REQUESTS</li>
                          <li>CONTACT MESSAGES</li>
                          <li>REVIEWS</li>
                        </ul>
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#1c0f08] border border-[#d47a24]/40 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-xs space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-serif font-bold text-white">
                {products.some((p) => p.id === editingProduct.id) ? 'Edit Product' : 'Add New Door / Window'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                  placeholder="e.g. Grand Burma Teak Entrance Door"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                  Subtitle / Highlights
                </label>
                <input
                  type="text"
                  value={editingProduct.subtitle || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                  placeholder="e.g. Handcrafted with traditional mortise-and-tenon joinery"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Category *
                  </label>
                  <select
                    value={editingProduct.category || 'main-doors'}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const catNames: Record<string, string> = {
                        'main-doors': 'Main Doors',
                        'bedroom-doors': 'Bedroom Doors',
                        'pooja-doors': 'Pooja Doors',
                        'wooden-windows': 'Wooden Windows',
                        'sliding-windows': 'Sliding Windows',
                        'teak-doors': 'Teak Doors',
                        'designer-doors': 'Designer Doors',
                      };
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        categoryName: catNames[cat] || 'Doors',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="main-doors">Main Doors</option>
                    <option value="bedroom-doors">Bedroom Doors</option>
                    <option value="pooja-doors">Pooja Doors</option>
                    <option value="wooden-windows">Wooden Windows</option>
                    <option value="sliding-windows">Sliding Windows</option>
                    <option value="teak-doors">Teak Doors</option>
                    <option value="designer-doors">Designer Doors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Primary Wood Type *
                  </label>
                  <select
                    value={editingProduct.woodType || 'Burma Teak'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, woodType: e.target.value as WoodType })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="Burma Teak">Burma Teak</option>
                    <option value="African Teak (CP)">African Teak (CP)</option>
                    <option value="Indian Rosewood (Sheesham)">Indian Rosewood (Sheesham)</option>
                    <option value="American White Oak">American White Oak</option>
                    <option value="Red Meranti">Red Meranti</option>
                    <option value="Honshu Pine">Honshu Pine</option>
                    <option value="Mahogany">Mahogany</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                    placeholder="34999"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                    placeholder="42999"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Dimensions / Thickness
                  </label>
                  <input
                    type="text"
                    value={editingProduct.dimensions || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, dimensions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                    placeholder="4.0 ft x 7.5 ft x 45mm"
                  />
                </div>
              </div>

              {/* Product Images (Multiple Views: Front, Side, Close-up, Installed) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24]">
                    Product Images (Front, Side, Installed, Close-up)
                  </label>
                  <button
                    type="button"
                    onClick={() => setImageInputs([...imageInputs, ''])}
                    className="text-[10px] text-[#d47a24] hover:underline font-bold cursor-pointer"
                  >
                    + Add More Image URL
                  </button>
                </div>
                {imageInputs.map((url, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => {
                        const next = [...imageInputs];
                        next[i] = e.target.value;
                        setImageInputs(next);
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white focus:outline-none focus:border-[#d47a24]"
                      placeholder={`Image URL ${i + 1} (e.g. Front View, Close-up)`}
                    />
                    {imageInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setImageInputs(imageInputs.filter((_, idx) => idx !== i))}
                        className="px-2 text-white/50 hover:text-red-400 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                  placeholder="Detailed architectural specifications, wood properties..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="accent-[#d47a24]"
                  />
                  <span>Mark as In-Stock (Uncheck for Made-To-Order)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#d47a24] hover:bg-[#bd691b] text-white font-bold cursor-pointer transition-all shadow-md"
                >
                  Save Product & Sync
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
