import React, { useState, useEffect } from 'react';
import { MapPin, Phone, MessageSquare, Mail, Clock, Navigation, Camera, Sparkles } from 'lucide-react';
import { BusinessSettings } from '../types';

interface ShowroomSectionProps {
  settings?: BusinessSettings | null;
  onUpdateSettings?: (newSettings: Partial<BusinessSettings>) => Promise<void>;
  onRequestVisit?: () => void;
  onOpenQuote?: () => void;
}

const DEFAULT_SETTINGS: BusinessSettings = {
  name: 'WOODCRAFT Experience Studio',
  businessName: 'WOODCRAFT Doors & Windows',
  tagline: 'Pure Kiln-Dried Hardwood Craftsmanship',
  phone: '+91 98424 04467',
  alternatePhone: '+91 77083 78003',
  whatsapp: '+91 98424 04467',
  whatsappNumber: '+91 98424 04467',
  email: 'tawfiqmmohammed361@gmail.com',
  address: 'Woodcraft Experience Centre, Plot 42, Timber Yard Industrial Area, South Bengaluru, Karnataka 560078',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560078',
  businessHours: 'Mon - Sat: 9:30 AM - 8:00 PM | Sun: By Appointment',
  hours: 'Mon - Sat: 9:30 AM - 8:00 PM | Sun: By Appointment',
  googleMapUrl: 'https://maps.google.com/?q=Bengaluru+Timber+Yard',
  showroomPhotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85',
};

export const ShowroomSection: React.FC<ShowroomSectionProps> = ({
  settings,
  onUpdateSettings,
  onRequestVisit,
  onOpenQuote,
}) => {
  const currentSettings = { ...DEFAULT_SETTINGS, ...(settings || {}) };

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(currentSettings.showroomPhotoUrl || DEFAULT_SETTINGS.showroomPhotoUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings?.showroomPhotoUrl) {
      setPhotoUrlInput(settings.showroomPhotoUrl);
    }
  }, [settings?.showroomPhotoUrl]);

  const rawPhone = currentSettings.phone || currentSettings.whatsappNumber || '+919845012345';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  const rawWhatsApp = currentSettings.whatsappNumber || currentSettings.whatsapp || currentSettings.phone || '+919845012345';
  const cleanWhatsApp = rawWhatsApp.replace(/[^0-9]/g, '');

  const handleSavePhoto = async () => {
    if (!photoUrlInput.trim()) return;
    setIsSaving(true);
    try {
      if (onUpdateSettings) {
        await onUpdateSettings({ showroomPhotoUrl: photoUrlInput });
      }
      setIsEditingPhoto(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setPhotoUrlInput(base64);
        if (onUpdateSettings) {
          setIsSaving(true);
          try {
            await onUpdateSettings({ showroomPhotoUrl: base64 });
          } catch (err) {
            console.error(err);
          } finally {
            setIsSaving(false);
          }
        }
        setIsEditingPhoto(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const displayName = currentSettings.businessName || currentSettings.name || 'WOODCRAFT';
  const displayTagline = currentSettings.tagline || 'Beautiful Wood. Built to Last.';
  const displayHours = currentSettings.businessHours || currentSettings.hours || 'Mon - Sat: 9:30 AM - 8:00 PM';
  const displayAddress = currentSettings.address || 'Woodcraft Experience Centre, Plot 42, Timber Yard Industrial Area, South Bengaluru, Karnataka 560078';
  const displayEmail = currentSettings.email || 'orders@woodcraft.in';
  const displayPhoto = currentSettings.showroomPhotoUrl || DEFAULT_SETTINGS.showroomPhotoUrl || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85';

  return (
    <section id="showroom" className="py-24 bg-[#140b06] relative overflow-hidden border-t border-b border-white/10">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-[#d47a24]/10 via-transparent to-transparent opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d47a24]/15 border border-[#d47a24]/30 text-[#d47a24] text-xs font-bold uppercase tracking-widest mb-4">
            <MapPin className="w-3.5 h-3.5" />
            <span>Experience Center</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Visit Our Live Timber Showroom
          </h2>
          <p className="text-sm sm:text-base text-[#fdfcf0]/70 mt-4 font-light">
            Touch real seasoned Burma Teak, African Teak, and Rosewood doors in person. Feel the weight, examine the mortise-and-tenon joinery, and consult with our master woodcraft estimators.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Real Showroom Photo & Uplink */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-[#1f120a] group h-full min-h-[380px] sm:min-h-[480px]">
              
              <img
                src={displayPhoto}
                alt="WOODCRAFT Doors & Windows Live Experience Showroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#120803] via-[#120803]/40 to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl flex items-center gap-2 text-xs text-white">
                <Sparkles className="w-4 h-4 text-[#d47a24]" />
                <span className="font-medium">Over 50+ Full-Scale Door & Window Displays</span>
              </div>

              {/* Upload / Replace Photo Button */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsEditingPhoto(!isEditingPhoto)}
                  className="bg-black/80 hover:bg-[#d47a24] text-white p-2.5 rounded-full border border-white/20 shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 text-xs cursor-pointer"
                  title="Upload / Change Showroom Photo"
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Change Shop Photo</span>
                </button>
              </div>

              {/* Edit Photo Floating Panel */}
              {isEditingPhoto && (
                <div className="absolute inset-x-4 top-16 bg-[#1c0f08]/95 backdrop-blur-xl border border-[#d47a24]/40 p-4 rounded-2xl shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-200">
                  <h4 className="text-xs font-bold text-[#d47a24] uppercase tracking-wider mb-2">
                    Update Showroom Photo
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2 mb-3">
                    <input
                      type="text"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="Paste Image URL..."
                      className="flex-1 px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d47a24]"
                    />
                    <button
                      onClick={handleSavePhoto}
                      disabled={isSaving}
                      className="px-4 py-2 bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      {isSaving ? 'Saving...' : 'Save URL'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/15 rounded-xl text-xs text-white cursor-pointer transition-colors">
                      <Camera className="w-3.5 h-3.5 text-[#d47a24]" />
                      <span>Or Upload Photo From Device</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <button
                      onClick={() => setIsEditingPhoto(false)}
                      className="px-3 py-2 text-xs text-white/60 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Overlay Bottom Text */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center gap-2 text-[#d47a24] text-xs font-bold uppercase tracking-wider mb-1">
                  <span>{displayName}</span>
                  <span>•</span>
                  <span>{displayTagline}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                  Experience The Substance of Pure Kiln-Dried Hardwood
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column: Address & Business Contact Info */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
            <div className="bg-[#1f120a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex-1 flex flex-col justify-between">
              
              <div className="space-y-6">
                
                {/* Header branding */}
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wide">
                    {displayName}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[#d47a24] font-semibold mt-1">
                    {displayTagline}
                  </p>
                </div>

                {/* Info Items List */}
                <div className="space-y-4 pt-2">
                  
                  {/* Address */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center shrink-0 text-[#d47a24] mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#d47a24] block">
                        Showroom Address
                      </span>
                      <p className="text-xs sm:text-sm text-white/90 font-light mt-0.5 leading-relaxed">
                        {displayAddress}
                      </p>
                    </div>
                  </div>

                  {/* Phone & WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center shrink-0 text-[#d47a24] mt-0.5">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#d47a24] block">
                          Phone Numbers
                        </span>
                        <a
                          href={`tel:${cleanPhone}`}
                          className="text-xs font-semibold text-white hover:text-[#d47a24] transition-colors mt-0.5 block"
                        >
                          {currentSettings.phone || '9842404467'}
                        </a>
                        {currentSettings.alternatePhone && (
                          <a
                            href={`tel:${currentSettings.alternatePhone.replace(/[^0-9]/g, '')}`}
                            className="text-[11px] font-medium text-[#fdfcf0]/70 hover:text-[#d47a24] transition-colors block mt-0.5"
                          >
                            Alt: {currentSettings.alternatePhone}
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                          WhatsApp
                        </span>
                        <a
                          href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello WOODCRAFT, I would like to visit your showroom.')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-white hover:text-emerald-400 transition-colors mt-0.5 block"
                        >
                          {currentSettings.whatsappNumber || currentSettings.whatsapp || '9842404467'}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center shrink-0 text-[#d47a24] mt-0.5">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#d47a24] block">
                        Official Email
                      </span>
                      <a
                        href={`mailto:${displayEmail}`}
                        className="text-xs sm:text-sm text-white/90 hover:text-[#d47a24] font-light mt-0.5 block"
                      >
                        {displayEmail}
                      </a>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-[#d47a24]/15 border border-[#d47a24]/30 flex items-center justify-center shrink-0 text-[#d47a24] mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#d47a24] block">
                        Visiting Hours
                      </span>
                      <p className="text-xs sm:text-sm text-white/90 font-light mt-0.5">
                        {displayHours}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* Direct Action Buttons */}
              <div className="grid grid-cols-3 gap-2.5 pt-6 mt-6 border-t border-white/10">
                <a
                  href={currentSettings.googleMapUrl || 'https://maps.google.com/?q=Bengaluru+Timber+Yard'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/10 hover:bg-[#d47a24] text-white text-xs font-semibold border border-white/15 shadow-md transition-all hover:scale-[1.02] cursor-pointer text-center"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </a>

                <a
                  href={`tel:${cleanPhone}`}
                  className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-white/10 hover:bg-[#d47a24] text-white text-xs font-semibold border border-white/15 shadow-md transition-all hover:scale-[1.02] cursor-pointer text-center"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Us</span>
                </a>

                {onRequestVisit ? (
                  <button
                    onClick={onRequestVisit}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold border border-emerald-400/30 shadow-md transition-all hover:scale-[1.02] cursor-pointer text-center"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Book Visit</span>
                  </button>
                ) : (
                  <a
                    href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent('Hello WOODCRAFT, I would like to enquire about your wooden doors and windows showroom.')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-semibold border border-emerald-400/30 shadow-md transition-all hover:scale-[1.02] cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Us</span>
                  </a>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
