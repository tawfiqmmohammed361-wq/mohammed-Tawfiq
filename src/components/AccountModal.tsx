import React, { useState } from 'react';
import { Order, QuoteRequest, CustomDesignConfig } from '../types';
import { 
  X, 
  User, 
  Package, 
  FileText, 
  Compass, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  quotes: QuoteRequest[];
  onTrackOrder: (orderId: string) => void;
  onOpenCustomStudio: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  orders,
  quotes,
  onTrackOrder,
  onOpenCustomStudio,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'orders' | 'quotes' | 'profile'>('orders');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#1c0d06] border border-[#ff8d3f]/30 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#251208]/90 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#ffaa6b]" />
            <h3 className="font-serif-luxury font-bold text-lg text-white">
              Customer Account & Orders
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

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 bg-black/40 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'text-white border-[#d9661c]'
                : 'text-[#fedbc4]/60 border-transparent hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'quotes'
                ? 'text-white border-[#d9661c]'
                : 'text-[#fedbc4]/60 border-transparent hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Saved Quotes ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'text-white border-[#d9661c]'
                : 'text-[#fedbc4]/60 border-transparent hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Member Profile</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-[#fedbc4]/30 mx-auto mb-3" />
                  <h4 className="font-serif-luxury font-bold text-base text-white">No Orders Placed Yet</h4>
                  <p className="text-xs text-[#fedbc4]/60 mt-1">
                    When you order handcrafted doors or windows, you can track timber seasoning and carpentry progress here.
                  </p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <span className="text-[10px] text-[#fedbc4]/60 uppercase tracking-wider block">Order ID</span>
                        <strong className="text-sm font-bold text-white">{order.id}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#fedbc4]/60 uppercase tracking-wider block">Placed On</span>
                        <span className="text-xs text-white">{order.orderDate}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-[#fedbc4]/90">
                          <span>{item.quantity}x {item.name} ({item.selectedWood})</span>
                          <span className="font-bold text-white">₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-3 border-t border-white/10 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d9661c] animate-pulse"></span>
                        <span className="text-xs font-bold text-[#ffaa6b]">Status: {order.status}</span>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(order.id);
                        }}
                        className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Production Tracker &rarr;</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SAVED QUOTES TAB */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              {quotes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-[#fedbc4]/30 mx-auto mb-3" />
                  <h4 className="font-serif-luxury font-bold text-base text-white">No Quotation Requests</h4>
                  <p className="text-xs text-[#fedbc4]/60 mt-1">
                    Submit custom measurements to receive formal architectural quotes with CAD drawings.
                  </p>
                </div>
              ) : (
                quotes.map((q) => (
                  <div key={q.id} className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <div className="flex justify-between items-center">
                      <strong className="text-sm font-bold text-white">{q.itemType}</strong>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#d9661c]/20 text-[#ffaa6b] text-[10px] font-bold border border-[#d9661c]/30">
                        {q.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#fedbc4]/80 space-y-0.5">
                      <div><strong className="text-white">Reference ID:</strong> {q.id} ({q.createdAt})</div>
                      <div><strong className="text-white">Specs:</strong> {q.preferredWood} • {q.requiredSize} • {q.quantity} unit(s)</div>
                      <div><strong className="text-white">Site City:</strong> {q.location}</div>
                      {q.designPhotoName && (
                        <div className="text-emerald-400">Blueprint Attached: {q.designPhotoName}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MEMBER PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs text-[#fedbc4]/80">
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d9661c] to-[#782f07] flex items-center justify-center text-white font-bold text-lg">
                    WC
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">WOODCRAFT Privilege Homeowner</h4>
                    <span className="text-[11px] text-emerald-400 font-semibold">Verified Member Account</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div>
                    <span className="text-[10px] text-[#fedbc4]/50 block">Dedicated Concierge</span>
                    <strong className="text-white text-xs">+91 98450 12345</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#fedbc4]/50 block">Showroom Experience</span>
                    <strong className="text-white text-xs">Bangalore, Mumbai, Delhi</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
