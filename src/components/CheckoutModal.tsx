import React, { useState } from 'react';
import { CartItem, Order, BusinessSettings } from '../types';
import { api } from '../services/api';
import { 
  X, ShieldCheck, Truck, CreditCard, Smartphone, Building2, 
  CheckCircle2, Hammer, Calendar, FileText, Lock, ArrowRight, AlertCircle, Banknote, Phone, MessageSquare
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
  onTrackOrder: (orderId: string) => void;
  settings?: BusinessSettings | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  onTrackOrder,
  settings,
}) => {
  if (!isOpen) return null;

  const phonePrimary = settings?.phone || '9842404467';
  const phoneAlternate = settings?.alternatePhone || '7708378003';
  const contactEmail = settings?.email || 'tawfiqmmohammed361@gmail.com';
  const whatsappNum = settings?.whatsappNumber || settings?.whatsapp || '9842404467';
  const cleanPhone = phonePrimary.replace(/[^0-9]/g, '');
  const cleanAltPhone = phoneAlternate.replace(/[^0-9]/g, '');
  const cleanWA = whatsappNum.replace(/[^0-9]/g, '');

  const [step, setStep] = useState<'details' | 'confirmation'>('details');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [includeCarpenterInstall, setIncludeCarpenterInstall] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'Advance 30%' | 'Pay on Confirmation / COD' | 'UPI / NetBanking' | 'Card'>('Advance 30%');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Price Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal > 25000 ? 0 : 2500;
  const installationCost = includeCarpenterInstall ? cartItems.reduce((sum, i) => sum + (2500 * i.quantity), 0) : 0;
  const total = subtotal + gst + shipping + installationCost;
  const advanceAmount = paymentMethod === 'Advance 30%' ? Math.round(total * 0.3) : total;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');

    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setCheckoutError('Please fill in all required customer and delivery address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await api.placeOrder({
        customerName,
        email: email || `${phone.replace(/[^0-9]/g, '')}@woodcraft-order.in`,
        phone,
        address,
        city,
        state,
        pincode: pincode || '560001',
        items: cartItems,
        subtotal,
        discount: 0,
        gst,
        shipping,
        total,
        paymentMethod: paymentMethod === 'Advance 30%' ? '30% Advance Booking' : paymentMethod,
      });

      setCreatedOrder(order);
      onOrderSuccess(order);
      setStep('confirmation');
    } catch (err: any) {
      setCheckoutError(err.message || 'Unable to place order. Please check your details or contact our showroom directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#1a1009] border border-[#d47a24]/30 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#24130a] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#d47a24]" />
            <h3 className="font-serif font-bold text-lg text-white">
              {step === 'confirmation' ? 'Order Confirmed' : 'Secure Architectural Checkout'}
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

        {/* Content Area */}
        <div className="overflow-y-auto p-6 sm:p-8">
          
          {step === 'confirmation' && createdOrder ? (
            /* Confirmation Screen */
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#d47a24] font-bold">
                  Order Reference: {createdOrder.id}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  Thank You for Your Order!
                </h2>
                <p className="text-xs sm:text-sm text-[#fdfcf0]/80 mt-2 max-w-md mx-auto leading-relaxed">
                  Your bespoke wooden doors & windows order has been assigned to our master timber workshop and logged in our production queue.
                </p>
              </div>

              {/* Order Timeline Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-white/10 max-w-lg mx-auto text-left space-y-3">
                <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[#fdfcf0]/60 block text-[10px]">Estimated Delivery</span>
                    <strong className="text-white font-bold">{createdOrder.estimatedDelivery}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[#fdfcf0]/60 block text-[10px]">Payment Method</span>
                    <span className="text-emerald-400 font-bold">
                      {createdOrder.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-[#fdfcf0]/80 space-y-1">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="font-bold text-white">{createdOrder.customerName} ({createdOrder.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Address:</span>
                    <span className="font-bold text-white">{createdOrder.address}, {createdOrder.city} - {createdOrder.pincode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Order Value:</span>
                    <span className="font-bold text-[#d47a24]">₹{createdOrder.total.toLocaleString('en-IN')}</span>
                  </div>
                  {createdOrder.advancePaid > 0 && createdOrder.advancePaid < createdOrder.total && (
                    <div className="flex justify-between text-xs text-amber-300 font-semibold pt-1 border-t border-white/10">
                      <span>Balance on Delivery & Fitting:</span>
                      <span>₹{(createdOrder.total - createdOrder.advancePaid).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/${cleanWA}?text=${encodeURIComponent(`Hello WOODCRAFT,\n\nI just placed an order on your store!\n\nOrder ID: ${createdOrder.id}\nCustomer: ${createdOrder.customerName}\nTotal Amount: ₹${createdOrder.total.toLocaleString('en-IN')}\nPayment: ${createdOrder.paymentMethod}\n\nItems:\n${createdOrder.items.map(i => `- ${i.name} (${i.quantity}x) - ${i.selectedWood}, ${i.selectedSize}${i.customEngravingText ? ` [Engraving: "${i.customEngravingText}"]` : ''}`).join('\n')}\n\nPlease confirm my order and carpenter site measurement schedule.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Order to WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    onClose();
                    onTrackOrder(createdOrder.id);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#d47a24] hover:bg-[#bd691b] text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Production</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#fdfcf0] text-xs font-semibold cursor-pointer"
                >
                  Back to Showroom
                </button>
              </div>

              {/* Order Concierge Contact */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 max-w-lg mx-auto text-xs text-[#fdfcf0]/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d47a24]" />
                  <span>Helpline: <a href={`tel:${cleanPhone}`} className="text-white font-bold hover:text-[#d47a24]">{phonePrimary}</a></span>
                </div>
                <a
                  href={`https://wa.me/${cleanWA}?text=${encodeURIComponent(`Hello WOODCRAFT, I have a question regarding my Order #${createdOrder.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Order Help ({whatsappNum})</span>
                </a>
              </div>
            </div>
          ) : (
            /* Multi-step Checkout Form */
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {checkoutError && (
                <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Order Mini-Summary Banner */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#fdfcf0]/70 block">Items in Order ({cartItems.reduce((s, i) => s + i.quantity, 0)} units)</span>
                  <span className="text-white font-bold">
                    {cartItems.map(i => i.name).slice(0, 2).join(', ')}
                    {cartItems.length > 2 ? ` + ${cartItems.length - 2} more` : ''}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#fdfcf0]/70 block">Grand Total</span>
                  <span className="text-base font-bold font-serif text-[#d47a24]">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 1. Customer Shipping Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d47a24] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d47a24] text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Delivery Address & Contact Details</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">Phone Number (For Delivery & Fitting) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">Email Address (For Tax Invoice)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">Site / Residence Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat 402, Oakwood Villas, 12th Main..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-[#fdfcf0]/80 block mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="560001"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white placeholder-[#fdfcf0]/40 focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Professional Carpenter Fitting Option */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="carpenterInstall"
                  checked={includeCarpenterInstall}
                  onChange={(e) => setIncludeCarpenterInstall(e.target.checked)}
                  className="mt-1 accent-[#d47a24] cursor-pointer"
                />
                <label htmlFor="carpenterInstall" className="cursor-pointer text-xs">
                  <span className="font-bold text-white block">
                    Include Certified WOODCRAFT Master Carpenter Installation (+₹2,500 / unit)
                  </span>
                  <span className="text-[#fdfcf0]/70 text-[11px] block mt-0.5">
                    Our master carpenters arrive with precision laser levellers, heavy-duty brass hinges, and acoustic draft seals for flawless fitment.
                  </span>
                </label>
              </div>

              {/* 3. Payment Preference */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#d47a24] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#d47a24] text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Payment Schedule & Method</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  <div
                    onClick={() => setPaymentMethod('Advance 30%')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'Advance 30%'
                        ? 'bg-[#d47a24]/15 border-[#d47a24] shadow-md'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">30% Advance Booking</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d47a24] text-white font-bold">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-[11px] text-[#fdfcf0]/70 mt-1">
                      Pay ₹{advanceAmount.toLocaleString('en-IN')} now to initiate timber seasoning. Balance ₹{(total - advanceAmount).toLocaleString('en-IN')} on delivery & fitting.
                    </p>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Pay on Confirmation / COD')}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === 'Pay on Confirmation / COD'
                        ? 'bg-[#d47a24]/15 border-[#d47a24] shadow-md'
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white">Pay on Confirmation / COD</span>
                      <Banknote className="w-4 h-4 text-[#d47a24]" />
                    </div>
                    <p className="text-[11px] text-[#fdfcf0]/70 mt-1">
                      Our estimator calls to verify site measurements before collecting payment.
                    </p>
                  </div>

                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-[#d47a24]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Placing Joinery Order...</span>
                  ) : (
                    <>
                      <span>
                        Confirm Order ({paymentMethod === 'Advance 30%' ? `Pay ₹${advanceAmount.toLocaleString('en-IN')} Advance` : `Total ₹${total.toLocaleString('en-IN')}`})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
