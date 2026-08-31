import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Clock, Truck, ShieldCheck, Flame, Hammer, 
  Sparkles, Search, AlertCircle, Phone, Package, Calendar
} from 'lucide-react';
import { api } from '../services/api';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [phoneQuery, setPhoneQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderData, setOrderData] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialOrderId) {
        setOrderQuery(initialOrderId);
        handleLookup(initialOrderId, '');
      } else {
        setOrderData(null);
        setErrorMsg('');
      }
    }
  }, [isOpen, initialOrderId]);

  if (!isOpen) return null;

  const handleLookup = async (orderId: string, phone: string) => {
    if (!orderId.trim() && !phone.trim()) {
      setErrorMsg('Please enter either your Order ID or registered Phone Number.');
      return;
    }

    setIsSearching(true);
    setErrorMsg('');

    try {
      const order = await api.trackOrder(orderId.trim(), phone.trim());
      setOrderData(order);
    } catch (err: any) {
      setErrorMsg(err.message || 'No matching joinery order found. Please check your details.');
      setOrderData(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup(orderQuery, phoneQuery);
  };

  const stageList = [
    { key: 'New', label: 'Order Placed', desc: 'Order received and logged in system', icon: Clock },
    { key: 'Confirmed', label: 'Confirmed & Log Selection', desc: 'Timber logs selected and scanned for grain symmetry', icon: CheckCircle2 },
    { key: 'Processing', label: 'Kiln Seasoning & Joinery', desc: 'Vacuum chamber moisture locking & mortise-and-tenon carving', icon: Hammer },
    { key: 'Ready', label: 'Polish & Quality Check', desc: '4-coat PU polish applied and timber crate packaging complete', icon: ShieldCheck },
    { key: 'Shipped', label: 'Dispatched in Transit', desc: 'In transit with white-glove cargo freight', icon: Truck },
    { key: 'Delivered', label: 'Delivered & Fitted', desc: 'Safely delivered and installed by master carpenters', icon: Sparkles },
  ];

  const getStageIndex = (status: string) => {
    const map: Record<string, number> = {
      New: 0,
      Confirmed: 1,
      Processing: 2,
      Ready: 3,
      Shipped: 4,
      Delivered: 5,
      Cancelled: -1,
    };
    return map[status] ?? 2;
  };

  const currentStageIdx = orderData ? getStageIndex(orderData.status) : -1;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1a1009] border border-[#d47a24]/30 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#24130a] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#d47a24]" />
            <h3 className="font-serif font-bold text-lg text-white">
              Live Timber Order & Fitting Tracker
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Lookup Input Form */}
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                  Order ID (e.g. WC-ORD-...)
                </label>
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="WC-ORD-89472"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                  Or Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneQuery}
                  onChange={(e) => setPhoneQuery(e.target.value)}
                  placeholder="+91 98450 XXXXX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-2.5 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Tracking Live Joinery State...' : 'Track My Order'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* If Order Data is Found */}
          {orderData ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <span className="text-[#fdfcf0]/60 text-[10px] uppercase font-bold tracking-wider">
                    Customer: {orderData.customerName}
                  </span>
                  <div className="font-mono font-bold text-white text-sm mt-0.5">
                    {orderData.id}
                  </div>
                  <div className="text-[11px] text-[#fdfcf0]/60 mt-0.5">
                    Placed: {orderData.orderDate} • {orderData.items?.length || 1} Item(s)
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[#fdfcf0]/60 text-[10px] uppercase font-bold tracking-wider block">
                    Current Joinery Status
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d47a24]/20 border border-[#d47a24]/40 text-[#d47a24] font-bold text-xs mt-1">
                    {orderData.status}
                  </span>
                  <div className="text-[11px] font-bold text-white mt-1">
                    Total: ₹{(orderData.total || 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d47a24]">
                  Production & Delivery Milestones
                </h4>

                <div className="space-y-4">
                  {stageList.map((stage, idx) => {
                    const isCompleted = currentStageIdx > idx;
                    const isCurrent = currentStageIdx === idx;
                    const Icon = stage.icon;

                    return (
                      <div
                        key={stage.key}
                        className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-[#d47a24]/15 border-[#d47a24]/50 shadow-lg'
                            : isCompleted
                            ? 'bg-black/30 border-white/10 opacity-90'
                            : 'bg-black/20 border-white/5 opacity-50'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isCurrent
                              ? 'bg-[#d47a24] text-white shadow-md'
                              : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-white/5 text-white/40'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isCurrent ? 'text-[#d47a24]' : 'text-white'}`}>
                              {stage.label}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47a24] bg-[#d47a24]/20 px-2 py-0.5 rounded-full animate-pulse">
                                In Progress
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#fdfcf0]/70 mt-0.5">
                            {stage.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items List */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#d47a24]">
                  Items Ordered
                </h5>
                {(orderData.items || []).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs py-1 border-b border-white/5 last:border-0">
                    <span className="text-white font-medium">{item.name} ({item.selectedWood}, {item.selectedSize}) x {item.quantity}</span>
                    <span className="text-[#d47a24] font-bold">₹{((item.unitPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="text-xs text-[#fdfcf0]/70 p-3 rounded-xl bg-white/5 border border-white/5">
                <span className="font-semibold text-white block mb-0.5">Delivery Destination:</span>
                {orderData.deliveryAddress || `${orderData.city}, ${orderData.pincode}`}
              </div>

            </div>
          ) : (
            <div className="p-6 text-center text-xs text-[#fdfcf0]/50 bg-black/20 rounded-2xl border border-white/5">
              Enter your Order Number (e.g. <span className="text-white font-mono">WC-ORD-89472</span>) or phone number above to trace your seasoned timber joinery in real-time.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
