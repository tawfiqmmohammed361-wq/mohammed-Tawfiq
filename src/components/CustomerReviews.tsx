import React, { useState, useEffect } from 'react';
import { REVIEWS } from '../data/reviews';
import { Review } from '../types';
import { api } from '../services/api';
import { Star, CheckCircle2, MapPin, Plus, Camera, X, Check, MessageSquare } from 'lucide-react';

interface CustomerReviewsProps {
  initialReviews?: Review[];
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ initialReviews }) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews || REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Review Form state
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [product, setProduct] = useState('Grand Teak Main Door');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    loadApprovedReviews();
  }, []);

  const loadApprovedReviews = async () => {
    try {
      const fetched = await api.getApprovedReviews();
      if (fetched && fetched.length > 0) {
        setReviewsList(fetched);
      }
    } catch (e) {
      console.warn('Fallback to local reviews:', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage((event.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !reviewText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.submitReview({
        customerName: name,
        city: city || 'India',
        product,
        rating,
        review: reviewText,
        image,
      });

      setSubmitMessage(res.message);
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitMessage('');
        setName('');
        setCity('');
        setReviewText('');
        setImage('');
      }, 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#d47a24] font-bold">
            Real Homeowner Stories
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold italic text-[#fdfcf0] mt-1.5">
            Loved by Homeowners
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex text-[#d47a24]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-[#d47a24]" />
              ))}
            </div>
            <span className="text-sm font-bold text-[#fdfcf0]">4.96 / 5.0</span>
            <span className="text-xs text-[#fdfcf0]/60 hidden sm:inline">(Verified Timber Installations)</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-[#d47a24] hover:bg-[#bd691b] text-white text-xs font-bold transition-all shadow-md shadow-[#d47a24]/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviewsList.map((review) => (
          <div
            key={review.id}
            id={`review-card-${review.id}`}
            className="p-6 sm:p-8 rounded-3xl bg-[#1c0f08]/80 backdrop-blur-md border border-white/10 hover:border-[#d47a24] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Stars & Date */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-[#d47a24]">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d47a24]" />
                  ))}
                </div>
                <span className="text-xs text-[#fdfcf0]/50">{review.date}</span>
              </div>

              {/* Product Purchased Tag */}
              <div className="inline-block px-3 py-1 rounded-full bg-[#d47a24]/15 border border-[#d47a24]/30 text-[11px] font-bold text-[#d47a24] mb-3">
                Purchased: {review.productPurchased}
              </div>

              {/* Quote text */}
              <p className="text-xs sm:text-sm text-[#fdfcf0]/90 leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>

            {/* Author Profile & Installed Door Photo */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {review.avatarUrl ? (
                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#d47a24]/20 border border-[#d47a24]/30 flex items-center justify-center font-bold text-[#d47a24] text-sm">
                    {review.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-[#fdfcf0] flex items-center gap-1.5">
                    <span>{review.name}</span>
                    {review.verifiedPurchase && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#d47a24]" title="Verified Buyer" />
                    )}
                  </h4>
                  <p className="text-[11px] text-[#fdfcf0]/60 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d47a24]" />
                    <span>{review.city}</span>
                  </p>
                </div>
              </div>

              {/* Installed Image Preview thumbnail */}
              {review.photoUrl && (
                <div className="relative w-12 h-14 rounded-xl overflow-hidden border border-white/20 shrink-0 shadow-md">
                  <img src={review.photoUrl} alt="Installed product" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-center text-[#fdfcf0] py-0.5">
                    Photo
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#1c0f08] border border-[#d47a24]/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="text-base font-serif font-bold text-white">
                Share Your WOODCRAFT Experience
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitMessage ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Review Submitted!</h4>
                <p className="text-xs text-[#fdfcf0]/80 max-w-sm mx-auto leading-relaxed">
                  {submitMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-3.5 text-xs">
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh K."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Door / Window Model Purchased
                  </label>
                  <input
                    type="text"
                    required
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="e.g. Grand Burma Teak Entrance Door"
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Your Rating (1 to 5 Stars)
                  </label>
                  <div className="flex gap-2 text-[#d47a24]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-lg cursor-pointer"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-[#d47a24]' : 'text-white/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Your Review *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe the wood quality, seasoning, finish, and carpenter installation..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white focus:outline-none focus:border-[#d47a24]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#d47a24] mb-1">
                    Upload Installed Door Photo (Optional)
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-white/20 hover:border-[#d47a24] bg-black/30 hover:bg-white/5 cursor-pointer transition-colors text-[#fdfcf0]/70">
                    <Camera className="w-4 h-4 text-[#d47a24]" />
                    <span>{image ? 'Photo selected' : 'Choose photo from device'}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#d47a24] hover:bg-[#bd691b] text-white font-bold cursor-pointer transition-all shadow-md"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
