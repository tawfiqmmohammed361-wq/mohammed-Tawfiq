import { Product, CartItem, Order, QuoteRequest, Review } from '../types';

export interface BusinessSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessHours: string;
  googleMapUrl: string;
  showroomPhotoUrl: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  newQuoteRequests: number;
  pendingOrders: number;
  pendingMessages: number;
  pendingReviews: number;
  totalRevenue: number;
}

export interface QuoteInput {
  customerName: string;
  phone: string;
  email?: string;
  itemType: string;
  width: string;
  height: string;
  woodType: string;
  designPreference: string;
  finish: string;
  glassOption: string;
  quantity: number;
  location: string;
  additionalRequirements?: string;
  uploadedDesign?: string;
}

export interface ContactInput {
  name: string;
  phone: string;
  email?: string;
  message: string;
}

export interface ReviewInput {
  customerName: string;
  city?: string;
  product: string;
  rating: number;
  review: string;
  image?: string;
}

export const api = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.warn('[API] Fetch products fallback error:', err);
      return [];
    }
  },

  async addProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add product');
    return data.product;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data.product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return true;
  },

  // ORDERS & TRACKING
  async placeOrder(orderData: {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    items: CartItem[];
    subtotal: number;
    discount: number;
    gst: number;
    shipping: number;
    total: number;
    paymentMethod: string;
  }): Promise<Order> {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data.order;
  },

  async trackOrder(orderId: string, phone: string): Promise<any> {
    const res = await fetch(`/api/orders/track?orderId=${encodeURIComponent(orderId)}&phone=${encodeURIComponent(phone)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order not found');
    return data.order;
  },

  async getOrders(): Promise<any[]> {
    const res = await fetch('/api/orders');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load orders');
    return data.orders || [];
  },

  async updateOrderStatus(orderId: string, status: string, note?: string): Promise<any> {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data.order;
  },

  // QUOTES
  async submitQuote(quoteData: QuoteInput): Promise<{ message: string; quote: any }> {
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit quote');
    return data;
  },

  async getQuotes(): Promise<any[]> {
    const res = await fetch('/api/quotes');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load quotes');
    return data.quotes || [];
  },

  async updateQuoteStatus(quoteId: string, status: string): Promise<any> {
    const res = await fetch(`/api/quotes/${quoteId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update quote status');
    return data.quote;
  },

  // CONTACT MESSAGES
  async submitContact(contactData: ContactInput): Promise<{ message: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit message');
    return data;
  },

  async getContacts(): Promise<any[]> {
    const res = await fetch('/api/contact');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load messages');
    return data.contacts || [];
  },

  async updateContactStatus(id: string, status: string): Promise<any> {
    const res = await fetch(`/api/contact/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update contact status');
    return data.contact;
  },

  // REVIEWS
  async getApprovedReviews(): Promise<Review[]> {
    try {
      const res = await fetch('/api/reviews');
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      return (data.reviews || []).map((r: any) => ({
        id: r.id,
        name: r.customerName,
        city: r.city,
        rating: r.rating,
        date: r.date,
        productPurchased: r.product,
        comment: r.review,
        verifiedPurchase: true,
        photoUrl: r.image || undefined,
      }));
    } catch (err) {
      console.warn('[API] Fetch reviews error:', err);
      return [];
    }
  },

  async getAllReviews(): Promise<any[]> {
    const res = await fetch('/api/reviews/all');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load all reviews');
    return data.reviews || [];
  },

  async submitReview(reviewData: ReviewInput): Promise<{ message: string; review: any }> {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit review');
    return data;
  },

  async updateReviewStatus(id: string, status: 'Approved' | 'Rejected' | 'Pending'): Promise<any> {
    const res = await fetch(`/api/reviews/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update review status');
    return data.review;
  },

  // SETTINGS & SHOWROOM
  async getSettings(): Promise<BusinessSettings> {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to load settings');
      const data = await res.json();
      return data.settings;
    } catch (e) {
      return {
        name: 'WOODCRAFT',
        tagline: 'Beautiful Wood. Built to Last.',
        phone: '+91 98450 12345',
        whatsapp: '+91 98450 12345',
        email: 'orders@woodcraft.in',
        address: 'Woodcraft Experience Centre, Plot 42, Timber Yard Industrial Area, South Bengaluru, Karnataka 560078',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560078',
        businessHours: 'Mon - Sat: 9:30 AM - 8:00 PM | Sun: By Appointment',
        googleMapUrl: 'https://maps.google.com/?q=Bengaluru+Timber+Yard',
        showroomPhotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
      };
    }
  },

  async updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
    return data.settings;
  },

  // ADMIN
  async adminLogin(credentials: { username: string; password: string }): Promise<{ token: string; user: any }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Authentication failed');
    return data;
  },

  async getAdminStats(): Promise<DashboardStats> {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin stats');
    return data.stats;
  },

  async getCustomers(): Promise<any[]> {
    const res = await fetch('/api/admin/customers');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch customers');
    return data.customers || [];
  },

  async getSheetsStatus(): Promise<{ configured: boolean; sheetId: string | null }> {
    const res = await fetch('/api/admin/sheets-status');
    const data = await res.json();
    return { configured: Boolean(data.configured), sheetId: data.sheetId || null };
  },

  async syncGoogleSheets(): Promise<{ message: string }> {
    const res = await fetch('/api/admin/sync-sheets', {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Sync failed');
    return data;
  },
};
