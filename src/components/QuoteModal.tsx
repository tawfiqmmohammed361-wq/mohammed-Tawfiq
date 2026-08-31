import React, { useState, useRef } from 'react';
import { QuoteRequest, BusinessSettings } from '../types';
import { api } from '../services/api';
import { 
  X, Sparkles, UploadCloud, FileText, CheckCircle2, 
  Phone, Mail, MapPin, Ruler, Layers, AlertCircle, ArrowRight, ShieldCheck, MessageSquare
} from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitQuote?: (quote: any) => void;
  prefillItemType?: string;
  prefillWood?: string;
  prefillSize?: string;
  settings?: BusinessSettings | null;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  onSubmitQuote,
  prefillItemType = 'Door',
  prefillWood = 'Burma Teak',
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

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [doorOrWindow, setDoorOrWindow] = useState(prefillItemType || 'Door');
  const [width, setWidth] = useState('4.0 ft');
  const [height, setHeight] = useState('7.5 ft');
  const [preferredWood, setPreferredWood] = useState(prefillWood || 'Burma Teak');
  const [designPreference, setDesignPreference] = useState('Architectural Modern Pivot');
  const [finish, setFinish] = useState('Honey Oak Polish');
  const [glassOption, setGlassOption] = useState('None (Solid Wood)');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [additionalReqs, setAdditionalReqs] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successQuoteId, setSuccessQuoteId] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedBase64((event.target?.result as string) || file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!name.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 8) {
      setSubmitError('Please enter a valid phone number so our woodcraft estimator can reach you.');
      return;
    }
    if (!location.trim()) {
      setSubmitError('Please enter your city/location for site delivery or measurement estimation.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitQuote({
        customerName: name,
        phone,
        email,
        itemType: doorOrWindow,
        width,
        height,
        woodType: preferredWood,
        designPreference,
        finish,
        glassOption,
        quantity: Number(quantity) || 1,
        location,
        additionalRequirements: additionalReqs,
        uploadedDesign: uploadedFileName || uploadedBase64,
      });

      setSuccessQuoteId(res.quote?.id || `QT-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
      if (onSubmitQuote) {
        onSubmitQuote(res.quote);
      }
    } catch (err: any) {
      setSubmitError(
        err.message || 'Unable to submit quotation request at this time. Please check your network or try WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setPhone('');
    setEmail('');
    setLocation('');
    setAdditionalReqs('');
    setUploadedFileName('');
    setUploadedBase64('');
    setSubmitError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#1a1009] border border-[#d47a24]/30 shadow-2xl shadow-black overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#24130a] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d47a24]" />
            <h3 className="font-serif font-bold text-lg text-white">
              Get a Free Quote & Architectural Estimation
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-[#d47a24] bg-black/40 px-3 py-1 rounded-full border border-white/10">
                  Quote Ref: {successQuoteId}
                </span>
                <h4 className="font-serif font-bold text-2xl text-white">
                  Quotation Request Received
                </h4>
                <p className="text-sm text-emerald-300 font-medium max-w-md mx-auto">
                  Thank you! Your quotation request has been received. Our team will contact you soon.
                </p>
                <p className="text-xs text-[#fdfcf0]/60 max-w-md mx-auto pt-2">
                  Our timber joinery specialist will review your specifications ({width} x {height} {preferredWood} {doorOrWindow}) and contact you via WhatsApp / Phone to confirm final pricing and site measurements.
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleResetAndClose}
                  className="px-8 py-3 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs text-[#fdfcf0]">
              
              {submitError && (
                <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98450 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>
              </div>

              {/* Product Type & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Door or Window *
                  </label>
                  <select
                    value={doorOrWindow}
                    onChange={(e) => setDoorOrWindow(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="Main Entrance Door">Main Entrance Door</option>
                    <option value="Bedroom Door">Bedroom Door</option>
                    <option value="Pooja Room Door">Pooja Room Door</option>
                    <option value="Wooden Casement Window">Wooden Casement Window</option>
                    <option value="Sliding Patio Window / Door">Sliding Patio Window / Door</option>
                    <option value="Custom Timber Joinery">Custom Timber Joinery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Width *
                  </label>
                  <input
                    type="text"
                    required
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g. 4.0 ft or 1200 mm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Height *
                  </label>
                  <input
                    type="text"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 7.5 ft or 2280 mm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>
              </div>

              {/* Timber & Finish Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Preferred Wood *
                  </label>
                  <select
                    value={preferredWood}
                    onChange={(e) => setPreferredWood(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="Burma Teak">Burma Teak (Highest Grade)</option>
                    <option value="African Teak (CP)">African Teak (CP - Most Popular)</option>
                    <option value="Indian Rosewood (Sheesham)">Indian Rosewood (Sheesham)</option>
                    <option value="American White Oak">American White Oak</option>
                    <option value="Red Meranti">Red Meranti</option>
                    <option value="Honshu Pine">Honshu Pine</option>
                    <option value="Mahogany">Mahogany</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Design Preference
                  </label>
                  <select
                    value={designPreference}
                    onChange={(e) => setDesignPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="Architectural Modern Pivot">Architectural Modern Pivot</option>
                    <option value="Classic 4-Panel Roman">Classic 4-Panel Roman</option>
                    <option value="Traditional Floral Carved & Bells">Traditional Floral Carved & Bells</option>
                    <option value="CNC Geometric Jaali Pattern">CNC Geometric Jaali Pattern</option>
                    <option value="Fluted Vertical Ribbed Contemporary">Fluted Vertical Ribbed Contemporary</option>
                    <option value="Plain Solid Flush Timber">Plain Solid Flush Timber</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Finish
                  </label>
                  <select
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="Honey Oak Polish">Honey Oak Polish (Natural Luster)</option>
                    <option value="Natural Matte">Natural Matte (Scandinavian)</option>
                    <option value="Deep Walnut Gloss">Deep Walnut Gloss</option>
                    <option value="Espresso Dark">Espresso Dark</option>
                    <option value="Rustic Weathered">Rustic Weathered</option>
                    <option value="Raw Sanded Untreated">Raw Sanded Untreated</option>
                  </select>
                </div>
              </div>

              {/* Glass Option, Quantity & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Glass Option
                  </label>
                  <select
                    value={glassOption}
                    onChange={(e) => setGlassOption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24] cursor-pointer"
                  >
                    <option value="None (Solid Wood)">None (100% Solid Wood)</option>
                    <option value="Clear Toughened (6mm)">Clear Toughened (6mm)</option>
                    <option value="Frosted Privacy Glass">Frosted Privacy Glass</option>
                    <option value="Fluted Reeded Glass">Fluted Reeded Glass</option>
                    <option value="Double Glazed Acoustic DGU">Double Glazed Acoustic DGU</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                    Project City / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, Hyderabad, Chennai"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                  />
                </div>
              </div>

              {/* Upload Design Reference & Additional Requirements */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                  Upload Design / Reference Photo (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/20 hover:border-[#d47a24] rounded-2xl p-4 text-center bg-black/30 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <UploadCloud className="w-5 h-5 text-[#d47a24]" />
                  <span className="text-xs text-white">
                    {uploadedFileName ? uploadedFileName : 'Click to select reference blueprint, photo, or CAD sketch'}
                  </span>
                  <span className="text-[10px] text-[#fdfcf0]/50">
                    JPG, PNG, PDF up to 10MB
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#d47a24] mb-1">
                  Additional Requirements / Carving Notes
                </label>
                <textarea
                  rows={2}
                  value={additionalReqs}
                  onChange={(e) => setAdditionalReqs(e.target.value)}
                  placeholder="Mention frame requirements, architraves, biometric lock provisions, brass insets, or site constraints..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                />
              </div>

              {/* Disclaimer */}
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-[#fdfcf0]/70 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#d47a24] shrink-0" />
                <span>
                  <strong>Note:</strong> Final pricing will be confirmed by WOODCRAFT following timber grade inspection and exact site measurement.
                </span>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-[#d47a24]/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Quotation Request...</span>
                  ) : (
                    <>
                      <span>Submit Quotation Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Instant Assistance Info */}
              <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#fdfcf0]/70">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#d47a24]" />
                  <span>Call: <a href={`tel:${cleanPhone}`} className="text-white hover:text-[#d47a24] font-medium">{phonePrimary}</a> {phoneAlternate && <>| <a href={`tel:${cleanAltPhone}`} className="text-white hover:text-[#d47a24]">{phoneAlternate}</a></>}</span>
                </div>
                <a
                  href={`https://wa.me/${cleanWA}?text=${encodeURIComponent('Hello WOODCRAFT, I would like an urgent quotation for custom doors.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Instant WhatsApp Enquiry</span>
                </a>
              </div>

            </form>
          )}
        </div>

      </div>

    </div>
  );
};
